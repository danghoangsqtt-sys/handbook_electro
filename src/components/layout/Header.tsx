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
                    <Link href="/"><h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Electro Creative</h1></Link>
                        <p className="hidden md:block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold font-mono">Electronics Engineering Hub</p>
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
                        { id: 'community', label: 'Thư Viện Dự Án', icon: 'fa-folder-open' }
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

            </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {setActiveTab && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 lg:hidden px-2 pb-2 pt-2 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-around h-14">
            {[
              { id: 'components', label: 'Linh Kiện', icon: 'fa-microchip' },
              { id: 'dictionary', label: 'Từ Điển', icon: 'fa-language' },
              { id: 'labs', label: 'AI Lab', icon: 'fa-vial' },
              { id: 'quiz', label: 'Flashcard', icon: 'fa-layer-group' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { if (setActiveTab) setActiveTab(tab.id as NonNullable<HeaderProps['activeTab']>); setIsMobileMenuOpen(false); }}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                  activeTab === tab.id 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}>
                  <i className={`fa-solid ${tab.icon} ${activeTab === tab.id ? 'text-lg' : 'text-base'}`}></i>
                </div>
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </button>
            ))}
            
            {/* Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                isMobileMenuOpen
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isMobileMenuOpen ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}>
                <i className={`fa-solid fa-bars ${isMobileMenuOpen ? 'text-lg' : 'text-base'}`}></i>
              </div>
              <span className="text-[10px] font-semibold">Thêm</span>
            </button>
          </div>
        </nav>
      )}

      {/* Mobile Bottom Sheet (Menu Mở rộng) */}
      {isMobileMenuOpen && setActiveTab && (
        <div className="fixed inset-0 z-40 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sheet Content */}
          <div className="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col animate-fade-in pb-24 pt-4">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
            
            <div className="px-6 flex flex-col gap-4">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Chức năng mở rộng</h3>
              
              <button
                onClick={() => {
                  setActiveTab('community');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all flex items-center gap-4 border border-slate-100 dark:border-slate-800 shadow-sm ${
                  activeTab === 'community' 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === 'community' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <i className="fa-solid fa-folder-open text-lg"></i>
                </div>
                <div>
                    <div className="text-base">Thư Viện Dự Án</div>
                    <div className="text-xs text-slate-500 font-normal mt-0.5">Cộng đồng chia sẻ dự án IoT</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
