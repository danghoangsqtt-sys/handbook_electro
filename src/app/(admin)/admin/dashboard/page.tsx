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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Tổng quan hệ thống</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tổng Linh kiện</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.components}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-microchip text-xl"></i>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link href="/admin/components" className="text-sm text-blue-600 hover:underline">Quản lý chi tiết &rarr;</Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tổng Thuật ngữ</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.terms}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-book text-xl"></i>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link href="/admin/terms" className="text-sm text-blue-600 hover:underline">Quản lý chi tiết &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
