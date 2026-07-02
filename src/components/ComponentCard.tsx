/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useBOMStore } from '@/store/useBOMStore';

const getValidUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

interface Specs {
  [key: string]: string | number | boolean;
}

interface ComponentCardProps {
  id: string;
  name: string;
  category: string;
  interface_type?: string;
  specs: Specs;
  image_url: string | null;
  description: string;
  shopee_link?: string;
  datasheet_url?: string;
}

export default function ComponentCard({
  id,
  name,
  category,
  interface_type,
  specs,
  image_url,
  description,
  shopee_link,
  datasheet_url
}: ComponentCardProps) {
  const addItem = useBOMStore((state) => state.addItem);

  const handleAddToProject = () => {
    addItem({
      id,
      name,
      image_url,
      category,
      specs,
      shopee_link
    });
    alert(`Đã thêm ${name} vào Giỏ Linh Kiện!`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/80 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full relative group">
      {/* Removed floating Datasheet Action */}

      {/* Image Container */}
      <div className="relative w-full h-28 sm:h-48 bg-slate-50 dark:bg-slate-950/50 flex-shrink-0 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {image_url && (
          <div 
            className="absolute inset-0 opacity-20 dark:opacity-40 blur-xl scale-125 transition-transform duration-500 group-hover:scale-150"
            style={{ backgroundImage: `url(${image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          ></div>
        )}
        
        {image_url ? (
        <img
            src={image_url}
            alt={name}
            className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-normal relative z-10 transition-transform duration-500 group-hover:scale-110 text-[8px] text-slate-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 relative z-10">
            <i className="fa-solid fa-microchip text-4xl mb-2"></i>
            <span className="text-xs">No image</span>
          </div>
        )}
        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-1.5 items-end z-20">
          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[8px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold backdrop-blur-md">
            {category}
          </span>
          {interface_type && (
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[7px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold backdrop-blur-md max-w-[70px] sm:max-w-[100px] truncate text-center">
              {interface_type}
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-2.5 sm:p-5 flex flex-col flex-grow bg-white dark:bg-slate-900 relative z-10">
        <h3 className="font-bold text-[12px] sm:text-base text-slate-900 dark:text-white mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-1 sm:pr-0 leading-tight" title={name}>
          {name}
        </h3>
        
        <p className="hidden sm:block text-slate-500 dark:text-slate-400 text-xs mb-5 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Specs Highlights */}
        {specs && Object.keys(specs).length > 0 && (
          <div className="hidden sm:grid mt-auto mb-5 grid-cols-2 gap-2">
            {Object.entries(specs).slice(0, 4).map(([key, value]) => (
              <div key={key} className="flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 border border-slate-100 dark:border-slate-700/50">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">{key}</span>
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate font-medium" title={String(value)}>{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-1.5 sm:gap-2 pt-1 sm:pt-2">
          {/* Add Button */}
          <button 
            onClick={handleAddToProject}
            className="flex w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all items-center justify-center gap-1.5 sm:gap-2 group/btn"
          >
            <i className="fa-solid fa-plus transition-transform group-hover/btn:rotate-90 text-[10px] sm:text-sm"></i>
            Thêm vào dự án
          </button>
          
          <div className="flex gap-2 w-full">
            {/* Datasheet Button */}
            {datasheet_url && (
              <a 
                href={getValidUrl(datasheet_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 rounded-xl py-2 px-2 font-bold transition-all items-center justify-center gap-1.5 text-[10px] sm:text-xs text-center"
              >
                <i className="fa-solid fa-file-pdf"></i>
                Datasheet
              </a>
            )}

            {/* Shopee Button */}
            {shopee_link && (
              <a 
                href={getValidUrl(shopee_link)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-orange-900/10 border border-slate-200 dark:border-slate-700/80 hover:border-orange-500/50 text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-500 rounded-xl py-2 px-2 font-bold transition-all items-center justify-center gap-1.5 text-[10px] sm:text-xs text-center"
              >
                <i className="fa-solid fa-cart-shopping"></i>
                Shopee
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
