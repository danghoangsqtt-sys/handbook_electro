'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (session && pathname === '/admin/login') {
        router.push('/admin/dashboard');
      } else if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (event === 'SIGNED_IN' && pathname === '/admin/login') {
        router.push('/admin/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500"><i className="fa-solid fa-spinner animate-spin text-3xl"></i></div>;
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    // Show a loading spinner instead of null to prevent white screen flash
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500"><i className="fa-solid fa-spinner animate-spin text-3xl"></i></div>;
  }

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950">{children}</div>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-[#0066FF] selection:text-white">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="font-bold tracking-tight text-xl flex items-center gap-2">
            <span className="w-2 h-2 bg-[#0066FF] rounded-none shadow-[0_0_10px_#0066FF] animate-pulse"></span>
            TechDict Admin
          </h1>
        </div>
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          <Link href="/admin/dashboard" className={`flex items-center gap-3 px-6 py-3 transition-all font-medium text-sm ${pathname === '/admin/dashboard' ? 'bg-[#0066FF]/10 text-[#0066FF] border-l-2 border-[#0066FF]' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 border-l-2 border-transparent'}`}>
            <i className="fa-solid fa-square-terminal w-5 text-center"></i> Dashboard
          </Link>
          <Link href="/admin/components" className={`flex items-center gap-3 px-6 py-3 transition-all font-medium text-sm ${pathname === '/admin/components' ? 'bg-[#0066FF]/10 text-[#0066FF] border-l-2 border-[#0066FF]' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 border-l-2 border-transparent'}`}>
            <i className="fa-solid fa-microchip w-5 text-center"></i> Linh kiện
          </Link>
          <Link href="/admin/terms" className={`flex items-center gap-3 px-6 py-3 transition-all font-medium text-sm ${pathname === '/admin/terms' ? 'bg-[#0066FF]/10 text-[#0066FF] border-l-2 border-[#0066FF]' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 border-l-2 border-transparent'}`}>
            <i className="fa-solid fa-book-journal-whills w-5 text-center"></i> Thuật ngữ
          </Link>
          <Link href="/admin/users" className={`flex items-center gap-3 px-6 py-3 transition-all font-medium text-sm ${pathname === '/admin/users' ? 'bg-[#0066FF]/10 text-[#0066FF] border-l-2 border-[#0066FF]' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 border-l-2 border-transparent'}`}>
            <i className="fa-solid fa-users w-5 text-center"></i> Người dùng
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 transition-colors dark:hover:bg-red-500/10 text-left text-sm font-medium rounded-xl border border-transparent hover:border-red-500/20">
            <i className="fa-solid fa-power-off w-5 text-center"></i> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-16 md:pb-0">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 relative z-10">
          <h2 className="font-semibold text-lg tracking-tight">
            {pathname === '/admin/dashboard' ? 'Overview' : pathname === '/admin/components' ? 'Linh Kiện' : pathname === '/admin/users' ? 'Người Dùng' : 'Thuật Ngữ'}
          </h2>
          <Link href="/" target="_blank" className="text-xs font-medium text-[#0066FF] hover:bg-[#0066FF]/10 transition-colors flex items-center gap-2 border border-[#0066FF]/30 px-4 py-2 rounded-xl">
            <span>Trang chủ</span>
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </Link>
        </header>
        {/* Main scrollable area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative z-10">
          <div className="max-w-7xl mx-auto pb-6">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center z-50 h-16 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <Link href="/admin/dashboard" className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-medium transition-colors ${pathname === '/admin/dashboard' ? 'text-[#0066FF] bg-[#0066FF]/5' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
          <i className="fa-solid fa-square-terminal text-lg mb-1"></i> Dashboard
        </Link>
        <Link href="/admin/components" className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-medium transition-colors ${pathname === '/admin/components' ? 'text-[#0066FF] bg-[#0066FF]/5' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
          <i className="fa-solid fa-microchip text-lg mb-1"></i> Linh kiện
        </Link>
        <Link href="/admin/terms" className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-medium transition-colors ${pathname === '/admin/terms' ? 'text-[#0066FF] bg-[#0066FF]/5' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
          <i className="fa-solid fa-book-journal-whills text-lg mb-1"></i> Thuật ngữ
        </Link>
        <Link href="/admin/users" className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-medium transition-colors ${pathname === '/admin/users' ? 'text-[#0066FF] bg-[#0066FF]/5' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
          <i className="fa-solid fa-users text-lg mb-1"></i> User
        </Link>
      </nav>
    </div>
  );
}
