'use client';

import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef, useState } from 'react';
import PinLogin from '../auth/PinLogin';

export default function AILab() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    const [files, setFiles] = useState<FileList | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState('');

    const { messages, sendMessage, status, error } = useChat({
        generateId: () => Math.random().toString(36).substring(2, 15)
    });
    const isLoading = status === 'submitted' || status === 'streaming';
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        // Check auth status
        fetch(`/api/auth`).then(res => {
            if (res.ok) setAuthenticated(true);
            else setAuthenticated(false);
        });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (authenticated === null) return <div className="h-[800px] flex items-center justify-center"><i className="fa-solid fa-spinner animate-spin text-2xl text-blue-500"></i></div>;

    return (
        <div className="relative h-[800px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
            {!authenticated && <PinLogin onSuccess={() => setAuthenticated(true)} />}
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                        <i className="fa-solid fa-robot"></i>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 dark:text-slate-100">Cố vấn Cơ Điện Tử & IT</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini 2.5 Flash</p>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        fetch(`/api/auth`, { method: 'DELETE' }).then(() => setAuthenticated(false));
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold text-slate-600 dark:text-slate-300"
                >
                    Đăng xuất
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                {(!messages || messages.length === 0) && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                        <i className="fa-solid fa-microchip text-4xl text-slate-300 dark:text-slate-600 mb-4"></i>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Bạn cần tư vấn gì hôm nay?</h3>
                        <p className="text-sm text-slate-500 mt-2 mb-6">Hãy hỏi tôi về cách thiết kế mạch, phân tích sơ đồ khối, hoặc tìm kiếm mã nguồn trên GitHub.</p>
                        
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                "Tìm các repo GitHub về IoT ESP32",
                                "Phân tích sơ đồ khối dự án",
                                "Tìm file in 3D cho vỏ hộp ESP32",
                                "Cách kết nối cảm biến siêu âm HC-SR04"
                            ].map((sug, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        sendMessage({ text: sug });
                                    }}
                                    className="px-3 py-2 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all text-left"
                                >
                                    <i className="fa-solid fa-sparkles mr-2 text-blue-500"></i>
                                    {sug}
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
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <form ref={formRef} onSubmit={(e) => {
                    e.preventDefault();
                    if (!(input || '').trim() && !files?.length) return;
                    sendMessage({ text: input, ...(files && files.length > 0 ? { files } : {}) });
                    setInput('');
                    setFiles(null);
                }} className="relative flex flex-col gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    
                    {files && files.length > 0 && (
                        <div className="flex gap-2 px-2 pt-2">
                            {Array.from(files).map((file, i) => (
                                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-end gap-2 w-full">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
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
                            title="Đính kèm hình ảnh"
                        >
                            <i className="fa-solid fa-image text-lg"></i>
                        </button>

                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi hoặc dán link GitHub..."
                            className="w-full bg-transparent border-none focus:outline-none resize-none max-h-32 min-h-[44px] px-2 py-2 text-sm custom-scrollbar"
                            rows={(input || '').split('\n').length > 1 ? Math.min((input || '').split('\n').length, 5) : 1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (!(input || '').trim() && !files?.length) return;
                                    sendMessage({ text: input, ...(files && files.length > 0 ? { files } : {}) });
                                    setInput('');
                                    setFiles(null);
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
                <div className="text-center mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    AI có thể mắc sai lầm. Hãy kiểm tra lại các thông số linh kiện thực tế.
                </div>
            </div>
        </div>
    );
}
