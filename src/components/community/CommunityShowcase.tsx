'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import ProjectDetailModal from './ProjectDetailModal';
import ProjectFormModal from './ProjectFormModal';

export interface MyProject {
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
    created_at: string;
    updated_at?: string;
}

type SortOption = 'newest' | 'oldest' | 'name_az';

function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl shimmer"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 shimmer rounded w-3/4"></div>
                    <div className="h-2.5 shimmer rounded w-1/2"></div>
                </div>
            </div>
            <div className="h-3 shimmer rounded w-full mb-1.5"></div>
            <div className="h-3 shimmer rounded w-5/6 mb-4"></div>
            <div className="flex gap-2">
                {[1,2,3].map(i => <div key={i} className="h-6 w-16 shimmer rounded-full"></div>)}
            </div>
        </div>
    );
}

function EmptyState({ onAdd, isLoggedIn }: { onAdd: () => void; isLoggedIn: boolean }) {
    const supabase = createClient();
    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-20 h-20 rounded-3xl bg-[#2D9CDB]/10 border border-[#2D9CDB]/20 flex items-center justify-center mb-6">
                    <i className="fa-solid fa-folder-open text-[#2D9CDB] text-3xl"></i>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Thu Vien Du An Ca Nhan</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                    Dang nhap de luu tru va quan ly tat ca du an dien tu cua ban.
                </p>
                <button
                    onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2D9CDB] to-[#00D4FF] text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all"
                >
                    <i className="fa-brands fa-google"></i> Dang nhap voi Google
                </button>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#2D9CDB]/10 border border-[#2D9CDB]/20 flex items-center justify-center mb-6">
                <i className="fa-solid fa-folder-plus text-[#2D9CDB] text-3xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Chua co du an nao</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                Bat dau luu tru du an dau tien cua ban. Hay su dung Phong Thi Nghiem AI de tao du an hoac them thu cong.
            </p>
            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2D9CDB] to-[#00D4FF] text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all"
            >
                <i className="fa-solid fa-plus"></i> Them Du An Moi
            </button>
        </div>
    );
}

