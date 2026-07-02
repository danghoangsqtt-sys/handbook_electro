'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import AuthModal from '../auth/AuthModal';

export default function UserProfile() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchProfile = async (isInitial = false) => {
        if (!isInitial) setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            setProfile(data);
        } else {
            setUser(null);
            setProfile(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProfile(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return <div className="min-h-[400px] flex justify-center items-center"><i className="fa-solid fa-spinner animate-spin text-3xl text-blue-500"></i></div>;
    }

    if (!user) {
        return (
            <div className="relative min-h-[500px]">
                <AuthModal onSuccess={fetchProfile} />
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden relative group shrink-0">
                        {profile?.avatar_url || user.user_metadata?.avatar_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={profile?.avatar_url || user.user_metadata?.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400">
                                <i className="fa-solid fa-user"></i>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <i className="fa-solid fa-camera text-white text-xl"></i>
                        </div>
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">
                            {profile?.display_name || user.user_metadata?.full_name || 'Người dùng ẩn danh'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">{user.email}</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-4 flex-1 min-w-[120px]">
                                <div className="text-blue-500 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Chuỗi ngày học</div>
                                <div className="text-2xl font-black text-blue-700 dark:text-blue-300 flex items-center justify-center md:justify-start gap-2">
                                    <i className="fa-solid fa-fire text-orange-500"></i> {profile?.streak_days || 0}
                                </div>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 flex-1 min-w-[120px]">
                                <div className="text-emerald-500 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Từ vựng đã xem</div>
                                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-center md:justify-start gap-2">
                                    <i className="fa-solid fa-layer-group text-emerald-500"></i> {profile?.total_flashcards_viewed || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Thành tựu (Achievements)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center opacity-50 grayscale">
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-3 text-xl">
                                <i className="fa-solid fa-medal"></i>
                            </div>
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Newbie Điện Tử</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center opacity-50 grayscale">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mx-auto mb-3 text-xl">
                                <i className="fa-solid fa-microchip"></i>
                            </div>
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Chuyên Gia Linh Kiện</div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-end gap-4">
                    <button 
                        onClick={async () => { await supabase.auth.signOut(); fetchProfile(); }}
                        className="px-6 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-colors"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
}
