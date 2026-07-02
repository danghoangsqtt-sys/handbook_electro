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
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col gap-3 sm:gap-4 min-h-[calc(100vh-250px)] md:h-[800px]">
            <div className="flex items-center gap-2 relative z-30">
                <div className="relative flex-1">
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
                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
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

                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    className={`flex items-center justify-center w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-xl flex-shrink-0 transition-colors border ${activeCategory !== 'Tất cả' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-950/50 dark:border-slate-800/80 dark:hover:bg-slate-800'}`}
                >
                    <i className="fa-solid fa-filter text-sm"></i>
                </button>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                    <div className="absolute top-[calc(100%+0.5rem)] right-0 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-40 overflow-hidden flex flex-col py-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={`filter-${cat}`}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setIsFilterOpen(false);
                                }}
                                className={`text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${activeCategory === cat ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                            >
                                {cat}
                                {activeCategory === cat && <i className="fa-solid fa-check text-xs"></i>}
                            </button>
                        ))}
                    </div>
                )}
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
                            className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${selectedTermId === term.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50 dark:bg-slate-800/50'}`}
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
