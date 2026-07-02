'use client';

import { useState, useEffect, useRef } from 'react';
import { useBOMStore, BOMItem } from '@/store/useBOMStore';
import CommentSection from './CommentSection';

// BOMItem is imported from @/store/useBOMStore


interface CodeSnippet {
    language: string;
    label?: string;
    code: string;
}

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

interface ProjectDetailModalProps {
    project: CommunityProject | null;
    onClose: () => void;
    likedProjects: Set<string>;
    onLike: (projectId: string, currentLikes: number) => void;
    likingId: string | null;
}

type TabId = 'overview' | 'bom' | 'diagram' | 'code';

export default function ProjectDetailModal({
    project,
    onClose,
    likedProjects,
    onLike,
    likingId
}: ProjectDetailModalProps) {
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [mermaidLoaded, setMermaidLoaded] = useState(false);
    const [mermaidError, setMermaidError] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
    const diagramRef = useRef<HTMLDivElement>(null);
    const { addItem, setIsProjectStudioOpen } = useBOMStore();

    // Parse code_snippets
    const codeSnippets: CodeSnippet[] = (() => {
        if (!project?.code_snippets) return [];
        if (typeof project.code_snippets === 'string') {
            try { return JSON.parse(project.code_snippets); } catch { return []; }
        }
        if (Array.isArray(project.code_snippets)) return project.code_snippets;
        return [];
    })();

    // Parse BOM
    const bomItems: BOMItem[] = (() => {
        if (!project?.bom_data) return [];
        if (typeof project.bom_data === 'string') {
            try { return JSON.parse(project.bom_data); } catch { return []; }
        }
        if (Array.isArray(project.bom_data)) return project.bom_data;
        return [];
    })();

    // Render Mermaid diagram
    useEffect(() => {
        if (activeTab !== 'diagram' || !project?.diagram_code || !diagramRef.current) return;

        setMermaidLoaded(false);
        setMermaidError(false);

        const renderDiagram = async () => {
            try {
                const mermaid = (await import('mermaid')).default;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
                    securityLevel: 'loose',
                    flowchart: { useMaxWidth: true, htmlLabels: true },
                });
                const id = `mermaid-${project.id}`;
                const { svg } = await mermaid.render(id, project.diagram_code!);
                if (diagramRef.current) {
                    diagramRef.current.innerHTML = svg;
                    setMermaidLoaded(true);
                }
            } catch {
                setMermaidError(true);
            }
        };

        renderDiagram();
    }, [activeTab, project]);

    const handleCloneAll = () => {
        bomItems.forEach(item => addItem({ ...item, image_url: item.image_url ?? null }));
        setIsProjectStudioOpen(true);
        onClose();
    };

    const handleAddSingle = (item: BOMItem) => {
        addItem({ ...item, image_url: item.image_url ?? null });
    };

    const handleCopyCode = (code: string, idx: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    // Close on backdrop click
    const handleBackdrop = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    if (!project) return null;

    const tabs: { id: TabId; label: string; icon: string; count?: number }[] = [
        { id: 'overview', label: 'Mô tả', icon: 'fa-file-lines' },
        { id: 'bom', label: 'Linh kiện', icon: 'fa-microchip', count: bomItems.length },
        { id: 'diagram', label: 'Sơ đồ', icon: 'fa-diagram-project' },
        { id: 'code', label: 'Mã nguồn', icon: 'fa-code', count: codeSnippets.length || undefined },
    ];

    const isLiked = likedProjects.has(project.id);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
            onClick={handleBackdrop}
        >
            <div className="relative w-full sm:max-w-3xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slide-up">

                {/* Header */}
                <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-5 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    {/* Author */}
                    <div className="flex items-center gap-3 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={project.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.profiles?.display_name || 'A')}&background=ffffff&color=3b82f6`}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
                        />
                        <div>
                            <p className="font-semibold text-sm">{project.profiles?.display_name || 'Anonymous'}</p>
                            <p className="text-xs text-blue-100">
                                {new Date(project.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        {/* Like & Stats */}
                        <div className="ml-auto flex items-center gap-2">
                            <button
                                onClick={() => onLike(project.id, project.likes_count)}
                                disabled={likingId === project.id}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    isLiked
                                        ? 'bg-white text-red-500'
                                        : 'bg-white/20 hover:bg-white/30 text-white'
                                }`}
                            >
                                <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                                {project.likes_count}
                            </button>
                        </div>
                    </div>

                    <h2 className="text-lg font-black leading-snug pr-8">{project.title}</h2>

                    {/* Quick stats */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-blue-100">
                        <span><i className="fa-solid fa-microchip mr-1"></i>{bomItems.length} linh kiện</span>
                        {project.diagram_code && <span><i className="fa-solid fa-diagram-project mr-1"></i>Có sơ đồ</span>}
                        {codeSnippets.length > 0 && <span><i className="fa-solid fa-code mr-1"></i>{codeSnippets.length} đoạn code</span>}
                        {(project.comments_count ?? 0) > 0 && <span><i className="fa-solid fa-comments mr-1"></i>{project.comments_count} bình luận</span>}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 overflow-x-auto">
                    <div className="flex">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                <i className={`fa-solid ${tab.icon}`}></i>
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-bold">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-5">

                    {/* Tab: Mô tả */}
                    {activeTab === 'overview' && (
                        <div>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                                    {project.description || 'Không có mô tả.'}
                                </p>
                            </div>
                            {/* Comment section dưới overview */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
                                <CommentSection projectId={project.id} />
                            </div>
                        </div>
                    )}

                    {/* Tab: Linh kiện */}
                    {activeTab === 'bom' && (
                        <div>
                            {bomItems.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <i className="fa-solid fa-box-open text-3xl mb-2 block"></i>
                                    <p className="text-sm">Không có danh sách linh kiện.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-slate-500">{bomItems.length} linh kiện</span>
                                        <button
                                            onClick={handleCloneAll}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all"
                                        >
                                            <i className="fa-solid fa-code-branch"></i>
                                            Clone tất cả vào dự án
                                        </button>
                                    </div>
                                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800 text-left">
                                                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên linh kiện</th>
                                                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Danh mục</th>
                                                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">SL</th>
                                                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thêm</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {bomItems.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</div>
                                                            <div className="text-xs text-slate-400 sm:hidden">{item.category}</div>
                                                        </td>
                                                        <td className="px-4 py-3 hidden sm:table-cell">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                                {item.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                onClick={() => handleAddSingle(item)}
                                                                title="Thêm vào dự án"
                                                                className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center ml-auto transition-colors"
                                                            >
                                                                <i className="fa-solid fa-plus text-xs"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Tab: Sơ đồ */}
                    {activeTab === 'diagram' && (
                        <div>
                            {!project.diagram_code ? (
                                <div className="text-center py-12 text-slate-400">
                                    <i className="fa-solid fa-diagram-project text-3xl mb-2 block"></i>
                                    <p className="text-sm">Dự án này không có sơ đồ kết nối.</p>
                                </div>
                            ) : mermaidError ? (
                                <div className="text-center py-12 text-red-400">
                                    <i className="fa-solid fa-triangle-exclamation text-3xl mb-2 block"></i>
                                    <p className="text-sm">Không thể render sơ đồ.</p>
                                    <pre className="mt-4 text-left text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded-xl overflow-auto text-slate-600 dark:text-slate-400">
                                        {project.diagram_code}
                                    </pre>
                                </div>
                            ) : (
                                <div>
                                    {!mermaidLoaded && (
                                        <div className="flex items-center justify-center py-12 text-slate-400">
                                            <i className="fa-solid fa-spinner fa-spin text-2xl mr-2"></i>
                                            Đang render sơ đồ...
                                        </div>
                                    )}
                                    <div
                                        ref={diagramRef}
                                        className={`overflow-auto bg-white dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 ${!mermaidLoaded ? 'hidden' : ''}`}
                                    />
                                    {/* Raw code fallback */}
                                    {mermaidLoaded && (
                                        <details className="mt-4">
                                            <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300">
                                                Xem mã Mermaid gốc
                                            </summary>
                                            <pre className="mt-2 text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded-xl overflow-auto text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                                {project.diagram_code}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Mã nguồn */}
                    {activeTab === 'code' && (
                        <div>
                            {codeSnippets.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <i className="fa-solid fa-code text-3xl mb-2 block"></i>
                                    <p className="text-sm">Dự án này không có mã nguồn được chia sẻ.</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {codeSnippets.map((snippet, idx) => (
                                        <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                            {/* Code header */}
                                            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 dark:bg-slate-950">
                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-code text-blue-400 text-xs"></i>
                                                    <span className="text-xs font-bold text-slate-300">
                                                        {snippet.label || snippet.language || 'Code'}
                                                    </span>
                                                    {snippet.language && (
                                                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 font-mono">
                                                            {snippet.language}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleCopyCode(snippet.code, idx)}
                                                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all ${
                                                        copiedIdx === idx
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                                    }`}
                                                >
                                                    <i className={`fa-solid ${copiedIdx === idx ? 'fa-check' : 'fa-copy'}`}></i>
                                                    {copiedIdx === idx ? 'Đã chép' : 'Copy'}
                                                </button>
                                            </div>
                                            {/* Code body */}
                                            <pre className="p-4 overflow-auto text-xs leading-relaxed bg-slate-900 text-slate-200 max-h-80">
                                                <code>{snippet.code}</code>
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
