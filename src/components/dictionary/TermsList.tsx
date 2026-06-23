'use client';
import { useState, useEffect } from 'react';

export interface Term {
    id: string;
    term: string;
    fullName: string;
    category: string;
    definition: string;
    applications: string[];
    youtubeUrl: string;
    created_at: string;
    icon?: string;
}

interface TermsListProps {
    onSelectTerm: (term: Term) => void;
    selectedTermId?: string;
}

export default function TermsList({ onSelectTerm, selectedTermId }: TermsListProps) {
    const [terms, setTerms] = useState<Term[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Tất cả');

    const CATEGORIES = ["Tất cả", "Tự động hóa", "Cơ điện tử", "Khoa học máy tính", "Vi xử lý", "Điện tử số", "IoT", "Vô tuyến & Viễn thông"];

    useEffect(() => {
        const fetchTerms = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchQuery) params.append('q', searchQuery);
                if (activeCategory !== 'Tất cả') params.append('category', activeCategory);
                
                const res = await fetch(`/api/terms?${params.toString()}`);
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    setTerms(data);
                } else {
                    setTerms([]);
                }
            } catch (error) {
                console.error("Error loading terms", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(() => {
            fetchTerms();
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchQuery, activeCategory]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 h-[800px]">
            <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Tìm kiếm thuật ngữ viết tắt, tên đầy đủ hoặc nội dung..." 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all" 
                />
                
                {showSuggestions && searchQuery.trim().length > 0 && terms.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col">
                        {terms.slice(0, 5).map(term => (
                            <button
                                key={`suggest-${term.id}`}
                                onClick={() => {
                                    onSelectTerm(term);
                                    setShowSuggestions(false);
                                    setSearchQuery(term.term);
                                }}
                                className="text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800/50 last:border-0 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{term.term}</span>
                                    {term.fullName && <span className="text-[10px] text-slate-500 truncate mt-0.5">{term.fullName}</span>}
                                </div>
                                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {term.category}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-2 custom-scrollbar">
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
                {loading ? (
                    <div className="flex justify-center py-10"><i className="fa-solid fa-spinner animate-spin text-blue-500 text-2xl"></i></div>
                ) : terms.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-10">Không tìm thấy thuật ngữ nào phù hợp.</p>
                ) : (
                    terms.map(term => (
                        <div 
                            key={term.id} 
                            onClick={() => onSelectTerm(term)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTermId === term.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50 dark:bg-slate-800/50'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-100">{term.term}</h4>
                                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{term.category}</span>
                            </div>
                            {term.fullName && <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-mono mb-2 truncate">{term.fullName}</p>}
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{term.definition}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
