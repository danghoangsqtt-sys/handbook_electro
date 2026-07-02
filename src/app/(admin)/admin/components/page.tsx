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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quản lý Linh kiện</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Thêm, sửa, xóa các linh kiện điện tử trong thư viện.</p>
        </div>
        <button 
          onClick={openNewForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> Thêm Linh kiện
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Hình ảnh</th>
                <th className="px-6 py-4">Tên linh kiện</th>
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
              ) : components.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Chưa có linh kiện nào. Hãy thêm mới!
                  </td>
                </tr>
              ) : (
                components.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-12 h-12 object-contain bg-white rounded border border-slate-200" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-slate-400">
                          <i className="fa-solid fa-image"></i>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
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
