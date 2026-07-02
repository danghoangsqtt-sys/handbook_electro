'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ components: 0, terms: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // In a real app, this should be a count query, but for simple MVP we fetch everything
      const { count: componentCount } = await supabase.from('components').select('*', { count: 'exact', head: true });
      
      let termCount = 0;
      const { count, error } = await supabase.from('terms').select('*', { count: 'exact', head: true });
      if (!error) {
        termCount = count || 0;
      }
      
      setStats({
        components: componentCount || 0,
        terms: termCount,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-slate-400"><i className="fa-solid fa-spinner animate-spin text-3xl"></i></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 md:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#0066FF] rounded-l-2xl"></div>
        <div className="pl-2 md:pl-4">
          <h1 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">System Overview</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Thống kê tổng quan dữ liệu hệ thống.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Components Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm relative group overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0066FF]/10 text-[#0066FF] rounded-xl flex items-center justify-center shrink-0">
              <i className="fa-solid fa-microchip text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Tổng Linh kiện</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
                {stats.components}
              </h3>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link href="/admin/components" className="text-xs font-medium text-[#0066FF] hover:text-[#0055DD] transition-colors flex items-center justify-between group/link">
              <span>Quản lý chi tiết</span>
              <i className="fa-solid fa-arrow-right group-hover/link:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </div>

        {/* Terms Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm relative group overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#39FF14]/10 text-[#2db30f] dark:text-[#39FF14] rounded-xl flex items-center justify-center shrink-0">
              <i className="fa-solid fa-book-journal-whills text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Tổng Thuật ngữ</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
                {stats.terms}
              </h3>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link href="/admin/terms" className="text-xs font-medium text-[#2db30f] dark:text-[#39FF14] hover:text-[#1f8009] dark:hover:text-[#00F0FF] transition-colors flex items-center justify-between group/link">
              <span>Quản lý chi tiết</span>
              <i className="fa-solid fa-arrow-right group-hover/link:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