export default function ProjectLibrary() {
    const [projects, setProjects] = useState<MyProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState<SortOption>('newest');
    const [selectedProject, setSelectedProject] = useState<MyProject | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingProject, setEditingProject] = useState<MyProject | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) { setIsLoggedIn(false); setLoading(false); return; }
        setIsLoggedIn(true);

        const { data, error } = await supabase
            .from('public_projects')
            .select(`id, title, description, bom_data, diagram_code, code_snippets,
                schematic_image_url, pin_connections, created_at, updated_at`)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) setProjects(data as MyProject[]);
        setLoading(false);
    }, []);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const supabase = createClient();
        const { error } = await supabase.from('public_projects').delete().eq('id', id);
        if (error) { alert('Delete error: ' + error.message); }
        else { setProjects(p => p.filter(pr => pr.id !== id)); }
        setDeletingId(null);
        setConfirmDeleteId(null);
    };

    const handleEdit = (project: MyProject) => {
        setEditingProject(project);
        setShowFormModal(true);
    };

    const handleFormSaved = () => {
        setShowFormModal(false);
        setEditingProject(null);
        fetchProjects();
    };

    // Filter + Sort
    const filtered = projects
        .filter(p =>
            !searchQuery ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            return a.title.localeCompare(b.title);
        });

    const getComponentTags = (project: MyProject) => {
        if (!project.bom_data?.length) return [];
        return project.bom_data.slice(0, 3).map((item: { name: string }) => item.name?.split(' ')[0] || '');
    };

    const formatDate = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0D1117] pb-20">
            {/* Page Header */}
            <div className="bg-white dark:bg-[#0D1117] border-b border-slate-200 dark:border-[#30363D] sticky top-16 z-30">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Title */}
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-[#2D9CDB]/10 border border-[#2D9CDB]/20 flex items-center justify-center">
                                <i className="fa-solid fa-folder-open text-[#2D9CDB]"></i>
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Thu Vien Du An</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {loading ? '...' : `${projects.length} du an da luu`}
                                </p>
                            </div>
                        </div>

                        {/* Search + Controls */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Tim kiem du an..."
                                    className="pl-8 pr-4 py-2 bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D9CDB] dark:text-slate-200 w-44"
                                />
                            </div>
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value as SortOption)}
                                className="px-3 py-2 bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-xs focus:outline-none dark:text-slate-200"
                            >
                                <option value="newest">Moi nhat</option>
                                <option value="oldest">Cu nhat</option>
                                <option value="name_az">Ten A-Z</option>
                            </select>

                            {isLoggedIn && (
                                <button
                                    onClick={() => { setEditingProject(null); setShowFormModal(true); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2D9CDB] to-[#00D4FF] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 hover:opacity-90 transition-all whitespace-nowrap"
                                >
                                    <i className="fa-solid fa-plus"></i>
                                    <span className="hidden sm:inline">Them Du An</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : !isLoggedIn || projects.length === 0 && !searchQuery ? (
                    <EmptyState onAdd={() => { setEditingProject(null); setShowFormModal(true); }} isLoggedIn={isLoggedIn} />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="fa-solid fa-magnifying-glass text-slate-300 dark:text-slate-700 text-4xl mb-4"></i>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Khong tim thay du an nao voi tu khoa <span className="font-bold">&quot;{searchQuery}&quot;</span></p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onView={() => setSelectedProject(project)}
                                onEdit={() => handleEdit(project)}
                                onDelete={() => setConfirmDeleteId(project.id)}
                                deleting={deletingId === project.id}
                                tags={getComponentTags(project)}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <ProjectDetailModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}

            {/* Add / Edit Form Modal */}
            {showFormModal && (
                <ProjectFormModal
                    mode={editingProject ? 'edit' : 'add'}
                    initialData={editingProject ? {
                        id: editingProject.id,
                        title: editingProject.title,
                        description: editingProject.description,
                        schematic_image_url: editingProject.schematic_image_url,
                        pin_connections: editingProject.pin_connections,
                        diagram_code: editingProject.diagram_code,
                        code_snippets: editingProject.code_snippets,
                        bom_data: editingProject.bom_data,
                    } : undefined}
                    onClose={() => { setShowFormModal(false); setEditingProject(null); }}
                    onSaved={handleFormSaved}
                />
            )}

            {/* Confirm Delete Dialog */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] p-6 max-w-sm w-full shadow-2xl">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-trash text-red-400 text-lg"></i>
                        </div>
                        <h3 className="text-base font-black text-slate-800 dark:text-slate-100 text-center mb-2">Xoa Du An?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5">Hanh dong nay khong the hoan tac. Du an se bi xoa vinh vien.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-[#30363D] text-sm text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                Huy
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDeleteId)}
                                disabled={deletingId === confirmDeleteId}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                {deletingId === confirmDeleteId ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-trash"></i>}
                                Xoa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Project Card ─── */
function ProjectCard({
    project, onView, onEdit, onDelete, deleting, tags, formatDate,
}: {
    project: MyProject;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
    deleting: boolean;
    tags: string[];
    formatDate: (iso: string) => string;
}) {
    const hasDiagram = !!(project.diagram_code || project.schematic_image_url);
    const hasPins = !!(project.pin_connections?.length);
    const hasCode = !!(project.code_snippets);
    const bomCount = project.bom_data?.length || 0;

    return (
        <div className="group bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-5 hover:border-[#2D9CDB]/50 hover:shadow-lg hover:shadow-[#2D9CDB]/5 transition-all flex flex-col">
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D9CDB]/20 to-[#00D4FF]/10 border border-[#2D9CDB]/20 flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-folder text-[#2D9CDB]"></i>
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug truncate">{project.title}</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatDate(project.created_at)}</p>
                    </div>
                </div>
                {/* Action buttons (visible on hover) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                        onClick={e => { e.stopPropagation(); onEdit(); }}
                        className="w-7 h-7 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 flex items-center justify-center transition-colors"
                        title="Chinh sua"
                    >
                        <i className="fa-solid fa-pen text-amber-400 text-[10px]"></i>
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onDelete(); }}
                        disabled={deleting}
                        className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-colors disabled:opacity-50"
                        title="Xoa"
                    >
                        {deleting
                            ? <i className="fa-solid fa-spinner fa-spin text-red-400 text-[10px]"></i>
                            : <i className="fa-solid fa-trash text-red-400 text-[10px]"></i>
                        }
                    </button>
                </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3 flex-1">
                {project.description || 'Chua co mo ta.'}
            </p>

            {/* Component tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#2D9CDB]/10 border border-[#2D9CDB]/20 rounded-full text-[10px] font-bold text-[#2D9CDB] font-mono">
                            {tag}
                        </span>
                    ))}
                    {bomCount > 3 && (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] text-slate-400">
                            +{bomCount - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Feature badges */}
            <div className="flex items-center gap-2 mb-4">
                {hasDiagram && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <i className="fa-solid fa-image"></i> So Do
                    </span>
                )}
                {hasPins && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <i className="fa-solid fa-plug"></i> {project.pin_connections!.length} Pin
                    </span>
                )}
                {hasCode && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                        <i className="fa-solid fa-code"></i> Code
                    </span>
                )}
                {bomCount > 0 && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        <i className="fa-solid fa-microchip"></i> {bomCount}
                    </span>
                )}
            </div>

            {/* View Button */}
            <button
                onClick={onView}
                className="w-full py-2 rounded-xl border border-slate-200 dark:border-[#30363D] text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-[#2D9CDB] hover:text-[#2D9CDB] hover:bg-[#2D9CDB]/5 transition-all flex items-center justify-center gap-1.5"
            >
                <i className="fa-solid fa-eye text-[10px]"></i> Xem Chi Tiet
            </button>
        </div>
    );
}
