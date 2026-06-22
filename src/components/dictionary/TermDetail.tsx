'use client';

import { Term } from './TermsList';
import { useProgress } from '@/context/ProgressContext';

interface TermDetailProps {
    term: Term | null;
    onBack?: () => void;
}

export default function TermDetail({ term, onBack }: TermDetailProps) {
    const { readTerms, bookmarkedTerms, toggleRead, toggleBookmark } = useProgress();
    if (!term) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24 h-[800px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-arrow-pointer text-2xl animate-bounce"></i>
                    </div>
                    <h3 className="text-base font-bold">Chọn thuật ngữ để xem thông tin</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto mt-2">Nhấp vào một thuật ngữ bất kỳ ở bảng bên trái để xem định nghĩa đầy đủ, ứng dụng, phát âm và video hướng dẫn chi tiết từ YouTube.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-sm sticky top-24 h-[800px] overflow-y-auto custom-scrollbar flex flex-col gap-6">
            {/* Mobile Back Button */}
            {onBack && (
                <button 
                    onClick={onBack}
                    className="lg:hidden flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm mb-2"
                >
                    <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
                </button>
            )}

            <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {term.icon && (
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center shadow-inner">
                                <i className={`${term.icon} text-xl`}></i>
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{term.term}</h2>
                            {term.fullName && <p className="font-mono text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">{term.fullName}</p>}
                        </div>
                    </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => toggleRead(term.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${readTerms.includes(term.id) ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400'}`}
                    >
                        <i className={`fa-solid ${readTerms.includes(term.id) ? 'fa-check-double' : 'fa-check'}`}></i>
                        {readTerms.includes(term.id) ? 'Đã học' : 'Đánh dấu đã học'}
                    </button>

                    <button 
                        onClick={() => toggleBookmark(term.id)}
                        className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${bookmarkedTerms.includes(term.id) ? 'bg-amber-100 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`} 
                        title="Lưu vào Bookmark"
                    >
                        <i className={`${bookmarkedTerms.includes(term.id) ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                    <i className="fa-solid fa-tag mr-1 text-blue-500"></i> {term.category}
                </span>
            </div>

            <div>
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">Định nghĩa</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs md:text-sm">{term.definition}</p>
            </div>

            {term.applications && term.applications.length > 0 && (
                <div>
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">Ứng dụng thực tiễn</h3>
                    <ul className="flex flex-col gap-2">
                        {term.applications.map((app, index) => (
                            <li key={index} className="flex gap-3 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                                <i className="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i>
                                <span className="leading-relaxed">{app}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">Tra cứu Video trên YouTube</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent((term.fullName || term.term) + " " + term.term + " là gì?")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold transition-all border border-red-100 dark:border-red-900/30 group text-sm"
                    >
                        <i className="fa-brands fa-youtube text-lg group-hover:scale-110 transition-transform"></i>
                        Tìm &quot;{term.term} là gì?&quot;
                    </a>
                    <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent("Tính năng và ứng dụng của " + (term.fullName || term.term) + " " + term.term + " " + term.category)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all border border-slate-200 dark:border-slate-700 group text-sm"
                    >
                        <i className="fa-solid fa-magnifying-glass text-lg group-hover:scale-110 transition-transform text-slate-400"></i>
                        Tính năng của {term.term}
                    </a>
                </div>
            </div>
        </div>
    );
}
