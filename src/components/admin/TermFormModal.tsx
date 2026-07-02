import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TermFormModal({ 
  isOpen, 
  onClose, 
  onSaved, 
  initialData 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSaved: () => void; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any 
}) {
  const [formData, setFormData] = useState({
    term: '',
    fullName: '',
    category: 'Tự động hóa',
    definition: '',
    applications: '[]',
    tags: '[]',
    youtubeUrl: '',
    icon: '',
    is_active: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const CATEGORIES = ["Tự động hóa", "Cơ điện tử", "Khoa học máy tính", "Vi xử lý", "Điện tử số", "IoT", "Vô tuyến & Viễn thông"];

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...initialData,
        fullName: initialData.fullName || '',
        youtubeUrl: initialData.youtubeUrl || '',
        icon: initialData.icon || '',
        applications: JSON.stringify(initialData.applications || [], null, 2),
        tags: JSON.stringify(initialData.tags || [], null, 2)
      });
    } else {
      setFormData({
        term: '',
        fullName: '',
        category: 'Tự động hóa',
        definition: '',
        applications: '[\n  "Ứng dụng 1"\n]',
        tags: '[]',
        youtubeUrl: '',
        icon: '',
        is_active: true
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      let parsedApplications = [];
      try {
        parsedApplications = JSON.parse(formData.applications);
      } catch {
        throw new Error('Applications JSON không hợp lệ.');
      }

      let parsedTags = [];
      try {
        parsedTags = JSON.parse(formData.tags);
      } catch {
        throw new Error('Tags JSON không hợp lệ.');
      }

      const payload = {
        term: formData.term,
        fullName: formData.fullName,
        category: formData.category,
        definition: formData.definition,
        applications: parsedApplications,
        tags: parsedTags,
        youtubeUrl: formData.youtubeUrl,
        icon: formData.icon,
        is_active: formData.is_active
      };

      if (initialData?.id) {
        const { error: updateError } = await supabase.from('terms').update(payload).eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('terms').insert([payload]);
        if (insertError) throw insertError;
      }

      onSaved();
    } catch (err) {
      setError((err as Error).message || 'Có lỗi xảy ra khi lưu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {initialData ? 'Sửa Thuật ngữ' : 'Thêm Thuật ngữ Mới'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar text-slate-900 dark:text-slate-100">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thuật ngữ (Viết tắt) *</label>
              <input required value={formData.term} onChange={e => setFormData({...formData, term: e.target.value})} placeholder="VD: ADC" className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Danh mục *</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên đầy đủ</label>
            <input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="VD: Analog-to-Digital Converter" className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Định nghĩa *</label>
            <textarea required value={formData.definition} onChange={e => setFormData({...formData, definition: e.target.value})} rows={3} className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link Youtube (Tùy chọn)</label>
              <input value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Icon FontAwesome</label>
              <input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="VD: fa-solid fa-microchip" className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ứng dụng (JSON Array)</label>
              <textarea value={formData.applications} onChange={e => setFormData({...formData, applications: e.target.value})} rows={4} className="w-full font-mono border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (JSON Array)</label>
              <textarea value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} rows={4} className="w-full font-mono border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActiveTerm" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="isActiveTerm" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Kích hoạt hiển thị</label>
          </div>

        </form>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors">Hủy</button>
          <button onClick={handleSubmit} disabled={isSaving} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors disabled:opacity-50">
            {isSaving ? 'Đang lưu...' : 'Lưu dữ liệu'}
          </button>
        </div>
      </div>
    </div>
  );
}
