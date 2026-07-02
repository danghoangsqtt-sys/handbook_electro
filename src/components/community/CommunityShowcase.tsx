'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useBOMStore } from '@/store/useBOMStore';
import ProjectDetailModal from './ProjectDetailModal';
import CommunityStats from './CommunityStats';
import TopContributors from './TopContributors';

interface CommunityProject {
    id: string;
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bom_data: any[];
    diagram_code: string | null;
    schematic_image_url: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pin_connections: any[] | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code_snippets: any;
    likes_count: number;
    comments_count?: number;
    created_at: string;
    profiles: { display_name: string; avatar_url: string | null } | null;
}

type SortOption = 'newest' | 'most_liked' | 'most_components';

const CATEGORY_TAGS = ['ESP32', 'Arduino', 'Raspberry Pi', 'IoT', 'Cảm biến', 'Motor', 'LED', 'Bluetooth', 'Wi-Fi'];

function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full shimmer"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 shimmer rounded w-32"></div>
                    <div className="h-2.5 shimmer rounded w-20"></div>
                </div>
            </div>
            <div className="h-5 shimmer rounded w-3/4 mb-2"></div>
            <div className="h-3 shimmer rounded w-full mb-1.5"></div>
            <div className="h-3 shimmer rounded w-5/6 mb-4"></div>
            <div className="flex gap-2 mb-4">
                {[1,2,3].map(i => <div key={i} className="h-6 w-16 shimmer rounded-full"></div>)}
            </div>
            <div className="h-px bg-slate-100 dark:bg-white/5 mb-3"></div>
            <div className="flex justify-between">
                <div className="flex gap-3">
                    {[1,2,3].map(i => <div key={i} className="h-7 w-14 shimmer rounded-lg"></div>)}
                </div>
                <div className="h-7 w-24 shimmer rounded-lg"></div>
            </div>
        </div>
    );
}

function getBOMChips(bomData: CommunityProject['bom_data']) {
    if (!bomData || !Array.isArray(bomData)) return [];
    const chips: string[] = [];
    bomData.forEach(item => {
        const name = (item.name || item.id || '').toLowerCase();
        if (name.includes('esp32') || name.includes('esp-32')) chips.push('ESP32');
        else if (name.includes('esp8266') || name.includes('nodemcu')) chips.push('ESP8266');
        else if (name.includes('arduino') || name.includes('uno') || name.includes('nano') || name.includes('mega')) chips.push('Arduino');
        else if (name.includes('raspberry') || name.includes('rpi')) chips.push('Raspberry Pi');
        else if (name.includes('sensor') || name.includes('cam biến') || name.includes('hc-sr') || name.includes('dht') || name.includes('bme')) chips.push('Cảm biến');
        else if (name.includes('motor') || name.includes('servo') || name.includes('l298') || name.includes('drv')) chips.push('Motor');
        else if (name.includes('led') || name.includes('ws281') || name.includes('neopixel')) chips.push('LED');
        else if (name.includes('bluetooth') || name.includes('hc-0') || name.includes('ble')) chips.push('Bluetooth');
        else if (name.includes('wifi') || name.includes('wi-fi') || name.includes('mqtt')) chips.push('Wi-Fi');
    });
    // deduplicate
    return [...new Set(chips)].slice(0, 3);
}

const chipColors: Record<string, string> = {
    'ESP32': 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    'ESP8266': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
    'Arduino': 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20',
    'Raspberry Pi': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    'Cảm biến': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    'Motor': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    'LED': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
    'Bluetooth': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    'Wi-Fi': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
};

