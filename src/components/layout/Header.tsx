'use client';
import { useState, useEffect } from 'react';

import Image from 'next/image';

import Link from 'next/link';

interface HeaderProps {
  activeTab?: 'components' | 'dictionary' | 'labs' | 'quiz' | 'community' | 'profile';
  setActiveTab?: (tab: 'components' | 'dictionary' | 'labs' | 'quiz' | 'community' | 'profile') => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [theme, setTheme] = useState('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden flex items-center justify-center bg-slate-900 shadow-lg shadow-blue-500/20">
                        <Image src="/logo.png" alt="TechDict Logo" width={40} height={40} className="w-full h-full object-cover" />
                    </Link>
                    <div>
                        <Link href="/"><h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">TechDict v5.0</h1></Link>
                        <p className="hidden md:block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold font-mono">3000+ Pro Terms Edition</p>
                    </div>
                </div>

                {/* Desktop Navigation */}
                {setActiveTab && (
                  <nav className="hidden lg:flex items-center gap-1 ml-4">
                      {[
                        { id: 'components', label: 'Thư viện Linh kiện', icon: 'fa-microchip' },
                        { id: 'dictionary', label: 'Tra Cứu Từ Điển', icon: 'fa-language' },
                        { id: 'labs', label: 'Phòng Thí Nghiệm AI', icon: 'fa-vial' },
                        { id: 'quiz', label: 'Flashcard', icon: 'fa-layer-group' },
                        { id: 'community', label: 'Cộng đồng', icon: 'fa-globe' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as 'components' | 'dictionary' | 'labs' | 'quiz' | 'community' | 'profile')}
                          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                            activeTab === tab.id 
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <i className={`fa-solid ${tab.icon}`}></i>
                          {tab.label}
                        </button>
                      ))}
                  </nav>
                )}
            </div>

            <div className="flex items-center gap-3">
                {setActiveTab && (
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Hồ sơ cá nhân"
                    >
                        <i className={`fa-solid fa-user text-slate-600 dark:text-slate-300`}></i>
                    </button>
                )}

                <button onClick={toggleTheme} className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Chuyển chế độ sáng/tối">
                    <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon text-slate-600'}`}></i>
                </button>
                <button className="hidden sm:flex relative px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 items-center gap-2 transition-all">
                    <i className="fa-solid fa-layer-group animate-bounce"></i> <span className="hidden xl:inline">Flashcard Ngẫu Nhiên</span>
                </button>

                {/* Mobile Menu Toggle */}
                {setActiveTab && (
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <i className="fa-solid fa-bars"></i>
                  </button>
                )}
            </div>
        </div>
      </header>

      {/* Mobile Side Drawer Menu */}
      {isMobileMenuOpen && setActiveTab && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="relative w-4/5 max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col ml-auto animate-slide-in-right">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <h2 className="font-bold text-slate-900 dark:text-white">Menu Điều Hướng</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
              {[
                { id: 'components', label: 'Thư viện Linh kiện', icon: 'fa-microchip' },
                { id: 'dictionary', label: 'Tra Cứu Từ Điển', icon: 'fa-language' },
                { id: 'labs', label: 'Phòng Thí Nghiệm AI', icon: 'fa-vial' },
                { id: 'quiz', label: 'Flashcard', icon: 'fa-layer-group' },
                { id: 'community', label: 'Cộng đồng', icon: 'fa-globe' },
                { id: 'profile', label: 'Hồ sơ cá nhân', icon: 'fa-user' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as 'components' | 'dictionary' | 'labs' | 'quiz' | 'community' | 'profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 md:p-4 rounded-xl text-left font-semibold text-sm transition-all flex items-center gap-3 ${
                    activeTab === tab.id 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === tab.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <i className={`fa-solid ${tab.icon}`}></i>
                  </div>
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
              <button className="w-full p-3 rounded-xl text-left font-bold text-sm transition-all flex items-center gap-3 text-white bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-md">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20">
                    <i className="fa-solid fa-layer-group"></i>
                  </div>
                  Flashcard Ngẫu Nhiên
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
