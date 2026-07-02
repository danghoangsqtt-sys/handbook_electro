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
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">TechDict Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/dashboard' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            <i className="fa-solid fa-chart-line w-5"></i> Dashboard
          </Link>
          <Link href="/admin/components" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/components' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            <i className="fa-solid fa-microchip w-5"></i> Quản lý Linh kiện
          </Link>
          <Link href="/admin/terms" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/terms' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            <i className="fa-solid fa-book w-5"></i> Quản lý Thuật ngữ
          </Link>
          <Link href="/admin/users" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/users' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            <i className="fa-solid fa-users w-5"></i> Quản lý Người dùng
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-sm font-semibold">
            <i className="fa-solid fa-right-from-bracket w-5"></i> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
          <h2 className="font-semibold text-lg">{pathname === '/admin/dashboard' ? 'Dashboard' : pathname === '/admin/components' ? 'Quản lý Linh kiện' : pathname === '/admin/users' ? 'Quản lý Người dùng' : 'Quản lý Thuật ngữ'}</h2>
          <Link href="/" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium">
            Xem trang chủ <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
