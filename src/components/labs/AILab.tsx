/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useEffect, useRef, useState } from 'react';
import AuthModal from '../auth/AuthModal';
import AILabSidebar from './AILabSidebar';
import { useBOMStore } from '@/store/useBOMStore';
import ProjectStudioWorkspace from './ProjectStudioWorkspace';
import { createClient } from '@/lib/supabase/client';

const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    
    if (!inline && match) {
        const codeContent = String(children).replace(/\n$/, '');
        const handleCopy = () => {
            navigator.clipboard.writeText(codeContent);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        };
        
        return (
            <div className="my-4 rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono flex items-center justify-between">
                    <span className="uppercase tracking-wider font-semibold">{match[1]}</span>
                    <button 
                        onClick={handleCopy}
                        className="hover:text-white transition-colors flex items-center gap-1.5 bg-slate-700/50 hover:bg-slate-700 px-2.5 py-1 rounded-md"
                        title="Copy code"
                    >
                        {isCopied ? <><i className="fa-solid fa-check text-green-400"></i> <span className="text-green-400">Copied!</span></> : <><i className="fa-regular fa-copy"></i> Copy</>}
                    </button>
                </div>
                <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    className="!m-0 !bg-[#1E1E1E]"
                    showLineNumbers={true}
                    customStyle={{ margin: 0, borderRadius: 0, fontSize: '13px' }}
                    {...props}
                >
                    {codeContent}
                </SyntaxHighlighter>
            </div>
        );
    }
    return (
        <code className={`${className} bg-slate-200/80 dark:bg-slate-700/80 px-1.5 py-0.5 rounded-md text-pink-600 dark:text-pink-400 font-mono text-sm break-all`} {...props}>
            {children}
        </code>
    );
};

