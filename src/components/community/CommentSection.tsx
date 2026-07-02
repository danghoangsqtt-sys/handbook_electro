'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    profiles: { display_name: string; avatar_url: string | null } | null;
}

interface CommentSectionProps {
    projectId: string;
}

export default function CommentSection({ projectId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState('');
    const [currentUser, setCurrentUser] = useState<{ id: string; display_name: string; avatar_url: string | null } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    // Kiểm tra user đang đăng nhập
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name, avatar_url')
                    .eq('id', user.id)
                    .single();
                setCurrentUser({
                    id: user.id,
                    display_name: profile?.display_name || user.email?.split('@')[0] || 'Bạn',
                    avatar_url: profile?.avatar_url || null
                });
            }
        };
        checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('project_comments')
            .select(`
                id, content, created_at,
                profiles:user_id (display_name, avatar_url)
            `)
            .eq('project_id', projectId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (data) setComments(data as unknown as Comment[]);
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !currentUser) return;

        setSubmitting(true);
        setError(null);

        // Optimistic update
        const optimistic: Comment = {
            id: `temp-${Date.now()}`,
            content: content.trim(),
            created_at: new Date().toISOString(),
            profiles: { display_name: currentUser.display_name, avatar_url: currentUser.avatar_url }
        };
        setComments(prev => [optimistic, ...prev]);
        setContent('');

        const { error: insertError } = await supabase
            .from('project_comments')
            .insert({ project_id: projectId, user_id: currentUser.id, content: content.trim() });

        if (insertError) {
            // Rollback
            setComments(prev => prev.filter(c => c.id !== optimistic.id));
            setContent(optimistic.content);
            setError('Không thể gửi bình luận. Vui lòng thử lại.');
        } else {
            // Refresh để lấy id thật
            fetchComments();
        }
        setSubmitting(false);
    };

    const handleDelete = async (commentId: string) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
        await supabase.from('project_comments').delete().eq('id', commentId);
    };

    const formatTime = (iso: string) => {
        const date = new Date(iso);
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000;
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="mt-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-comments text-blue-500"></i>
                Bình luận
                <span className="text-xs font-normal text-slate-400">({comments.length})</span>
            </h3>

            {/* Form comment */}
            {currentUser ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex gap-3">
                        <img
                            src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.display_name)}&background=3b82f6&color=fff`}
                            alt="avatar"
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-blue-100 dark:ring-blue-900 mt-0.5"
                        />
                        <div className="flex-1">
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Viết bình luận của bạn..."
                                rows={2}
                                maxLength={1000}
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                            />
                            <div className="flex items-center justify-between mt-2">
                                {error && <p className="text-xs text-red-500">{error}</p>}
                                <div className="flex items-center gap-2 ml-auto">
                                    <span className="text-xs text-slate-400">{content.length}/1000</span>
                                    <button
                                        type="submit"
                                        disabled={!content.trim() || submitting}
                                        className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all"
                                    >
                                        {submitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                                        Gửi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        <i className="fa-solid fa-lock mr-1.5 text-slate-400"></i>
                        Đăng nhập để viết bình luận
                    </p>
                </div>
            )}

            {/* Comments list */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                    <i className="fa-regular fa-comment text-3xl mb-2 block"></i>
                    <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 group">
                            <img
                                src={comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.profiles?.display_name || 'A')}&background=6366f1&color=fff`}
                                alt="avatar"
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100 dark:ring-slate-800"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                        {comment.profiles?.display_name || 'Ẩn danh'}
                                    </span>
                                    <span className="text-xs text-slate-400">{formatTime(comment.created_at)}</span>
                                    {currentUser && comment.profiles?.display_name === currentUser.display_name && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="ml-auto opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-500 transition-all"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
