import { google } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
// keeping for storage usage if needed, but better use server client
import { createClient } from '@/lib/supabase/server';
import { RateLimiter } from '@/lib/rateLimit';
import { headers } from 'next/headers';

const limiter = new RateLimiter(60 * 1000, 5); // 5 requests per minute

const SYSTEM_PROMPT = `Bạn là một Cố vấn Kỹ thuật cấp cao, chuyên sâu về Cơ điện tử, Tự động hóa, Vi xử lý, Khoa học máy tính, Vô tuyến điện, Viễn thông, và Anten.
Nhiệm vụ của bạn:
- Hướng dẫn kỹ sư và sinh viên cách thiết kế, lựa chọn linh kiện, lập trình và giải quyết lỗi.
- Cung cấp câu trả lời rõ ràng, định dạng dễ đọc bằng Markdown (có highlight code nếu là source code).
- Luôn giữ thái độ chuyên nghiệp, khuyến khích tính thực tiễn và tiết kiệm chi phí cho dự án.
- Bạn có khả năng phân tích hình ảnh đính kèm (sơ đồ khối, mạch điện). Khi nhận được hình ảnh, hãy phân tích cặn kẽ và giải thích rõ ràng.
- Sử dụng công cụ "analyzeGithubRepo" nếu người dùng gửi link Github để phân tích repo.
- Sử dụng công cụ "searchGithub" nếu người dùng yêu cầu tìm kiếm các mã nguồn, dự án mẫu trên Github.
- Sử dụng công cụ "search3DModels" nếu người dùng yêu cầu tìm vỏ hộp, thiết kế in 3D (STL, STEP) cho dự án. Luôn liệt kê các đường link tìm kiếm (MakerWorld, Thingiverse...) để người dùng click vào.
`;

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        const headerStore = await headers();
        const ip = headerStore.get('x-forwarded-for') || '127.0.0.1';
        
        const identifier = user?.id || ip;
        const { success } = limiter.limit(identifier);
        
        if (!success) {
            return NextResponse.json({ error: 'Bạn thao tác quá nhanh, vui lòng đợi một lát.' }, { status: 429 });
        }

        // Must clone the request or read it once
        const body = await request.json();
        const { messages, sessionId } = body;
        
        // Save user message
        if (sessionId && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === 'user') {
                const content = typeof lastMsg.content === 'string' ? lastMsg.content : (lastMsg.parts?.filter((p: Record<string, unknown>) => p.type === 'text').map((p: Record<string, unknown>) => p.text).join('') || '');
                
                // Upload images if any
                const imageUrls: string[] = [];
                if (lastMsg.experimental_attachments && lastMsg.experimental_attachments.length > 0) {
                    for (const attachment of lastMsg.experimental_attachments) {
                        if (attachment.contentType?.startsWith('image/') && attachment.url?.startsWith('data:image')) {
                            const base64Data = attachment.url.split(',')[1];
                            if (base64Data) {
                                const fileName = `${sessionId}_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
                                const buffer = Buffer.from(base64Data, 'base64');
                                const { error: uploadError } = await supabase.storage
                                    .from('chat_attachments')
                                    .upload(fileName, buffer, { contentType: attachment.contentType });
                                
                                if (!uploadError) {
                                    const { data: publicUrlData } = supabase.storage.from('chat_attachments').getPublicUrl(fileName);
                                    imageUrls.push(publicUrlData.publicUrl);
                                }
                            }
                        }
                    }
                }

                await supabase.from('chat_messages').insert([{
                    session_id: sessionId,
                    role: 'user',
                    content: content,
                    images: imageUrls
                }]);
            }
        }
        
        // Convert UI messages from useChat to ModelMessages that streamText understands
        const coreMessages = await convertToModelMessages(messages);

        const githubHeaders: Record<string, string> = { 'User-Agent': 'AILab-Bot' };
        if (process.env.GITHUB_TOKEN) {
            githubHeaders['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const result = await streamText({
            model: google('gemini-2.5-flash'),
            system: SYSTEM_PROMPT,
            messages: coreMessages,
            tools: {
                search3DModels: tool({
                    description: 'Tìm kiếm file in 3D (vỏ hộp, linh kiện) trên Github và tạo liên kết tìm kiếm cho các nền tảng in 3D (MakerWorld, Thingiverse).',
                    parameters: z.object({
                        query: z.string().describe('Từ khóa tiếng Anh ngắn gọn để tìm kiếm (VD: ESP32 case, ultrasonic mount)'),
                    }),
                    // @ts-expect-error: TS incompatibility with Zod and AI SDK
                    execute: async ({ query }) => {
                        try {
                            const githubRes = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query + ' 3d print stl case')}&sort=stars&per_page=3`, {
                                headers: githubHeaders
                            });
                            
                            let githubRepos: { name: string; repo: string; url: string; description: string }[] = [];
                            if (githubRes.ok) {
                                const data = await githubRes.json();
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                githubRepos = (data.items || []).map((item: any) => ({
                                    name: item.name,
                                    repo: item.full_name,
                                    url: item.html_url,
                                    description: item.description
                                }));
                            }

                            const q = encodeURIComponent(query);
                            return {
                                githubProjects: githubRepos,
                                externalSearchLinks: [
                                    { platform: 'MakerWorld', url: `https://makerworld.com/en/search/models?keyword=${q}` },
                                    { platform: 'Thingiverse', url: `https://www.thingiverse.com/search?q=${q}&type=things&sort=relevant` },
                                    { platform: 'Printables', url: `https://www.printables.com/search/all?q=${q}` },
                                    { platform: 'Yeggi', url: `https://www.yeggi.com/q/${q.replace(/%20/g, '+')}/` }
                                ],
                                error: null as string | null
                            };
                        } catch {
                            return { 
                                githubProjects: [], 
                                externalSearchLinks: [],
                                error: 'Lỗi khi lấy dữ liệu 3D' 
                            };
                        }
                    },
                }),
                searchGithub: tool({
                    description: 'Tìm kiếm các kho lưu trữ (repository) trên Github dựa trên từ khóa.',
                    parameters: z.object({
                        query: z.string().describe('Từ khóa tìm kiếm (VD: ESP32 IoT, Arduino PID controller)'),
                    }),
                    // @ts-expect-error: ignoring type
                    execute: async ({ query }) => {
                        try {
                            const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=3`, {
                                headers: githubHeaders
                            });
                            if (!res.ok) return { items: [], error: 'Lỗi khi gọi Github API' };
                            const data = await res.json();
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const items = data.items.map((item: any) => ({
                                name: item.name,
                                full_name: item.full_name,
                                description: item.description,
                                html_url: item.html_url,
                                stars: item.stargazers_count,
                                language: item.language
                            })) as { name: string; full_name: string; description: string; html_url: string; stars: number; language: string }[];
                            return { items, error: null as string | null };
                        } catch {
                            return { items: [], error: 'Không thể truy cập Github' };
                        }
                    },
                }),
                analyzeGithubRepo: tool({
                    description: 'Phân tích một kho lưu trữ Github bằng cách lấy thông tin và nội dung file README.md',
                    parameters: z.object({
                        repoFullName: z.string().describe('Tên đầy đủ của repo (VD: microsoft/TypeScript)'),
                    }),
                    // @ts-expect-error: TS incompatibility with Zod and AI SDK
                    execute: async ({ repoFullName }) => {
                        try {
                            const readmeRes = await fetch(`https://api.github.com/repos/${repoFullName}/readme`, {
                                headers: githubHeaders
                            });
                            let readmeContent = 'Không tìm thấy file README';
                            if (readmeRes.ok) {
                                const readmeData = await readmeRes.json();
                                readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');
                                if (readmeContent.length > 3000) {
                                    readmeContent = readmeContent.substring(0, 3000) + '... (nội dung đã bị cắt bớt)';
                                }
                            }
                            return {
                                repo: repoFullName,
                                readme: readmeContent,
                                error: null as string | null
                            };
                        } catch {
                            return { repo: repoFullName, readme: '', error: 'Không thể đọc Github repo' };
                        }
                    },
                }),
            },
            onError: ({ error }) => {
                console.error('streamText internal error:', error);
            },
            onFinish: async ({ text }) => {
                if (sessionId && text) {
                    // Create a separate supabase client since the request scope might be closed
                    const { createClient } = await import('@supabase/supabase-js');
                    const sbAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
                    
                    await sbAdmin.from('chat_messages').insert([{
                        session_id: sessionId,
                        role: 'assistant',
                        content: text
                    }]);
                }
            }
        });
        
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Chat API Error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
