'use client';

import React, { useEffect, useState } from 'react';
import { useBOMStore } from '@/store/useBOMStore';
import Image from 'next/image';


export default function BOMDrawer() {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearBOM, setIsProjectStudioOpen } = useBOMStore();
  
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-200 dark:border-slate-800 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <i className="fa-solid fa-list-check text-blue-600"></i>
            Dự án nghiên cứu
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <i className="fa-solid fa-box-open text-6xl opacity-20"></i>
              <p>Dự án nghiên cứu đang trống</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-blue-600 hover:underline text-sm"
              >
                Tiếp tục tìm linh kiện
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="relative w-16 h-16 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 flex-shrink-0">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      <i className="fa-solid fa-microchip"></i>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={item.name}>
                    {item.name}
                  </h4>
                  
                  <div className="flex items-center gap-3 mt-2">
                    {/* Quantity Control */}
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm transition-colors ml-auto flex items-center gap-1"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0A0A] space-y-3">
            <button 
              className="w-full flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg py-2.5 font-bold tracking-wider text-[11px] transition-colors"
            >
              LƯU DỰ ÁN
            </button>
            <button 
              onClick={() => {
                setIsOpen(false);
                setIsProjectStudioOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 border border-cyan-500/50 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-400 rounded-lg py-2.5 font-bold tracking-wider text-xs transition-colors shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              AI PROJECT STUDIO
            </button>
            <div className="flex gap-3">
              <button 
                className="flex-1 flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg py-2.5 font-bold tracking-wider text-[11px] transition-colors"
              >
                <i className="fa-solid fa-download"></i> EXPORT CSV
              </button>
              <button 
                onClick={clearBOM}
                className="w-11 flex items-center justify-center border border-red-900/30 text-red-500 bg-red-950/10 hover:bg-red-900/20 rounded-lg transition-colors"
                title="Xóa tất cả"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
