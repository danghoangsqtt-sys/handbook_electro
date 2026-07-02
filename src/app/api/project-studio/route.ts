import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { RateLimiter } from '@/lib/rateLimit';
import { headers, cookies } from 'next/headers';

const limiter = new RateLimiter(60 * 1000, 5); // 5 requests per minute

const SYSTEM_PROMPT = `Bạn là một Kỹ sư Cơ điện tử và Tự động hóa cấp cao.
Nhiệm vụ của bạn là phân tích danh sách linh kiện (Bill of Materials - BOM) do người dùng cung cấp và ý tưởng dự án của họ.
Hãy trả lời BẰNG TIẾNG VIỆT dưới dạng JSON với 3 trường sau:

1. compatibility_analysis: Đánh giá khả năng tương thích của các linh kiện. Sử dụng Markdown. BẮT BUỘC chia thành các phần: "### ĐÁNH GIÁ TỔNG QUAN", "### ĐIỂM MẠNH", "### HẠN CHẾ / LƯU Ý".
2. wiring_diagram: Cung cấp sơ đồ đấu nối chân. BẮT BUỘC dùng định dạng:
   - Một khối ASCII Art Text (đặt trong code block \`\`\`text) mô tả trực quan cách nối dây. Ví dụ: 5V(Nguồn) ---- VCC(Cảm biến).
   - Một Markdown Table bên dưới khối ASCII có 3 cột: | TỪ (LINH KIỆN:CHÂN) | ĐẾN (LINH KIỆN:CHÂN) | GHI CHÚ |.
3. sample_code: Viết một đoạn code mẫu ngắn (thường là C/C++ cho Arduino/ESP) để kiểm tra các linh kiện này. Bắt đầu bằng \`\`\`cpp và kết thúc bằng \`\`\`.

Hãy đảm bảo output luôn tuân thủ chuẩn JSON.
`;

const schema = z.object({
  compatibility_analysis: z.string().describe('Đánh giá tương thích linh kiện (Markdown) chia thành 3 phần như yêu cầu'),
  wiring_diagram: z.string().describe('Sơ đồ nối dây dạng ASCII Art text block VÀ một bảng Markdown Table'),
  sample_code: z.string().describe('Đoạn code mẫu Markdown chứa code')
});

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const pin = cookieStore.get('auth_user_id')?.value || 'anonymous';
        const headerStore = await headers();
        const ip = headerStore.get('x-forwarded-for') || '127.0.0.1';
        
        const identifier = pin !== 'anonymous' ? pin : ip;
        const { success } = limiter.limit(identifier);
        
        if (!success) {
            return NextResponse.json({ error: 'Bạn thao tác quá nhanh, vui lòng đợi một lát.' }, { status: 429 });
        }
        const { bomItems, projectIdea } = await request.json();
        
        let userMessage = `Danh sách linh kiện (BOM) hiện có:\n`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bomItems.forEach((item: any) => {
            userMessage += `- ${item.name} (${item.quantity} cái)\n`;
        });

        userMessage += `\nÝ tưởng dự án: ${projectIdea || 'Hãy tư vấn cách nối và code cơ bản cho các linh kiện này.'}`;

        const { object } = await generateObject({
            model: google('gemini-2.5-flash'),
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userMessage }],
            schema: schema,
        });
        
        return NextResponse.json(object);
    } catch (error) {
        console.error('Project Studio API error:', error);
        return NextResponse.json({ error: 'Lỗi trong quá trình phân tích.' }, { status: 500 });
    }
}
