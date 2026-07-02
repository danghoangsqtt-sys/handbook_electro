'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import TermFormModal from '@/components/admin/TermFormModal';

export default function AdminTerms() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [terms, setTerms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingTerm, setEditingTerm] = useState<any | null>(null);

  const fetchTerms = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('terms').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setTerms(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTerms();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thuật ngữ này? Hành động này không thể hoàn tác.')) return;
    
    await supabase.from('terms').delete().eq('id', id);
    fetchTerms();
  };

  const handleImport = async () => {
    if (!confirm('Hành động này sẽ đọc tất cả file JSON cũ và import vào Supabase. Đảm bảo bạn chưa import trước đó để tránh trùng lặp. Tiếp tục?')) return;
    
    setIsImporting(true);
    try {
      const res = await fetch('/api/admin/import-terms', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Import thành công ${data.count} thuật ngữ!`);
        fetchTerms();
      } else {
        alert(`Lỗi import: ${data.message}`);
      }
    } catch {
      alert('Đã xảy ra lỗi khi gọi API import.');
    } finally {
      setIsImporting(false);
    }
  };

  const openNewForm = () => {
    setEditingTerm(null);
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditForm = (term: any) => {
    setEditingTerm(term);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quản lý Thuật ngữ</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Thêm, sửa, xóa các thuật ngữ bách khoa.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleImport}
            disabled={isImporting}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/50 disabled:opacity-50"
          >
            <i className={`fa-solid fa-cloud-arrow-up ${isImporting ? 'animate-bounce' : ''}`}></i> {isImporting ? 'Đang Import...' : 'Import JSON'}
          </button>
          <button 
            onClick={openNewForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Thêm Thuật ngữ
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Thuật ngữ</th>
                <th className="px-6 py-4">Tên đầy đủ</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <i className="fa-solid fa-spinner animate-spin text-2xl text-blue-500 mb-2"></i>
                    <p className="text-slate-500 mt-2">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : terms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Chưa có thuật ngữ nào. Hãy import hoặc thêm mới!
                  </td>
                </tr>
              ) : (
                terms.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{item.term}</td>
                    <td className="px-6 py-4 font-mono text-xs">{item.fullName || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.is_active !== false ? (
                        <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md text-xs font-semibold">Hiển thị</span>
                      ) : (
                        <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-semibold">Đã ẩn</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditForm(item)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 flex items-center justify-center transition-colors">
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 flex items-center justify-center transition-colors">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TermFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingTerm}
        onSaved={() => {
          setIsModalOpen(false);
          fetchTerms();
        }}
      />
    </div>
  );
}
