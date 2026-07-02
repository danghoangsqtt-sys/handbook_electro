'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Contributor {
    id: string;
    display_name: string;
    avatar_url: string | null;
    project_count: number;
    total_likes: number;
}

export default function TopContributors() {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchContributors = async () => {
            // Fetch projects with profiles, then aggregate
            const { data } = await supabase
                .from('public_projects')
                .select(`
                    user_id, likes_count,
                    profiles:user_id (id, display_name, avatar_url)
                `)
                .order('likes_count', { ascending: false });

            if (!data) { setLoading(false); return; }

            // Aggregate by user
            const map = new Map<string, Contributor>();
            data.forEach((row) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const profile = (row as any).profiles;
                if (!profile?.id) return;
                const uid = profile.id as string;
                if (map.has(uid)) {
                    const prev = map.get(uid)!;
                    map.set(uid, { ...prev, project_count: prev.project_count + 1, total_likes: prev.total_likes + (row.likes_count || 0) });
                } else {
                    map.set(uid, {
                        id: uid,
                        display_name: profile.display_name || 'Anonymous',
                        avatar_url: profile.avatar_url || null,
                        project_count: 1,
                        total_likes: row.likes_count || 0,
                    });
                }
            });

            const sorted = Array.from(map.values())
                .sort((a, b) => b.total_likes - a.total_likes)
                .slice(0, 5);

            setContributors(sorted);
            setLoading(false);
        };
        fetchContributors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

    return (
        <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-trophy text-amber-400"></i>
                Top đóng góp
            </h3>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-2 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex-1 space-y-1">
                                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-16"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : contributors.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Chưa có dữ liệu</p>
            ) : (
                <div className="space-y-2.5">
                    {contributors.map((c, idx) => (
                        <div key={c.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <span className="text-base w-6 text-center flex-shrink-0">{medals[idx]}</span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.display_name)}&background=2D9CDB&color=fff&size=64`}
                                alt={c.display_name}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-white/10 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{c.display_name}</p>
                                <p className="text-xs text-slate-400">
                                    {c.project_count} dự án • <i className="fa-solid fa-heart text-rose-400 text-[10px]"></i> {c.total_likes}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
