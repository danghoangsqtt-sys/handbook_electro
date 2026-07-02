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

interface PinConnection {
    component: string;
    component_pin: string;
    mcu: string;
    mcu_pin: string;
    protocol: string;
    voltage?: string;
    note?: string;
}

interface CommunityProject {
    id: string;
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bom_data: any[];
    diagram_code: string | null;
    schematic_image_url: string | null;
    pin_connections: PinConnection[] | null;
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
type DiagramSubTab = 'schematic' | 'pinout' | 'block';

// Protocol badge colors
const PROTOCOL_COLORS: Record<string, string> = {
    'I2C':    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    'SPI':    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    'UART':   'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
    'GPIO':   'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
    'PWM':    'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20',
    'ADC':    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    'Power':  'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    'GND':    'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20',
};

function ProtocolBadge({ protocol }: { protocol: string }) {
    const cls = PROTOCOL_COLORS[protocol] || PROTOCOL_COLORS['GPIO'];
    return (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest font-mono ${cls}`}>
            {protocol}
        </span>
    );
}

function PinConnectionTable({ pins }: { pins: PinConnection[] }) {
    if (!pins || pins.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <i className="fa-solid fa-plug text-3xl mb-2 block opacity-40"></i>
                <p className="text-sm">Chưa có bảng kết nối chân.</p>
            </div>
        );
    }

    // Group by component
    const groups = pins.reduce((acc, pin) => {
        if (!acc[pin.component]) acc[pin.component] = [];
        acc[pin.component].push(pin);
        return acc;
    }, {} as Record<string, PinConnection[]>);

    return (
        <div className="space-y-5">
            {Object.entries(groups).map(([component, rows]) => (
                <div key={component}>
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-microchip text-[#2D9CDB] text-xs"></i>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">{component}</span>
                        <span className="text-xs text-slate-400">— {rows.length} chân</span>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#30363D]">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#161B22]">
                                    <th className="px-3 py-2 text-left font-bold text-slate-400 uppercase tracking-widest">Chân LK</th>
                                    <th className="px-3 py-2 text-left font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">MCU</th>
                                    <th className="px-3 py-2 text-left font-bold text-slate-400 uppercase tracking-widest">Chân MCU</th>
                                    <th className="px-3 py-2 text-left font-bold text-slate-400 uppercase tracking-widest">Giao thức</th>
                                    <th className="px-3 py-2 text-left font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Điện áp</th>
                                    <th className="px-3 py-2 text-left font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]">
                                {rows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                                        <td className="px-3 py-2.5 font-mono font-semibold text-slate-700 dark:text-slate-200">{row.component_pin}</td>
                                        <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{row.mcu}</td>
                                        <td className="px-3 py-2.5 font-mono text-[#2D9CDB] font-bold">{row.mcu_pin}</td>
                                        <td className="px-3 py-2.5"><ProtocolBadge protocol={row.protocol} /></td>
                                        <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 hidden md:table-cell">{row.voltage || '—'}</td>
                                        <td className="px-3 py-2.5 text-slate-400 hidden lg:table-cell">{row.note || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ProjectDetailModal({
    project,
    onClose,
    likedProjects,
    onLike,
    likingId
}: ProjectDetailModalProps) {
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [diagramSubTab, setDiagramSubTab] = useState<DiagramSubTab>('schematic');
    const [mermaidLoaded, setMermaidLoaded] = useState(false);
    const [mermaidError, setMermaidError] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
    const [schematicFullscreen, setSchematicFullscreen] = useState(false);
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

    // Parse pin_connections
    const pinConnections: PinConnection[] = (() => {
        if (!project?.pin_connections) return [];
        if (typeof project.pin_connections === 'string') {
            try { return JSON.parse(project.pin_connections); } catch { return []; }
        }
        if (Array.isArray(project.pin_connections)) return project.pin_connections;
        return [];
    })();

    // Auto-select best sub-tab when opening diagram tab
    useEffect(() => {
        if (activeTab === 'diagram') {
            if (project?.schematic_image_url) setDiagramSubTab('schematic');
            else if (pinConnections.length > 0) setDiagramSubTab('pinout');
            else setDiagramSubTab('block');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, project?.id]);

    // Render Mermaid diagram
    useEffect(() => {
        if (activeTab !== 'diagram' || diagramSubTab !== 'block' || !project?.diagram_code || !diagramRef.current) return;

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
                // Unescape literal \n stored as string (from SQL seed data)
                const diagramCode = project.diagram_code!.replace(/\\n/g, '\n');
                const { svg } = await mermaid.render(id, diagramCode);
                if (diagramRef.current) {
                    diagramRef.current.innerHTML = svg;
                    setMermaidLoaded(true);
                }
            } catch {
                setMermaidError(true);
            }
        };

        renderDiagram();
    }, [activeTab, diagramSubTab, project]);

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

    // Diagram sub-tabs — only show tabs with data
    const diagramSubTabs: { id: DiagramSubTab; label: string; icon: string; available: boolean }[] = [
        { id: 'schematic', label: 'Nguyên Lý', icon: 'fa-image', available: !!project.schematic_image_url },
        { id: 'pinout', label: 'Kết Nối Chân', icon: 'fa-plug', available: pinConnections.length > 0 },
        { id: 'block', label: 'Sơ đồ Khối', icon: 'fa-share-nodes', available: !!project.diagram_code },
    ];
    const availableSubTabs = diagramSubTabs.filter(t => t.available);
    const hasDiagramData = availableSubTabs.length > 0;

    const isLiked = likedProjects.has(project.id);

    return (
        <>
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
            onClick={handleBackdrop}
        >
            <div className="relative w-full sm:max-w-5xl bg-white dark:bg-[#0D1117] rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black/50 flex flex-col max-h-[97vh] sm:max-h-[92vh] overflow-hidden animate-slide-up border-0 sm:border sm:border-white/10">

                {/* Header */}
                <div className="flex-shrink-0 bg-gradient-to-br from-[#0f2744] via-[#1a3a5c] to-[#0D1117] p-5 text-white relative overflow-hidden">
                    {/* Blur blobs */}
                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#2D9CDB]/20 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#2D9CDB]/40 via-[#00D4FF]/20 to-transparent"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-sm"></i>
                    </button>

                    {/* Author */}
                    <div className="flex items-center gap-3 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={project.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.profiles?.display_name || 'A')}&background=2D9CDB&color=fff`}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                        />
                        <div>
                            <p className="font-semibold text-sm">{project.profiles?.display_name || 'Anonymous'}</p>
                            <p className="text-xs text-blue-200/70">
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
                                        : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
                                }`}
                            >
                                <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                                {project.likes_count}
                            </button>
                        </div>
                    </div>

                    <h2 className="text-lg font-black leading-snug pr-10">{project.title}</h2>

                    {/* Quick stats */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-blue-200/60 flex-wrap">
                        <span><i className="fa-solid fa-microchip mr-1 text-[#2D9CDB]"></i>{bomItems.length} linh kiện</span>
                        {project.schematic_image_url && <span><i className="fa-solid fa-image mr-1 text-emerald-400"></i>Sơ đồ nguyên lý</span>}
                        {pinConnections.length > 0 && <span><i className="fa-solid fa-plug mr-1 text-amber-400"></i>{pinConnections.length} kết nối chân</span>}
                        {project.diagram_code && <span><i className="fa-solid fa-share-nodes mr-1 text-violet-400"></i>Sơ đồ khối</span>}
                        {codeSnippets.length > 0 && <span><i className="fa-solid fa-code mr-1 text-cyan-400"></i>{codeSnippets.length} đoạn code</span>}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex-shrink-0 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#161B22] px-2 overflow-x-auto">
                    <div className="flex">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-[#2D9CDB] text-[#2D9CDB]'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                <i className={`fa-solid ${tab.icon}`}></i>
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className="text-xs bg-blue-100 dark:bg-[#2D9CDB]/20 text-blue-600 dark:text-[#2D9CDB] px-1.5 py-0.5 rounded-full font-bold">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-5 bg-white dark:bg-[#0D1117] custom-scrollbar">

                    {/* Tab: Mô tả */}
                    {activeTab === 'overview' && (
                        <div>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                                    {project.description || 'Không có mô tả.'}
                                </p>
                            </div>
                            {/* Comment section dưới overview */}
                            <div className="border-t border-slate-100 dark:border-white/5 pt-6 mt-6">
                                <CommentSection projectId={project.id} />
                            </div>
                        </div>
                    )}

                    {/* Tab: Linh kiện */}
                    {activeTab === 'bom' && (
                        <div>
                            {bomItems.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <i className="fa-solid fa-box-open text-3xl mb-2 block opacity-40"></i>
                                    <p className="text-sm">Không có danh sách linh kiện.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-slate-500">{bomItems.length} linh kiện</span>
                                        <button
                                            onClick={handleCloneAll}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#2D9CDB] to-[#00D4FF] hover:opacity-90 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all"
                                        >
                                            <i className="fa-solid fa-code-branch"></i>
                                            Clone tất cả vào dự án
                                        </button>
                                    </div>
                                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#30363D]">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-[#161B22] text-left">
                                                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên linh kiện</th>
                                                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Danh mục</th>
                                                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">SL</th>
                                                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thêm</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]">
                                                {bomItems.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</div>
                                                            <div className="text-xs text-slate-400 sm:hidden">{item.category}</div>
                                                        </td>
                                                        <td className="px-4 py-3 hidden sm:table-cell">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-[#2D9CDB]/10 text-blue-600 dark:text-[#2D9CDB]">
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
                                                                className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-[#2D9CDB]/10 hover:bg-blue-100 dark:hover:bg-[#2D9CDB]/20 text-blue-600 dark:text-[#2D9CDB] flex items-center justify-center ml-auto transition-colors"
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

                    {/* Tab: Sơ đồ — 3-in-1 */}
                    {activeTab === 'diagram' && (
                        <div>
                            {!hasDiagramData ? (
                                <div className="text-center py-16 text-slate-400">
                                    <i className="fa-solid fa-diagram-project text-4xl mb-3 block opacity-30"></i>
                                    <p className="text-sm font-medium">Dự án này chưa có sơ đồ.</p>
                                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Tác giả chưa chia sẻ sơ đồ nguyên lý, kết nối chân hoặc sơ đồ khối.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Sub-tab bar */}
                                    {availableSubTabs.length > 1 && (
                                        <div className="flex gap-1 mb-5 bg-slate-100 dark:bg-white/5 rounded-xl p-1">
                                            {availableSubTabs.map(st => (
                                                <button
                                                    key={st.id}
                                                    onClick={() => setDiagramSubTab(st.id)}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                                        diagramSubTab === st.id
                                                            ? 'bg-white dark:bg-[#161B22] text-[#2D9CDB] shadow-sm'
                                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    <i className={`fa-solid ${st.icon} text-[10px]`}></i>
                                                    {st.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Sub-tab: Sơ đồ Nguyên Lý */}
                                    {diagramSubTab === 'schematic' && (
                                        <div>
                                            {project.schematic_image_url ? (
                                                <div className="relative group">
                                                    <div className="bg-white dark:bg-[#161B22] rounded-xl border border-slate-200 dark:border-[#30363D] overflow-hidden">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={project.schematic_image_url}
                                                            alt="Sơ đồ nguyên lý"
                                                            className="w-full object-contain max-h-[500px] cursor-zoom-in"
                                                            onClick={() => setSchematicFullscreen(true)}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => setSchematicFullscreen(true)}
                                                        className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <i className="fa-solid fa-expand text-[10px]"></i>
                                                        Phóng to
                                                    </button>
                                                    <p className="text-xs text-slate-400 mt-2 text-center">
                                                        <i className="fa-solid fa-circle-info mr-1"></i>
                                                        Click ảnh để phóng to — Sơ đồ nguyên lý do tác giả tải lên
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-slate-400">
                                                    <i className="fa-solid fa-image text-3xl mb-2 block opacity-30"></i>
                                                    <p className="text-sm">Chưa có sơ đồ nguyên lý.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Sub-tab: Kết Nối Chân */}
                                    {diagramSubTab === 'pinout' && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Bảng Kết Nối Chân</h4>
                                                <div className="flex gap-1 flex-wrap">
                                                    {Object.entries(PROTOCOL_COLORS).slice(0, 5).map(([p, cls]) => (
                                                        <span key={p} className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase font-mono ${cls}`}>{p}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <PinConnectionTable pins={pinConnections} />
                                        </div>
                                    )}

                                    {/* Sub-tab: Sơ đồ Khối Mermaid */}
                                    {diagramSubTab === 'block' && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Sơ đồ Khối</h4>
                                                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">Block Diagram</span>
                                            </div>
                                            {!project.diagram_code ? (
                                                <div className="text-center py-12 text-slate-400">
                                                    <i className="fa-solid fa-share-nodes text-3xl mb-2 block opacity-30"></i>
                                                    <p className="text-sm">Chưa có sơ đồ khối.</p>
                                                </div>
                                            ) : mermaidError ? (
                                                <div className="text-center py-10 text-red-400">
                                                    <i className="fa-solid fa-triangle-exclamation text-2xl mb-2 block"></i>
                                                    <p className="text-sm mb-3">Không thể render sơ đồ.</p>
                                                    <pre className="text-left text-xs bg-slate-100 dark:bg-[#161B22] p-4 rounded-xl overflow-auto text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#30363D]">
                                                        {project.diagram_code}
                                                    </pre>
                                                </div>
                                            ) : (
                                                <div>
                                                    {!mermaidLoaded && (
                                                        <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
                                                            <i className="fa-solid fa-spinner fa-spin text-xl text-[#2D9CDB]"></i>
                                                            <span className="text-sm">Đang render sơ đồ...</span>
                                                        </div>
                                                    )}
                                                    <div
                                                        ref={diagramRef}
                                                        className={`overflow-auto bg-white dark:bg-[#161B22] rounded-xl p-4 border border-slate-200 dark:border-[#30363D] ${!mermaidLoaded ? 'hidden' : ''}`}
                                                    />
                                                    {mermaidLoaded && (
                                                        <details className="mt-4">
                                                            <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300">
                                                                Xem mã Mermaid gốc
                                                            </summary>
                                                            <pre className="mt-2 text-xs bg-slate-100 dark:bg-[#161B22] p-4 rounded-xl overflow-auto text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#30363D] whitespace-pre-wrap">
                                                                {project.diagram_code}
                                                            </pre>
                                                        </details>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Tab: Mã nguồn */}
                    {activeTab === 'code' && (
                        <div>
                            {codeSnippets.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <i className="fa-solid fa-code text-3xl mb-2 block opacity-30"></i>
                                    <p className="text-sm">Dự án này không có mã nguồn được chia sẻ.</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {codeSnippets.map((snippet, idx) => (
                                        <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#30363D]">
                                            {/* Code header */}
                                            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] dark:bg-[#0D1117]">
                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-code text-[#2D9CDB] text-xs"></i>
                                                    <span className="text-xs font-bold text-slate-300 font-mono">
                                                        {snippet.label || snippet.language || 'Code'}
                                                    </span>
                                                    {snippet.language && (
                                                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#30363D] text-slate-400 font-mono">
                                                            {snippet.language}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleCopyCode(snippet.code, idx)}
                                                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all ${
                                                        copiedIdx === idx
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : 'bg-[#30363D] hover:bg-[#3d444d] text-slate-300'
                                                    }`}
                                                >
                                                    <i className={`fa-solid ${copiedIdx === idx ? 'fa-check' : 'fa-copy'}`}></i>
                                                    {copiedIdx === idx ? 'Đã chép' : 'Copy'}
                                                </button>
                                            </div>
                                            {/* Code body */}
                                            <pre className="p-4 overflow-auto text-xs leading-relaxed bg-[#0D1117] text-slate-200 max-h-80 font-mono">
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

        {/* Schematic Fullscreen */}
        {schematicFullscreen && project.schematic_image_url && (
            <div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
                onClick={() => setSchematicFullscreen(false)}
            >
                <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                    onClick={() => setSchematicFullscreen(false)}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={project.schematic_image_url}
                    alt="Sơ đồ nguyên lý — toàn màn hình"
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    onClick={e => e.stopPropagation()}
                />
            </div>
        )}
        </>
    );
}