export default function AILab() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isProjectStudioOpen, setIsProjectStudioOpen } = useBOMStore();
    
    // Sessions
    const [sessions, setSessions] = useState<any[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const { setCurrentProjectId } = useBOMStore();

    const [files, setFiles] = useState<FileList | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState('');

    const supabase = createClient();

    const { messages, sendMessage, status, error, setMessages } = useChat({
        generateId: () => Math.random().toString(36).substring(2, 15)
    });
    const isLoading = status === 'submitted' || status === 'streaming';
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const loadSessions = async () => {
        try {
            const [chatRes, projRes] = await Promise.all([
                fetch('/api/chat-sessions'),
                fetch('/api/project-sessions') // Assume project-sessions also needs update? We will check if it works
            ]);
            let combined: any[] = [];
            if (chatRes.ok) {
                const chatData = await chatRes.json();
                combined = [...combined, ...chatData.map((s: any) => ({ ...s, type: 'chat' }))];
            }
            if (projRes.ok) {
                const projData = await projRes.json();
                combined = [...combined, ...projData.map((s: any) => ({ ...s, type: 'project' }))];
            }
            combined.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            setSessions(combined);
        } catch {}
    };

    // Initial load: check auth and load sessions
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setAuthenticated(true);
                loadSessions();
            } else {
                setAuthenticated(false);
            }
        };
        checkAuth();

        const handleReload = () => loadSessions();
        window.addEventListener('reloadSessions', handleReload);
        return () => window.removeEventListener('reloadSessions', handleReload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load messages when currentSessionId changes
    useEffect(() => {
        if (currentSessionId) {
            const session = sessions.find(s => s.id === currentSessionId);
            if (session?.type === 'project') {
                setIsProjectStudioOpen(true);
                setCurrentProjectId(session.id);
            } else {
                setIsProjectStudioOpen(false);
                fetch(`/api/chat-messages?sessionId=${currentSessionId}`)
                    .then(res => res.ok ? res.json() : [])
                    .then(data => setMessages(data))
                    .catch(() => setMessages([]));
            }
        } else {
            setMessages([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSessionId, setMessages]); // Omit sessions to avoid re-renders loop if sessions update

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleNewSession = () => {
        setCurrentSessionId(null);
        setCurrentProjectId(null);
        setIsProjectStudioOpen(false);
        setMessages([]);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
            const session = sessions.find(s => s.id === id);
            const endpoint = session?.type === 'project' ? '/api/project-sessions' : '/api/chat-sessions';
            await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
            if (currentSessionId === id) handleNewSession();
            loadSessions();
        }
    };

    const handleTogglePin = async (id: string, isPinned: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        const session = sessions.find(s => s.id === id);
        const endpoint = session?.type === 'project' ? '/api/project-sessions' : '/api/chat-sessions';
        await fetch(endpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, is_pinned: isPinned })
        });
        loadSessions();
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!(input || '').trim() && !files?.length) return;

        let activeSessionId = currentSessionId;

        // If no session exists, create one first
        if (!activeSessionId) {
            const title = (input || '').trim().substring(0, 30) || 'Cuộc trò chuyện mới';
            const res = await fetch('/api/chat-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            if (res.ok) {
                const session = await res.json();
                activeSessionId = session.id;
                setCurrentSessionId(activeSessionId);
                loadSessions();
            }
        }

        // Wait for React to update currentSessionId if we just created it? 
        // useChat's append uses the latest body state if we pass it, or we rely on the component state.
        // To be safe, we can trigger append after state updates, but append takes options:
        sendMessage({
            text: input,
            ...(files && files.length > 0 ? { experimental_attachments: files } : {})
        }, {
            body: { sessionId: activeSessionId }
        });

        setInput('');
        setFiles(null);
    };

    if (authenticated === null) return <div className="h-[800px] flex items-center justify-center"><i className="fa-solid fa-spinner animate-spin text-2xl text-blue-500"></i></div>;

    return (
        <div className="relative flex-1 w-full h-full bg-white dark:bg-slate-900 flex overflow-hidden pb-[60px] lg:pb-0">
            {!authenticated && <AuthModal onSuccess={() => { setAuthenticated(true); loadSessions(); }} />}
            
            <AILabSidebar 
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={setCurrentSessionId}
                onNewSession={handleNewSession}
                onDeleteSession={handleDeleteSession}
                onTogglePin={handleTogglePin}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Unified IDE Top Bar */}
                <div className="relative h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center px-4 flex-shrink-0 z-20">
                    {/* Left: Menu & Brand */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors md:hidden"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <div className="hidden sm:flex items-center gap-2">
                            <i className="fa-solid fa-microchip text-cyan-500"></i>
                            <span className="font-bold text-xs tracking-wider uppercase text-slate-800 dark:text-slate-200">AILab Workspace</span>
                        </div>
                    </div>

                    {/* Center: IDE Tabs */}
                    <div className="flex h-full items-center absolute left-1/2 -translate-x-1/2">
                        <button 
                            onClick={() => { setIsProjectStudioOpen(false); setCurrentProjectId(null); }}
                            className={`h-full px-4 sm:px-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors border-b-[2px] flex items-center gap-2 ${!isProjectStudioOpen ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/10' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        >
                            <i className="fa-solid fa-terminal"></i> AI Chat
                        </button>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                        <button 
                            onClick={() => setIsProjectStudioOpen(true)}
                            className={`h-full px-4 sm:px-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors border-b-[2px] flex items-center gap-2 ${isProjectStudioOpen ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/10' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        >
                            <i className="fa-solid fa-wand-magic-sparkles"></i> Project Studio <span className="bg-purple-600/10 text-purple-600 dark:text-purple-400 px-1 py-0.5 rounded-sm text-[9px] ml-1 font-black">PRO</span>
                        </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button 
                            onClick={async () => { await supabase.auth.signOut(); setAuthenticated(false); }}
                            className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2"
                            title="Đăng xuất"
                        >
                            <i className="fa-solid fa-power-off"></i>
                        </button>
                    </div>
                </div>

                {!isProjectStudioOpen ? (
                    <>
                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 md:gap-6 custom-scrollbar">
                            {(!messages || messages.length === 0) && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                    <i className="fa-solid fa-microchip text-3xl md:text-4xl text-slate-300 dark:text-slate-600 mb-2 md:mb-4"></i>
                                    <h3 className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-300">Bạn cần tư vấn gì hôm nay?</h3>
                                    <p className="text-xs text-slate-500 mt-1 mb-4 md:mb-6 px-4 hidden sm:block">Hãy hỏi tôi về cách thiết kế mạch, phân tích sơ đồ khối, hoặc tìm kiếm mã nguồn trên GitHub.</p>
                                    <p className="text-[11px] text-slate-500 mt-1 mb-4 px-2 sm:hidden">Hỏi về thiết kế mạch, mã nguồn hoặc kiến thức IoT.</p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 w-full max-w-sm mx-auto gap-2 px-2">
                                        {[
                                            "Tìm repo GitHub về IoT ESP32",
                                            "Phân tích sơ đồ khối dự án",
                                            "Tìm vỏ in 3D cho hộp ESP32",
                                            "Kết nối cảm biến siêu âm"
                                        ].map((sug, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setInput(sug);
                                                    sendMessage({ text: sug }, { body: { sessionId: currentSessionId }});
                                                }}
                                                className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl text-left text-[11px] md:text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3 transition-colors shadow-sm"
                                            >
                                                <i className="fa-solid fa-sparkles text-blue-500 shrink-0"></i>
                                                <span className="truncate">{sug}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {messages?.map((m: any) => (
                                <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                                        <i className={`fa-solid ${m.role === 'user' ? 'fa-user' : 'fa-robot'} text-sm`}></i>
                                    </div>
                                    <div className={`px-5 py-3 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700 prose prose-sm dark:prose-invert max-w-none break-words overflow-x-auto'}`}>
                                        {m.role === 'user' ? (
                                            <p className="whitespace-pre-wrap text-sm">{m.content || m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')}</p>
                                        ) : (
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code: CodeBlock,
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    table: ({node, ...props}) => <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-sm"><table className="w-full text-sm text-left border-collapse" {...props} /></div>,
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    th: ({node, ...props}) => <th className="bg-slate-50 dark:bg-slate-800/80 p-3 font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700/80" {...props} />,
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    td: ({node, ...props}) => <td className="p-3 border-b border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-300" {...props} />
                                                }}
                                            >
                                                {m.content || m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-robot text-sm"></i>
                                    </div>
                                    <div className="px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            )}
                            
                            {error && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                                    </div>
                                    <div className="px-5 py-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 rounded-tl-none">
                                        <p className="font-semibold text-sm mb-1">Đã có lỗi xảy ra:</p>
                                        <p className="text-xs font-mono break-words">{error.message || JSON.stringify(error)}</p>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-2 sm:p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                            <form ref={formRef} onSubmit={handleSendMessage} className="relative flex flex-col gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                
                                {files && files.length > 0 && (
                                    <div className="flex gap-2 px-2 pt-2">
                                        {Array.from(files).map((file, i) => (
                                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                {file.type.includes('pdf') ? (
                                                    <i className="fa-solid fa-file-pdf text-3xl text-red-500"></i>
                                                ) : (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-end gap-2 w-full">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*, application/pdf" 
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files?.length) {
                                                setFiles(e.target.files);
                                            }
                                        }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 transition-all mb-0.5"
                                        title="Đính kèm file (Ảnh, PDF)"
                                    >
                                        <i className="fa-solid fa-paperclip text-lg"></i>
                                    </button>

                                    <textarea 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Nhập câu hỏi hoặc dán link GitHub..."
                                        className="w-full bg-transparent border-none focus:outline-none resize-none max-h-32 min-h-[40px] px-2 py-2 md:py-2.5 text-xs sm:text-sm custom-scrollbar"
                                        rows={(input || '').split('\n').length > 1 ? Math.min((input || '').split('\n').length, 5) : 1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                <button 
                                    type="submit" 
                                    disabled={isLoading || (!(input || '').trim() && !files?.length)}
                                    className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all mb-0.5"
                                >
                                    <i className="fa-solid fa-paper-plane text-sm"></i>
                                </button>
                                </div>
                            </form>
                            <div className="text-center mt-1.5 text-[9px] text-slate-400 font-normal lowercase first-letter:capitalize">
                                AI có thể mắc sai lầm. Kiểm tra lại thông số linh kiện thực tế.
                            </div>
                        </div>
                    </>
                ) : (
                    <ProjectStudioWorkspace />
                )}
            </div>
        </div>
    );
}