export default function CommunityShowcase() {
    const [projects, setProjects] = useState<CommunityProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [activeTag, setActiveTag] = useState<string | null>(null);
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
                schematic_image_url, pin_connections,
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
        const newCount = isLiked ? currentLikes - 1 : currentLikes + 1;

        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes_count: newCount } : p));
        setSelectedProject(prev => prev?.id === projectId ? { ...prev, likes_count: newCount } : prev);
        setLikedProjects(prev => {
            const next = new Set(prev);
            if (isLiked) next.delete(projectId); else next.add(projectId);
            return next;
        });

        const { error } = await supabase.from('public_projects').update({ likes_count: newCount }).eq('id', projectId);
        if (error) {
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes_count: currentLikes } : p));
            setSelectedProject(prev => prev?.id === projectId ? { ...prev, likes_count: currentLikes } : prev);
        }
        setLikingId(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClone = (e: React.MouseEvent, project: any) => {
        e.stopPropagation();
        if (project.bom_data && Array.isArray(project.bom_data)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            project.bom_data.forEach((item: any) => addItem(item));
        }
        setIsProjectStudioOpen(true);
    };

    const filtered = projects
        .filter(p => {
            const q = searchQuery.trim().toLowerCase();
            const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
            const matchTag = !activeTag || getBOMChips(p.bom_data).includes(activeTag);
            return matchSearch && matchTag;
        })
        .sort((a, b) => {
            if (sortBy === 'most_liked') return b.likes_count - a.likes_count;
            if (sortBy === 'most_components') return (b.bom_data?.length || 0) - (a.bom_data?.length || 0);
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    const formatRelativeTime = (iso: string) => {
        const diff = (Date.now() - new Date(iso).getTime()) / 1000;
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
        return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' });
    };

    return (
        <>
        {/* ─── Page wrapper ─── */}
        <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0D1117] transition-colors">

            {/* ─── Hero Banner ─── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0D1117] via-[#0f2744] to-[#0D1117] border-b border-slate-200 dark:border-white/5 py-10 px-4">
                {/* Decorative blobs */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 animate-pulse-glow">
                        <i className="fa-solid fa-satellite-dish"></i>
                        Cộng đồng kỹ thuật điện tử — Live
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
                        Thư Viện <span className="bg-gradient-to-r from-[#2D9CDB] to-[#00D4FF] bg-clip-text text-transparent">Cộng Đồng</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                        Khám phá, tái sử dụng và bình luận trên các dự án điện tử thực tế được chia sẻ bởi cộng đồng kỹ sư và sinh viên.
                    </p>
                </div>
            </div>

            {/* ─── Main 3-column layout ─── */}
            <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ─── Left Sidebar ─── */}
                <aside className="lg:col-span-3 space-y-4">
                    <CommunityStats />
                    <TopContributors />

                    {/* Tag filter */}
                    <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-tags text-blue-400"></i>
                            Lọc theo công nghệ
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveTag(null)}
                                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${!activeTag ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                            >
                                Tất cả
                            </button>
                            {CATEGORY_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${activeTag === tag ? 'bg-blue-600 text-white' : chipColors[tag] || 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ─── Main Feed ─── */}
                <main className="lg:col-span-9">
                    {/* Search + Sort bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="relative flex-1">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm dự án, công nghệ, tác giả..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all placeholder:text-slate-400 font-sans"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortOption)}
                            className="px-4 py-2.5 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                        >
                            <option value="newest">🕐 Mới nhất</option>
                            <option value="most_liked">❤️ Nhiều like nhất</option>
                            <option value="most_components">⚙️ Nhiều linh kiện nhất</option>
                        </select>
                    </div>

                    {/* Result count */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        {loading ? 'Đang tải...' : (
                            <>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{filtered.length}</span>
                                {' '}dự án{searchQuery && <> • kết quả cho "<span className="text-blue-600 dark:text-blue-400">{searchQuery}</span>"</>}
                                {activeTag && <> • thẻ <span className="text-blue-600 dark:text-blue-400">{activeTag}</span></>}
                            </>
                        )}
                    </p>

                    {/* Feed */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-14 text-center">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                <i className="fa-solid fa-satellite text-slate-300 dark:text-slate-600"></i>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
                                {searchQuery || activeTag ? 'Không tìm thấy kết quả' : 'Chưa có dự án nào'}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                {searchQuery || activeTag ? 'Thử từ khoá khác hoặc bỏ bộ lọc.' : 'Hãy là người đầu tiên chia sẻ dự án!'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map(project => {
                                const chips = getBOMChips(project.bom_data);
                                const isLiked = likedProjects.has(project.id);
                                const initials = (project.profiles?.display_name || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

                                return (
                                    <article
                                        key={project.id}
                                        className="feed-item bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl overflow-hidden hover:border-blue-400/50 dark:hover:border-[#2D9CDB]/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer group"
                                        onClick={() => setSelectedProject(project)}
                                    >
                                        {/* Accent top bar */}
                                        <div className="h-0.5 bg-gradient-to-r from-[#2D9CDB] via-[#00D4FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="p-5">
                                            {/* Author row */}
                                            <div className="flex items-start gap-3 mb-3">
                                                {project.profiles?.avatar_url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={project.profiles.avatar_url}
                                                        alt="avatar"
                                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-white/10 flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D9CDB] to-[#00D4FF] flex items-center justify-center flex-shrink-0 text-white text-xs font-black">
                                                        {initials}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                                                            {project.profiles?.display_name || 'Anonymous'}
                                                        </span>
                                                        <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                                                        <span className="text-xs text-slate-400 dark:text-slate-500">{formatRelativeTime(project.created_at)}</span>
                                                    </div>
                                                    {/* Meta chips */}
                                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                        {chips.map(chip => (
                                                            <span key={chip} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${chipColors[chip] || 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                                                                {chip}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-[#2D9CDB] transition-colors line-clamp-2">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                                                {project.description || 'Không có mô tả.'}
                                            </p>

                                            {/* Stats mini-row */}
                                            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-4">
                                                <span className="flex items-center gap-1.5">
                                                    <i className="fa-solid fa-microchip text-blue-400"></i>
                                                    <span className="font-bold text-slate-600 dark:text-slate-300">{project.bom_data?.length || 0}</span> linh kiện
                                                </span>
                                                {project.diagram_code && (
                                                    <span className="flex items-center gap-1.5">
                                                        <i className="fa-solid fa-diagram-project text-emerald-400"></i>
                                                        Sơ đồ
                                                    </span>
                                                )}
                                                {(project.comments_count ?? 0) > 0 && (
                                                    <span className="flex items-center gap-1.5">
                                                        <i className="fa-solid fa-comments text-violet-400"></i>
                                                        {project.comments_count} bình luận
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action bar */}
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                                                <div className="flex items-center gap-1">
                                                    {/* Like */}
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleLike(project.id, project.likes_count); }}
                                                        disabled={likingId === project.id}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isLiked
                                                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400'
                                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                                        }`}
                                                    >
                                                        <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart ${isLiked ? 'text-rose-500' : ''}`}></i>
                                                        {project.likes_count}
                                                    </button>

                                                    {/* Comment */}
                                                    <button
                                                        onClick={e => { e.stopPropagation(); setSelectedProject(project); }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                                    >
                                                        <i className="fa-regular fa-comment"></i>
                                                        {(project.comments_count ?? 0) > 0 ? project.comments_count : 'Bình luận'}
                                                    </button>

                                                    {/* Clone */}
                                                    <button
                                                        onClick={e => handleClone(e, project)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                                    >
                                                        <i className="fa-solid fa-code-branch"></i>
                                                        Clone
                                                    </button>
                                                </div>

                                                {/* View detail */}
                                                <button
                                                    onClick={e => { e.stopPropagation(); setSelectedProject(project); }}
                                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#2D9CDB] to-[#00D4FF] hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-lg text-xs shadow-sm shadow-blue-500/20 transition-all"
                                                >
                                                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
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
