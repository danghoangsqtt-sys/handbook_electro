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

  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = Array.from(new Set(terms.map(item => item.category))).filter(Boolean);

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTerms = terms.filter(item => {
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    if (!matchesCategory) return false;

    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.term && item.term.toLowerCase().includes(query)) ||
      (item.fullName && item.fullName.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  });

  const sortedTerms = [...filteredTerms].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 md:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#0066FF] rounded-l-2xl"></div>
        <div className="pl-2 md:pl-4">
          <h1 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Thuật ngữ</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Quản lý các thuật ngữ bách khoa.</p>
        </div>
        <div className="flex gap-2.5 w-full md:w-auto">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] dark:focus:border-[#0066FF] outline-none text-xs md:text-sm w-24 sm:w-40 transition-colors rounded-xl text-slate-800 dark:text-slate-200 shrink-0"
          >
            <option value="ALL">Tất cả</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat as string}>{cat as string}</option>
            ))}
          </select>
          <div className="relative flex-1 sm:flex-none">
            <i className="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs md:text-sm"></i>
            <input 
              type="text" 
              placeholder="Tìm thuật ngữ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] dark:focus:border-[#0066FF] outline-none text-xs md:text-sm w-full sm:w-56 transition-colors rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={handleImport}
              disabled={isImporting}
              className="bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-2.5 md:px-4 md:py-3 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              <i className={`fa-solid fa-cloud-arrow-up ${isImporting ? 'animate-bounce' : ''}`}></i> <span className="hidden sm:inline">{isImporting ? 'Đang Import...' : 'Import'}</span>
            </button>
            <button 
              onClick={openNewForm}
              className="bg-[#0066FF] text-white hover:bg-[#0055DD] px-3 py-2.5 md:px-4 md:py-3 font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i> <span className="hidden sm:inline">Thêm mới</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#050505] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 hidden md:table">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800 text-xs">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-[#0066FF] transition-colors" onClick={() => handleSort('term')}>
                  Thuật ngữ {sortField === 'term' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#0066FF] transition-colors" onClick={() => handleSort('fullName')}>
                  Tên đầy đủ {sortField === 'fullName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#0066FF] transition-colors" onClick={() => handleSort('category')}>
                  Danh mục {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-[#0066FF] transition-colors" onClick={() => handleSort('is_active')}>
                  Trạng thái {sortField === 'is_active' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center border-b border-slate-200 dark:border-slate-800">
                    <i className="fa-solid fa-spinner animate-spin text-2xl text-[#0066FF] mb-2"></i>
                    <p className="text-[#888] mt-2 font-medium text-xs">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : terms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#888] font-medium text-xs border-b border-slate-200 dark:border-slate-800">
                    Chưa có thuật ngữ nào.
                  </td>
                </tr>
              ) : (
                sortedTerms.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">{item.term}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{item.fullName || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-[#AAA] border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-[9px] uppercase font-semibold rounded-md">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.is_active !== false ? (
                        <span className="text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-2.5 py-1 text-[9px] uppercase font-semibold rounded-md shadow-[0_0_5px_rgba(57,255,20,0.1)]">HIỂN THỊ</span>
                      ) : (
                        <span className="text-slate-500 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-[9px] uppercase font-semibold rounded-md">ĐÃ ẨN</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditForm(item)} className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[#0066FF] hover:bg-[#0066FF]/10 hover:border-[#0066FF]/50 flex items-center justify-center transition-all">
                          <i className="fa-solid fa-pen text-[10px]"></i>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[#FF003C] hover:bg-[#FF003C]/10 hover:border-[#FF003C]/50 flex items-center justify-center transition-all">
                          <i className="fa-solid fa-trash text-[10px]"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-3 p-3 bg-slate-50/50 dark:bg-[#050505]">
          {isLoading ? (
            <div className="py-10 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
              <i className="fa-solid fa-spinner animate-spin text-xl text-[#0066FF] mb-2"></i>
              <p className="text-slate-500 mt-2 font-medium text-[10px]">Đang tải dữ liệu...</p>
            </div>
          ) : terms.length === 0 ? (
            <div className="py-10 text-center text-slate-500 font-medium text-[10px] border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
              Chưa có thuật ngữ nào.
            </div>
          ) : (
            sortedTerms.map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 flex items-center rounded-xl shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0066FF]"></div>
                
                <div className="flex gap-3 items-center pl-1.5 w-full">
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-200 text-sm truncate mb-0.5">{item.term}</h3>
                    <p className="text-slate-500 text-[10px] md:text-xs truncate mb-1">{item.fullName || '-'}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-[#AAA] border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 text-[9px] uppercase font-semibold rounded whitespace-nowrap">
                        {item.category}
                      </span>
                      {item.is_active !== false ? (
                        <span className="text-[#39FF14] text-[9px] uppercase font-semibold whitespace-nowrap"><i className="fa-solid fa-circle text-[6px] mr-1"></i> Hiển thị</span>
                      ) : (
                        <span className="text-slate-500 text-[9px] uppercase font-semibold whitespace-nowrap"><i className="fa-solid fa-circle text-[6px] mr-1"></i> Đã ẩn</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 shrink-0 ml-2">
                    <button onClick={() => openEditForm(item)} className="w-7 h-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[#0066FF] rounded-md flex items-center justify-center transition-all hover:bg-[#0066FF]/10 hover:border-[#0066FF]/30">
                      <i className="fa-solid fa-pen text-[10px]"></i>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[#FF003C] rounded-md flex items-center justify-center transition-all hover:bg-[#FF003C]/10 hover:border-[#FF003C]/30">
                      <i className="fa-solid fa-trash text-[10px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
