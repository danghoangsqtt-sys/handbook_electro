/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ComponentFormModal from '@/components/admin/ComponentFormModal';

export default function AdminComponents() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [components, setComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingComponent, setEditingComponent] = useState<any | null>(null);
  
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = Array.from(new Set(components.map(item => item.category))).filter(Boolean);

  const fetchComponents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('components').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setComponents(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComponents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa linh kiện này? Hành động này không thể hoàn tác.')) return;
    
    await supabase.from('components').delete().eq('id', id);
    fetchComponents();
  };

  const openNewForm = () => {
    setEditingComponent(null);
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditForm = (component: any) => {
    setEditingComponent(component);
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

  const filteredComponents = components.filter(item => {
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    if (!matchesCategory) return false;

    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  });

  const sortedComponents = [...filteredComponents].sort((a, b) => {
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
          <h1 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Linh Kiện</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Quản lý cơ sở dữ liệu linh kiện điện tử.</p>
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
              placeholder="Tìm linh kiện..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] dark:focus:border-[#0066FF] outline-none text-xs md:text-sm w-full sm:w-56 transition-colors rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>
          <button 
            onClick={openNewForm}
            className="bg-[#0066FF] text-white hover:bg-[#0055DD] px-3 py-2.5 md:px-4 md:py-3 font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group whitespace-nowrap shrink-0"
          >
            <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i> <span className="hidden sm:inline">Thêm mới</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#050505] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 hidden md:table">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800 text-xs">
              <tr>
                <th className="px-6 py-4">Hình ảnh</th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#0066FF] transition-colors" onClick={() => handleSort('name')}>
                  Tên linh kiện {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
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
              ) : components.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#888] font-medium text-xs border-b border-slate-200 dark:border-slate-800">
                    Chưa có linh kiện nào.
                  </td>
                </tr>
              ) : (
                sortedComponents.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-10 h-10 object-contain bg-white dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 rounded-lg group-hover:border-[#0066FF]/50 transition-colors" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-[#444] group-hover:border-[#0066FF]/50 transition-colors">
                          <i className="fa-solid fa-image"></i>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">{item.name}</td>
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
          ) : components.length === 0 ? (
            <div className="py-10 text-center text-slate-500 font-medium text-[10px] border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
              Chưa có linh kiện nào.
            </div>
          ) : (
            sortedComponents.map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 flex items-center rounded-xl shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0066FF]"></div>
                
                <div className="flex gap-3 items-center pl-1.5 w-full">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-contain bg-slate-50 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#444] shrink-0">
                      <i className="fa-solid fa-image text-lg"></i>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-200 text-sm truncate mb-1">{item.name}</h3>
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

      <ComponentFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingComponent}
        onSaved={() => {
          setIsModalOpen(false);
          fetchComponents();
        }}
      />
    </div>
  );
}
