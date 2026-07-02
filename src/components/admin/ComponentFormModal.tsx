import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Helper to extract File ID from various GDrive links
function getGDriveDirectLink(url: string) {
  if (!url) return '';
  if (url.includes('drive.google.com/uc')) return url;
  
  let fileId = '';
  // match /d/FILE_ID/
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    fileId = match[1];
  } else {
    // match id=FILE_ID
    const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
  }
  
  if (fileId) {
    // lh3.googleusercontent.com/d/FILE_ID is the most reliable way to hotlink GDrive images in 2024+
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
}

export default function ComponentFormModal({ 
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
    name: '',
    category: 'MCU',
    interface: '',
    description: '',
    image_url: '',
    datasheet_url: '',
    shopee_link: '',
    specs: '{}',
    is_active: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...initialData,
        specs: JSON.stringify(initialData.specs || {}, null, 2)
      });
    } else {
      setFormData({
        name: '',
        category: 'MCU',
        interface: '',
        description: '',
        image_url: '',
        datasheet_url: '',
        shopee_link: '',
        specs: '{\n  "vcc": "3.3V"\n}',
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
      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(formData.specs);
      } catch {
        throw new Error('Specs JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.');
      }

      // Convert GDrive links
      const finalImageUrl = getGDriveDirectLink(formData.image_url);

      const payload = {
        name: formData.name,
        category: formData.category,
        interface: formData.interface,
        description: formData.description,
        image_url: finalImageUrl,
        datasheet_url: formData.datasheet_url,
        shopee_link: formData.shopee_link,
        specs: parsedSpecs,
        is_active: formData.is_active
      };

      if (initialData?.id) {
        const { error: updateError } = await supabase.from('components').update(payload).eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('components').insert([payload]);
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
            {initialData ? 'Sửa Linh kiện' : 'Thêm Linh kiện Mới'}
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên linh kiện *</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Danh mục *</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="MCU">MCU</option>
                <option value="Sensor">Sensor</option>
                <option value="Display">Display</option>
                <option value="Module">Module</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giao tiếp (Interface)</label>
            <input value={formData.interface} onChange={e => setFormData({...formData, interface: e.target.value})} placeholder="VD: I2C, SPI, Wi-Fi" className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả ngắn</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hình ảnh (URL)</label>
              <input 
                value={formData.image_url} 
                onChange={e => setFormData({...formData, image_url: e.target.value})} 
                onBlur={e => {
                  const directLink = getGDriveDirectLink(e.target.value);
                  if (directLink !== e.target.value) {
                    setFormData({...formData, image_url: directLink});
                  }
                }}
                placeholder="https://... Tự động nhận diện link Google Drive" 
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link Datasheet PDF</label>
              <input value={formData.datasheet_url} onChange={e => setFormData({...formData, datasheet_url: e.target.value})} placeholder="Dán link share GDrive..." className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link Shopee Affiliate <i className="fa-solid fa-cart-shopping text-orange-500"></i></label>
            <input value={formData.shopee_link} onChange={e => setFormData({...formData, shopee_link: e.target.value})} placeholder="https://shope.ee/..." className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thông số kỹ thuật (JSON Format)</label>
            <textarea value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} rows={4} className="w-full font-mono border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Hiển thị linh kiện này</label>
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
