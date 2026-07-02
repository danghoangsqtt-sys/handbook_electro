import React from 'react';

export interface ChatSession {
    id: string;
    title: string;
    is_pinned: boolean;
    updated_at: string;
    type?: 'chat' | 'project';
}

interface SidebarProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    onSelectSession: (id: string) => void;
    onNewSession: () => void;
    onDeleteSession: (id: string, e: React.MouseEvent) => void;
    onTogglePin: (id: string, isPinned: boolean, e: React.MouseEvent) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AILabSidebar({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewSession,
    onDeleteSession,
    onTogglePin,
    isOpen,
    setIsOpen
}: SidebarProps) {
    const pinnedSessions = sessions.filter(s => s.is_pinned);
    const recentSessions = sessions.filter(s => !s.is_pinned);

    const renderSession = (session: ChatSession) => {
        const isActive = currentSessionId === session.id;
        return (
            <div
                key={session.id}
                onClick={() => { onSelectSession(session.id); setIsOpen(false); }}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <i className={`fa-solid ${session.type === 'project' ? 'fa-microchip text-cyan-500 dark:text-cyan-400' : 'fa-message opacity-70'}`}></i>
                    <span className="text-sm font-medium truncate">{session.title}</span>
                </div>
                
                {/* Actions (visible on hover) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => onTogglePin(session.id, !session.is_pinned, e)}
                        className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${session.is_pinned ? 'text-amber-500' : 'text-slate-400'}`}
                        title={session.is_pinned ? "Bỏ ghim" : "Ghim"}
                    >
                        <i className="fa-solid fa-thumbtack text-xs"></i>
                    </button>
                    <button
                        onClick={(e) => onDeleteSession(session.id, e)}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400 transition-colors"
                        title="Xóa"
                    >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none rounded-l-3xl ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:w-80 h-full`}>
                
                {/* Header / New Chat */}
                <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/30 backdrop-blur-md">
                    <button 
                        onClick={onNewSession}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i>
                        Đoạn chat mới
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="md:hidden ml-2 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Session List */}
                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                    {sessions.length === 0 ? (
                        <div className="text-center mt-10 text-slate-400 text-sm">
                            <i className="fa-solid fa-inbox text-3xl mb-3 opacity-50"></i>
                            <p>Chưa có đoạn chat nào.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* Pinned Section */}
                            {pinnedSessions.length > 0 && (
                                <div className="flex flex-col gap-1">
                                    <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Đã ghim
                                    </div>
                                    {pinnedSessions.map(renderSession)}
                                </div>
                            )}

                            {/* Recent Section */}
                            {recentSessions.length > 0 && (
                                <div className="flex flex-col gap-1">
                                    <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Gần đây
                                    </div>
                                    {recentSessions.map(renderSession)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/30 text-xs text-slate-500 text-center">
                    Lịch sử được lưu trữ bảo mật qua mã PIN cá nhân.
                </div>
            </div>
        </>
    );
}
