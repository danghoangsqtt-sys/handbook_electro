'use client';

import { useState } from 'react';
import { Term } from '../dictionary/TermsList';

interface FlashcardProps {
    term: Term;
}

export default function Flashcard({ term }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div 
            className="relative w-full aspect-[3/2] sm:aspect-[4/3] max-w-2xl mx-auto perspective-1000 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="text-center">
                        <span className="text-[10px] md:text-xs uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 mb-2 md:mb-5 block">{term.category}</span>
                        <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 mb-2 md:mb-5 drop-shadow-sm">{term.term}</h2>
                        {term.fullName && (
                            <p className="text-[10px] md:text-sm font-mono text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 inline-block px-3 py-1 md:px-5 md:py-2 rounded-xl shadow-inner">
                                {term.fullName}
                            </p>
                        )}
                        <p className="mt-4 md:mt-10 text-[10px] md:text-sm text-blue-500 dark:text-blue-400 font-bold opacity-70 flex items-center justify-center gap-1.5 md:gap-2">
                            <span>Lật thẻ</span>
                            <i className="fa-solid fa-arrow-rotate-right bg-blue-50 dark:bg-blue-900/30 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center"></i>
                        </p>
                    </div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-blue-600 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-700 rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 text-white">
                    <div className="w-full max-w-xl mx-auto h-full flex flex-col justify-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 border-b border-blue-400/30 pb-2 md:pb-4 text-center">{term.term}</h3>
                        <div className="overflow-y-auto custom-scrollbar pr-2 max-h-[70%] flex flex-col gap-3 md:gap-4">
                            <p className="text-sm md:text-lg leading-relaxed">{term.definition}</p>
                            {term.applications && term.applications.length > 0 && (
                                <div className="mt-2 md:mt-4">
                                    <h4 className="font-bold text-xs md:text-sm text-blue-200 mb-1.5 md:mb-2 uppercase tracking-wider">Ứng dụng:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-blue-50">
                                        {term.applications.map((app, i) => (
                                            <li key={i}>{app}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom CSS for 3D flip effect since Tailwind doesn't have it built-in by default */}
            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
}
