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
            className="relative w-full aspect-[4/3] max-w-2xl mx-auto perspective-1000 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="text-center">
                        <span className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-4 block">{term.category}</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-slate-100 mb-4">{term.term}</h2>
                        {term.fullName && (
                            <p className="text-sm md:text-base font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 inline-block px-4 py-2 rounded-lg">
                                {term.fullName}
                            </p>
                        )}
                        <p className="mt-8 text-sm text-blue-500 font-medium opacity-60">Click để lật thẻ <i className="fa-solid fa-rotate ml-1"></i></p>
                    </div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-blue-600 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-700 rounded-3xl shadow-xl p-8 text-white">
                    <div className="w-full max-w-xl mx-auto h-full flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4 border-b border-blue-400/30 pb-4 text-center">{term.term}</h3>
                        <div className="overflow-y-auto custom-scrollbar pr-2 max-h-[60%] flex flex-col gap-4">
                            <p className="text-base md:text-lg leading-relaxed">{term.definition}</p>
                            {term.applications && term.applications.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-bold text-sm text-blue-200 mb-2 uppercase tracking-wider">Ứng dụng:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-50">
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
