'use client';

import { useProgress } from "@/context/ProgressContext";

export default function IntroStats() {
    const { readTerms, bookmarkedTerms } = useProgress();
    const TOTAL_TERMS = 3000;
    const progressPercent = Math.min(100, Math.round((readTerms.length / TOTAL_TERMS) * 100));

    return (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-500/10">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                    <circle cx="50" cy="50" r="40"/>
                    <circle cx="50" cy="50" r="30"/>
                    <line x1="10" y1="50" x2="90" y2="50"/>
                    <line x1="50" y1="10" x2="50" y2="90"/>
                </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8">
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider">Hệ Thống Tri Thức Toàn Diện</span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">Từ Điển Bách Khoa Công Nghệ Số</h2>
                    <p className="text-slate-300 mt-2 text-sm sm:text-base leading-relaxed">
                        Hơn <span className="text-cyan-300 font-bold">3000 thuật ngữ cốt lõi và thực tiễn</span> được giải nghĩa chi tiết kèm mô phỏng tương tác. Phân loại theo 6 chủ điểm: Cơ điện tử, Tự động hóa, Khoa học máy tính, Vi xử lý, Điện tử số, và Module/Linh kiện nhúng.
                    </p>
                </div>
                
                <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3"><i className="fa-solid fa-chart-pie mr-1 text-indigo-400"></i> Tiến trình học tập</h3>
                    <div className="flex flex-col gap-2.5">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Đã học (Mark as Read)</span>
                                <span className="font-mono font-bold text-blue-400">{readTerms.length}/{TOTAL_TERMS} ({progressPercent}%)</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Đã yêu thích (Bookmarks)</span>
                                <span className="font-mono font-bold text-amber-400">{bookmarkedTerms.length} từ khóa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
