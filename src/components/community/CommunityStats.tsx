'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface StatsData {
    totalProjects: number;
    totalMembers: number;
    totalLikes: number;
    totalComments: number;
}

export default function CommunityStats() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchStats = async () => {
            // Parallel fetch stats
            const [projectsRes, membersRes, likesRes, commentsRes] = await Promise.all([
                supabase.from('public_projects').select('id', { count: 'exact', head: true }),
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('public_projects').select('likes_count'),
                supabase.from('project_comments').select('id', { count: 'exact', head: true }),
            ]);

            const totalLikes = (likesRes.data || []).reduce((sum, p) => sum + (p.likes_count || 0), 0);

            setStats({
                totalProjects: projectsRes.count || 0,
                totalMembers: membersRes.count || 0,
                totalLikes,
                totalComments: commentsRes.count || 0,
            });
            setLoading(false);
        };
        fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const statItems = [
        { icon: 'fa-diagram-project', label: 'Dự án', value: stats?.totalProjects ?? 0, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { icon: 'fa-users', label: 'Thành viên', value: stats?.totalMembers ?? 0, color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { icon: 'fa-heart', label: 'Lượt thích', value: stats?.totalLikes ?? 0, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { icon: 'fa-comments', label: 'Bình luận', value: stats?.totalComments ?? 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-4 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-blue-400"></i>
                Thống kê cộng đồng
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {statItems.map(item => (
                    <div key={item.label} className={`${item.bg} rounded-xl p-3 flex flex-col gap-1`}>
                        {loading ? (
                            <div className="h-5 w-12 rounded shimmer dark:shimmer mb-1"></div>
                        ) : (
                            <span className={`text-xl font-black font-mono ${item.color}`}>
                                {item.value.toLocaleString('vi-VN')}
                            </span>
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <i className={`fa-solid ${item.icon} text-[10px] ${item.color}`}></i>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
