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
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-8 px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-3">
                    <i className="fa-solid fa-layer-group text-blue-500"></i>
                    Flashcard Ôn Tập
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Học ngẫu nhiên 5 thuật ngữ mỗi lần</p>
            </div>

            <div className="w-full mb-8">
                <Flashcard key={terms[currentIndex].id} term={terms[currentIndex]} />
            </div>

            <div className="flex items-center gap-6">
                <button 
                    onClick={prevCard} 
                    disabled={currentIndex === 0}
                    className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">
                    {currentIndex + 1} / {terms.length}
                </span>

                <button 
                    onClick={nextCard} 
                    disabled={currentIndex === terms.length - 1}
                    className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            <button 
                onClick={() => fetchRandomTerms()}
                className="mt-8 px-6 py-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2"
            >
                <i className="fa-solid fa-shuffle"></i> 5 Từ ngẫu nhiên khác
            </button>
        </div>
    );
}
