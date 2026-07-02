'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Determine current theme based on tailwind dark mode class
    const isDark = document.documentElement.classList.contains('dark');
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'var(--font-sans)',
    });

    const renderDiagram = async () => {
      try {
        if (!chart) return;
        
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        setError('Sơ đồ cấu trúc bị lỗi hoặc không được hỗ trợ.');
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm flex items-center gap-3">
        <i className="fa-solid fa-circle-exclamation text-xl"></i>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="mermaid-container overflow-x-auto p-4 flex justify-center items-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
