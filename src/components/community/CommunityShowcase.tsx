'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useBOMStore } from '@/store/useBOMStore';

export default function CommunityShowcase() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const { addComponent, toggleProjectStudio } = useBOMStore();

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('public_projects')
                .select(`
                    id, title, description, bom_data, diagram_code, likes_count, created_at,
                    profiles:user_id (display_name, avatar_url)
                `)
                .order('created_at', { ascending: false });
            
            if (data && !error) {
                setProjects(data);
            }
            setLoading(false);
        };
        fetchProjects();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClone = (project: any) => {
        // Add all BOM items from project
        if (project.bom_data && Array.isArray(project.bom_data)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            project.bom_data.forEach((item: any) => {
                addComponent(item);
            });
        }
        // Open Project Studio
        toggleProjectStudio();
        alert('Đã clone dự án vào Project Studio thành công!');
    };

    if (loading) {
        return <div className="min-h-[400px] flex justify-center items-center"><i className="fa-solid fa-spinner animate-spin text-3xl text-blue-500"></i></div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Thư Viện Cộng Đồng</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Khám phá và tái sử dụng các sơ đồ mạch điện, danh sách linh kiện (BOM) được chia sẻ bởi cộng đồng kỹ sư và sinh viên Điện tử.
                </p>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-slate-400">
                        <i className="fa-solid fa-ghost"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Chưa có dự án nào</h3>
                    <p className="text-slate-500 mt-2">Hãy là người đầu tiên Publish dự án của bạn từ AI Project Studio!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all group flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={project.profiles?.avatar_url || 'https://via.placeholder.com/40'} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{project.profiles?.display_name || 'Anonymous'}</div>
                                    <div className="text-xs text-slate-500">{new Date(project.created_at).toLocaleDateString('vi-VN')}</div>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-2">{project.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-grow">{project.description}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <i className="fa-solid fa-microchip"></i>
                                    <span>{project.bom_data ? project.bom_data.length : 0} linh kiện</span>
                                </div>
                                <button 
                                    onClick={() => handleClone(project)}
                                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                >
                                    <i className="fa-solid fa-code-branch mr-1"></i> Clone
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
