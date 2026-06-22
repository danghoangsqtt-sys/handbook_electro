'use client';
import { useState, useEffect } from 'react';

export default function Header() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <i className="fa-solid fa-microchip text-base md:text-xl animate-pulse"></i>
                </div>
                <div>
                    <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">TechDict v5.0</h1>
                    <p className="hidden md:block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold font-mono">3000+ Pro Terms Edition</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button onClick={toggleTheme} className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Chuyển chế độ sáng/tối">
                    <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon text-slate-600'}`}></i>
                </button>
                <button className="relative px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 flex items-center gap-2 transition-all">
                    <i className="fa-solid fa-gamepad animate-bounce"></i> <span className="hidden md:inline">Trắc Nghiệm Kiến Thức</span>
                </button>
            </div>
        </div>
    </header>
  );
}
