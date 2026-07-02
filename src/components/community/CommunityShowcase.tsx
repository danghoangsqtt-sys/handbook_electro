'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useBOMStore } from '@/store/useBOMStore';
import ProjectDetailModal from './ProjectDetailModal';

interface CommunityProject {
    id: string;
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bom_data: any[];
    diagram_code: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code_snippets: any;
    likes_count: number;
    comments_count?: number;
    created_at: string;
    profiles: { display_name: string; avatar_url: string | null } | null;
}

type SortOption = 'newest' | 'most_liked' | 'most_components';

export default function CommunityShowcase() {
    const [projects, setProjects] = useState<CommunityProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
    const [likingId, setLikingId] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<CommunityProject | null>(null);
    const supabase = createClient();
    const { addItem, setIsProjectStudioOpen } = useBOMStore();

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('public_projects')
            .select(`
                id, title, description, bom_data, diagram_code, code_snippets,
                likes_count, comments_count, created_at,
                profiles:user_id (display_name, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (data && !error) {
            setProjects(data as unknown as CommunityProject[]);
        }
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleLike = async (projectId: string, currentLikes: number) => {
        if (likingId) return;
        setLikingId(projectId);
        const isLiked = likedProjects.has(projectId);

        // Optimistic update
        setProjects(prev => prev.map(p =>
            p.id === projectId
                ? { ...p, likes_count: isLiked ? currentLikes - 1 : currentLikes + 1 }
                : p
        ));
        // Cập nhật selectedProject nếu đang mở
        setSelectedProject(prev => prev?.id === projectId
            ? { ...prev, likes_count: isLiked ? currentLikes - 1 : currentLikes + 1 }
            : prev
        );

        setLikedProjects(prev => {
            const next = new Set(prev);
            if (isLiked) { next.delete(projectId); } else { next.add(projectId); }
            return next;
        });

        const { error } = await supabase
            .from('public_projects')
            .update({ likes_count: isLiked ? currentLikes - 1 : currentLikes + 1 })
            .eq('id', projectId);

        if (error) {
            setProjects(prev => prev.map(p =>
                p.id === projectId ? { ...p, likes_count: currentLikes } : p
            ));
            setSelectedProject(prev => prev?.id === projectId
                ? { ...prev, likes_count: currentLikes }
                : prev
            );
        }
        setLikingId(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClone = (project: any) => {
        if (project.bom_data && Array.isArray(project.bom_data)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            project.bom_data.forEach((item: any) => {
                addItem(item);
            });
        }
        setIsProjectStudioOpen(true);
        alert('Đã clone dự án vào AI Project Studio thành công!');
    };

    // Filter & Sort
    const filtered = projects
        .filter(p =>
            !searchQuery.trim() ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'most_liked') return b.likes_count - a.likes_count;
            if (sortBy === 'most_components') return (b.bom_data?.length || 0) - (a.bom_data?.length || 0);
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    return (
        <>
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    <i className="fa-solid fa-globe"></i>
                    Cộng đồng kỹ thuật điện tử
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
                    Thư Viện Cộng Đồng
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Khám phá và tái sử dụng các sơ đồ mạch điện, danh sách linh kiện được chia sẻ bởi cộng đồng kỹ sư và sinh viên Điện tử.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm dự án..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="most_liked">Nhiều like nhất</option>
                    <option value="most_components">Nhiều linh kiện nhất</option>
                </select>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
                <span><span className="font-bold text-slate-700 dark:text-slate-200">{projects.length}</span> dự án</span>
                {searchQuery && <span>• <span className="font-bold text-blue-600">{filtered.length}</span> kết quả</span>}
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                <div className="flex-1">
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-1.5"></div>
                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full mb-1"></div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-slate-400">
                        <i className="fa-solid fa-ghost"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {searchQuery ? 'Không tìm thấy dự án phù hợp' : 'Chưa có dự án nào'}
                    </h3>
                    <p className="text-slate-500 mt-2">
                        {searchQuery ? 'Thử tìm kiếm với từ khoá khác.' : 'Hãy là người đầu tiên Publish dự án từ AI Project Studio!'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(project => (
                        <div
                            key={project.id}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group flex flex-col overflow-hidden cursor-pointer"
                            onClick={() => setSelectedProject(project)}
                        >
                            {/* Card Header Gradient */}
                            <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"></div>

                            <div className="p-5 flex flex-col flex-1">
                                {/* Author Row */}
                                <div className="flex items-center gap-3 mb-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={project.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.profiles?.display_name || 'A')}&background=3b82f6&color=fff`}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                                            {project.profiles?.display_name || 'Anonymous'}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(project.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </div>
                                    </div>
                                    {/* Like Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleLike(project.id, project.likes_count); }}
                                        disabled={likingId === project.id}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${likedProjects.has(project.id)
                                            ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500'
                                        }`}
                                    >
                                        <i className={`fa-${likedProjects.has(project.id) ? 'solid' : 'regular'} fa-heart`}></i>
                                        {project.likes_count}
                                    </button>
                                </div>

                                {/* Project Info */}
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-grow leading-relaxed">
                                    {project.description || 'Không có mô tả.'}
                                </p>

                                {/* Stats + Actions */}
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <i className="fa-solid fa-microchip text-blue-400"></i>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{project.bom_data ? project.bom_data.length : 0}</span> LK
                                        </span>
                                        {project.diagram_code && (
                                            <span className="flex items-center gap-1">
                                                <i className="fa-solid fa-diagram-project text-emerald-400"></i>
                                                <span className="hidden sm:inline">Sơ đồ</span>
                                            </span>
                                        )}
                                        {(project.comments_count ?? 0) > 0 && (
                                            <span className="flex items-center gap-1">
                                                <i className="fa-solid fa-comments text-violet-400"></i>
                                                {project.comments_count}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleClone(project); }}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg text-xs transition-all"
                                        >
                                            <i className="fa-solid fa-code-branch"></i>
                                            Clone
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-lg text-xs transition-all shadow-sm shadow-blue-500/20"
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Project Detail Modal */}
        <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            likedProjects={likedProjects}
            onLike={handleLike}
            likingId={likingId}
        />
        </>
    );
}
