'use client';

import { useState, useEffect } from 'react';
import { Term } from '../dictionary/TermsList';
import Flashcard from './Flashcard';

export default function FlashcardDeck() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchRandomTerms = async (isInitial = false) => {
        if (!isInitial) setLoading(true);
        try {
            const res = await fetch('/api/terms?random=5');
            const data = await res.json();
            setTerms(data);
            setCurrentIndex(0);
        } catch (error) {
            console.error("Error loading flashcards", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchRandomTerms(true);
    }, []);

    const nextCard = () => {
        if (currentIndex < terms.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <i className="fa-solid fa-spinner animate-spin text-4xl text-blue-500 mb-4"></i>
                <p className="text-slate-500 dark:text-slate-400">Đang chuẩn bị thẻ từ vựng...</p>
            </div>
        );
    }

    if (terms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <i className="fa-solid fa-box-open text-4xl text-slate-400 mb-4"></i>
                <p className="text-slate-500 dark:text-slate-400">Không tìm thấy dữ liệu thuật ngữ.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-4 md:py-10 px-4 pb-32 md:pb-12">
            <div className="text-center mb-4 md:mb-10">
                <div className="inline-flex items-center justify-center p-2 md:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl md:rounded-2xl mb-2 md:mb-5 shadow-inner">
                    <i className="fa-solid fa-layer-group text-xl md:text-3xl text-blue-500 dark:text-blue-400"></i>
                </div>
                <h2 className="text-lg md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                    Flashcard Ôn Tập
                </h2>
                <p className="text-[11px] md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 md:mt-3">Học ngẫu nhiên 5 thuật ngữ mỗi lần</p>
            </div>

            <div className="w-full mb-5 md:mb-8">
                <Flashcard key={terms[currentIndex].id} term={terms[currentIndex]} />
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-800/80 backdrop-blur-md p-1.5 md:p-2 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <button 
                    onClick={prevCard} 
                    disabled={currentIndex === 0}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <i className="fa-solid fa-chevron-left text-sm md:text-base"></i>
                </button>
                
                <span className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 px-4 md:px-6 min-w-[5rem] md:min-w-[6rem] text-center tracking-widest">
                    {currentIndex + 1} / {terms.length}
                </span>

                <button 
                    onClick={nextCard} 
                    disabled={currentIndex === terms.length - 1}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <i className="fa-solid fa-chevron-right text-sm md:text-base"></i>
                </button>
            </div>

            <button 
                onClick={() => fetchRandomTerms()}
                className="mt-6 md:mt-10 px-5 py-2.5 md:px-6 md:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 md:gap-3 text-xs md:text-base"
            >
                <i className="fa-solid fa-shuffle"></i> 5 Từ ngẫu nhiên khác
            </button>
        </div>
    );
}
