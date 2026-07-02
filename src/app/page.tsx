'use client';
import { useState } from 'react';
import Header from "@/components/layout/Header";
import IntroStats from "@/components/dashboard/IntroStats";
import TermsList, { Term } from "@/components/dictionary/TermsList";
import TermDetail from "@/components/dictionary/TermDetail";
import AILab from "@/components/labs/AILab";
import FlashcardDeck from "@/components/flashcard/FlashcardDeck";
import ComponentLibrary from "@/components/components/ComponentLibrary";
import UserProfile from "@/components/profile/UserProfile";
import CommunityShowcase from "@/components/community/CommunityShowcase";
import { useBOMStore } from '@/store/useBOMStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'components' | 'dictionary' | 'labs' | 'quiz' | 'profile' | 'community'>('dictionary');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isProjectStudioOpen } = useBOMStore();



  return (
    <div className={`flex flex-col ${activeTab === 'labs' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className={`flex-1 flex flex-col w-full mx-auto ${activeTab === 'labs' ? 'max-w-none px-0 py-0 gap-0' : 'max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 gap-8'}`}>
        {activeTab === 'dictionary' && <IntroStats />}

        {activeTab === 'components' && (
            <section>
                <ComponentLibrary />
            </section>
        )}

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
            <section className="flex-1 flex w-full h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
                <AILab />
            </section>
        )}

        {activeTab === 'quiz' && (
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[600px]">
                <FlashcardDeck />
            </section>
        )}

        {activeTab === 'profile' && (
            <section>
                <UserProfile />
            </section>
        )}

        {activeTab === 'community' && (
            <section>
                <CommunityShowcase />
            </section>
        )}
      </main>
      
      {activeTab !== 'labs' && (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 transition-all">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">&copy; 2026 TechDict 5.0 - Từ điển bách khoa hệ thống thông tin, tự động hóa và cơ điện tử.</p>
              <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">3000+ Terms Database</span>
              </div>
          </div>
        </footer>
      )}
    </div>
  );
}
