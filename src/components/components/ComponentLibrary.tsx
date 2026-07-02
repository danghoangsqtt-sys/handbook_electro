'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ComponentCard from '@/components/ComponentCard';

export default function ComponentLibrary() {
  const [components, setComponents] = useState<{ id: string; name: string; category?: string; interface?: string; specs?: Record<string, unknown>; image_url?: string; description?: string; shopee_link?: string; datasheet_url?: string; is_active?: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedInterfaces, setSelectedInterfaces] = useState<string[]>([]);

  useEffect(() => {
    const fetchComponents = async () => {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching components:', error);
      } else {
        setComponents(data || []);
      }
      setIsLoading(false);
    };

    fetchComponents();
  }, []);

  const categories = ['Tất cả', 'MCU', 'Sensor', 'Display', 'Module'];
  const interfaces = ['I2C', 'SPI', 'UART', 'Digital', 'Analog', 'Wi-Fi', 'Bluetooth'];

  const handleInterfaceToggle = (iface: string) => {
    setSelectedInterfaces(prev => 
      prev.includes(iface) 
        ? prev.filter(i => i !== iface)
        : [...prev, iface]
    );
  };

  // Lọc dữ liệu
  const filteredComponents = components.filter(comp => {
    // Lọc theo search query (tên hoặc mô tả)
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (comp.description && comp.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Lọc theo danh mục
    const matchesCategory = selectedCategory === 'Tất cả' || comp.category === selectedCategory;
    
    // Lọc theo giao tiếp (nếu có chọn bất kỳ giao tiếp nào)
    const matchesInterface = selectedInterfaces.length === 0 || 
      selectedInterfaces.some(iface => comp.interface && comp.interface.includes(iface));

    return matchesSearch && matchesCategory && matchesInterface;
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full relative">
      {/* Sidebar Backdrop for Mobile */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsFilterOpen(false)}></div>
      )}

      {/* Sidebar Filters */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm transform transition-transform duration-300 ease-in-out md:relative md:z-0 md:transform-none md:w-64 flex-shrink-0 flex flex-col bg-white dark:bg-slate-900 md:bg-transparent md:dark:bg-transparent shadow-2xl md:shadow-none border-r border-slate-200 dark:border-slate-800 md:border-none ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5 md:p-0 h-full overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between md:hidden mb-6">
             <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
               <i className="fa-solid fa-filter text-blue-500"></i> Bộ lọc
             </h2>
             <button onClick={() => setIsFilterOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors">
               <i className="fa-solid fa-xmark"></i>
             </button>
          </div>
          <div className="md:bg-white md:dark:bg-slate-900 md:rounded-xl md:p-5 md:border md:border-slate-200 md:dark:border-slate-800 md:shadow-sm">
            <h2 className="hidden md:flex font-bold text-lg text-slate-900 dark:text-white mb-4 items-center gap-2">
              <i className="fa-solid fa-filter text-blue-500"></i> Bộ lọc
            </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Danh mục</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat} 
                        className="text-blue-600 focus:ring-blue-500 rounded-full" 
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                      />
                      {cat}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            
            <hr className="border-slate-200 dark:border-slate-700" />
            
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Giao tiếp (Interface)</h3>
              <ul className="space-y-2">
                {interfaces.map((iface) => (
                  <li key={iface}>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <input 
                        type="checkbox" 
                        className="text-blue-600 focus:ring-blue-500 rounded" 
                        checked={selectedInterfaces.includes(iface)}
                        onChange={() => handleInterfaceToggle(iface)}
                      />
                      {iface}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-4 mb-6 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-microchip text-blue-600"></i>
              Thư viện Linh kiện
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tra cứu linh kiện và thêm vào dự án nghiên cứu của bạn.
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input 
                type="text" 
                placeholder="Tìm kiếm linh kiện..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white shadow-sm transition-shadow focus:shadow-blue-500/20"
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
            <button onClick={() => setIsFilterOpen(true)} className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 flex-shrink-0 transition-colors">
              <i className="fa-solid fa-filter"></i>
            </button>
          </div>
        </div>

        {/* Components Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <i className="fa-solid fa-spinner animate-spin text-3xl"></i>
          </div>
        ) : components.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
            <i className="fa-solid fa-box-open text-4xl text-slate-300 mb-4"></i>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Chưa có dữ liệu linh kiện</h3>
            <p className="text-slate-500 dark:text-slate-400">Vui lòng chạy script CSDL hoặc thêm dữ liệu vào bảng components trên Supabase.</p>
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <i className="fa-solid fa-search text-4xl text-slate-300 mb-4"></i>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Không tìm thấy linh kiện nào</h3>
            <p className="text-slate-500 dark:text-slate-400">Vui lòng thử từ khóa khác hoặc xóa bớt bộ lọc.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('Tất cả'); setSelectedInterfaces([]); }}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredComponents.filter(comp => comp.is_active !== false).map((comp) => (
              <ComponentCard 
                key={comp.id}
                id={comp.id}
                name={comp.name}
                category={comp.category || 'Chưa phân loại'}
                interface_type={comp.interface}
                specs={(comp.specs as Record<string, string | number | boolean>) || {}}
                image_url={comp.image_url || null}
                description={comp.description || ''}
                shopee_link={comp.shopee_link}
                datasheet_url={comp.datasheet_url}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
