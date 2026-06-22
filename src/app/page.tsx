'use client';
import { useState } from 'react';
import Header from "@/components/layout/Header";
import IntroStats from "@/components/dashboard/IntroStats";
import TermsList, { Term } from "@/components/dictionary/TermsList";
import TermDetail from "@/components/dictionary/TermDetail";
import AILab from "@/components/labs/AILab";
import QuizSystem from "@/components/quiz/QuizSystem";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'labs' | 'quiz'>('dictionary');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
        <IntroStats />
        
        <div className="flex overflow-x-auto whitespace-nowrap custom-scrollbar border-b border-slate-200 dark:border-slate-800 pb-px">
            <button 
                onClick={() => setActiveTab('dictionary')} 
                className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm border-b-2 flex flex-shrink-0 items-center gap-2 transition-all ${activeTab === 'dictionary' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                <i className="fa-solid fa-language"></i> Tra Cứu Từ Điển
            </button>
            <button 
                onClick={() => setActiveTab('labs')} 
                className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm border-b-2 flex flex-shrink-0 items-center gap-2 transition-all ${activeTab === 'labs' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                <i className="fa-solid fa-vial"></i> Phòng Thí Nghiệm AI
            </button>
            <button 
                onClick={() => setActiveTab('quiz')} 
                className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm border-b-2 flex flex-shrink-0 items-center gap-2 transition-all ${activeTab === 'quiz' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                <i className="fa-solid fa-circle-question"></i> Trắc Nghiệm Tùy Biến
            </button>
        </div>

        {activeTab === 'dictionary' && (
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className={`lg:col-span-7 flex-col gap-6 ${selectedTerm ? 'hidden lg:flex' : 'flex'}`}>
                    <TermsList onSelectTerm={setSelectedTerm} selectedTermId={selectedTerm?.id} />
                </div>
                <div className={`lg:col-span-5 flex-col gap-6 ${selectedTerm ? 'flex' : 'hidden lg:flex'}`}>
                    <TermDetail term={selectedTerm} onBack={() => setSelectedTerm(null)} />
                </div>
            </section>
        )}

        {activeTab === 'labs' && (
            <section>
                <AILab />
            </section>
        )}

        {activeTab === 'quiz' && (
            <section>
                <QuizSystem />
            </section>
        )}
      </main>
      
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 transition-all">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">&copy; 2026 TechDict 5.0 - Từ điển bách khoa hệ thống thông tin, tự động hóa và cơ điện tử.</p>
            <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">3000+ Terms Database</span>
            </div>
        </div>
      </footer>
    </>
  );
}
