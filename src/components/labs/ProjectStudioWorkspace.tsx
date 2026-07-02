'use client';

import React, { useState } from 'react';
import { useBOMStore, type BOMItem } from '@/store/useBOMStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface AIResponse {
  compatibility_analysis: string;
  wiring_diagram: string;
  sample_code: string;
}

export default function ProjectStudioWorkspace() {
  // router is not used currently
  const cartItems = useBOMStore(state => state.items);
  const addItem = useBOMStore(state => state.addItem);
  const removeStoreItem = useBOMStore(state => state.removeItem);
  const updateStoreQuantity = useBOMStore(state => state.updateQuantity);
  const { currentProjectId, setCurrentProjectId } = useBOMStore();
  const [sessionProjectItems, setSessionProjectItems] = useState<BOMItem[]>([]);
  const projectItems = currentProjectId ? sessionProjectItems : cartItems;
  const [projectIdea, setProjectIdea] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'wiring' | 'code' | 'buy'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedHash, setLastAnalyzedHash] = useState<string>('');

  React.useEffect(() => {
    let active = true;
    if (currentProjectId) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/project-sessions?id=${currentProjectId}`);
          const data = res.ok ? await res.json() : null;
          if (active && data) {
            setSessionProjectItems(data.items || []);
            setProjectIdea(data.idea || '');
            setResult(data.result || null);
            setActiveTab('overview');
            setLastAnalyzedHash(JSON.stringify(data.items || []) + '|' + (data.idea || ''));
          }
        } finally {
          if (active) setIsLoading(false);
        }
      };
      loadData();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(null);
      setProjectIdea('');
      setSessionProjectItems([]);
      setLastAnalyzedHash('');
    }
    return () => { active = false; };
  }, [currentProjectId]);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (!currentProjectId) {
      updateStoreQuantity(id, newQuantity);
    } else {
      setSessionProjectItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
  };

  const handleRemoveItem = (id: string) => {
    if (!currentProjectId) {
      removeStoreItem(id);
    } else {
      setSessionProjectItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAnalyze = async () => {
    if (projectItems.length === 0) {
      setError('Vui lòng thêm linh kiện vào dự án trước khi phân tích.');
      return;
    }

    const currentHash = JSON.stringify(projectItems) + '|' + projectIdea;
    if (currentHash === lastAnalyzedHash && result) {
      alert("Dữ liệu không thay đổi. Vui lòng thêm linh kiện hoặc sửa ý tưởng để phân tích lại!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/project-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bomItems: projectItems, projectIdea }),
      });

      if (!res.ok) {
         if (res.status === 429) throw new Error('Hệ thống AI đang quá tải. Vui lòng thử lại sau giây lát!');
         throw new Error('Có lỗi xảy ra khi kết nối với AI.');
      }

      const data = await res.json();
      setResult(data);
      setActiveTab('overview');
      setLastAnalyzedHash(currentHash);

      const sessionTitle = `Dự án: ${projectIdea || projectItems.map(i => i.name).join(', ')}`.substring(0, 40);
      const saveRes = await fetch('/api/project-sessions', {
        method: currentProjectId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           id: currentProjectId,
           title: sessionTitle,
           items: projectItems, 
           idea: projectIdea, 
           result: data 
        }),
      });
      if (saveRes.ok) {
          if (!currentProjectId) {
             const savedSession = await saveRes.json();
             setCurrentProjectId(savedSession.id);
          }
          window.dispatchEvent(new Event('reloadSessions'));
      }
    } catch (err) {
      setError((err as Error).message || 'Lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match) {
      return (
        <SyntaxHighlighter
          style={vscDarkPlus as Record<string, unknown>}
          language={match[1]}
          PreTag="div"
          className="rounded-xl !bg-[#1E1E1E] my-4 text-sm font-mono custom-scrollbar"
          showLineNumbers={true}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    }
    return <code className={`${className} bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400 text-sm font-mono`} {...props}>{children}</code>;
  };
  return (
    <div className="flex-1 flex flex-col w-full h-full bg-white dark:bg-[#0A0A0A] overflow-hidden text-slate-700 dark:text-slate-300 font-sans relative z-10">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Explorer */}
        <div className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050505] flex flex-col flex-shrink-0">
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-100/50 dark:bg-[#0A0A0A]">
            <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              BOM Explorer
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                {projectItems.length}
              </span>
              <button
                onClick={() => {
                  const header = ['ID,Tên Linh Kiện,Danh Mục,Số Lượng'];
                  const rows = projectItems.map(item => `${item.id},"${item.name}","${item.category}",${item.quantity}`);
                  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + header.concat(rows).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "bom_export.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="text-slate-400 hover:text-green-500 transition-colors"
                title="Export BOM (CSV)"
              >
                <i className="fa-solid fa-file-csv"></i>
              </button>
              {currentProjectId && (
                <button 
                  onClick={() => {
                     // eslint-disable-next-line @typescript-eslint/no-unused-vars
                     projectItems.forEach(({ quantity, ...rest }) => addItem(rest));
                     alert("Đã thêm toàn bộ linh kiện của dự án này vào Giỏ hàng hiện tại!");
                  }}
                  className="text-slate-400 hover:text-cyan-500 transition-colors"
                  title="Copy to Cart"
                >
                  <i className="fa-solid fa-clone"></i>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            {projectItems.map(item => (
              <div key={item.id} className="relative flex items-center gap-2 px-4 py-1.5 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 cursor-default group transition-colors">
                <i className="fa-solid fa-microchip text-cyan-600/70 dark:text-cyan-500/70 text-[10px] w-3"></i>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate flex-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" title={item.name}>
                  {item.name}
                </span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="text-[10px] w-4 h-4 flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300">-</button>
                  <span className="text-[10px] text-slate-500 font-mono w-3 text-center">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-[10px] w-4 h-4 flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300">+</button>
                  <button onClick={() => handleRemoveItem(item.id)} className="text-[10px] w-4 h-4 flex items-center justify-center ml-1 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <span className="text-[10px] text-slate-400 font-mono opacity-100 group-hover:opacity-0 transition-opacity absolute right-4">
                  x{item.quantity}
                </span>
              </div>
            ))}
            {projectItems.length === 0 && (
              <p className="text-[10px] text-slate-500 italic px-4 mt-2">No components found.</p>
            )}

            <div className="mt-4 border-t border-slate-200 dark:border-slate-800">
               <div className="px-4 py-2 bg-slate-100/50 dark:bg-[#0A0A0A] border-b border-slate-200 dark:border-slate-800">
                 <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                   Project Context
                 </h3>
               </div>
               <div className="p-2">
                 <textarea
                   value={projectIdea}
                   onChange={(e) => setProjectIdea(e.target.value)}
                   placeholder="Describe your idea or technical constraints..."
                   className="w-full h-32 bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-cyan-500/50 rounded p-2 text-[11px] font-mono text-slate-700 dark:text-slate-300 focus:outline-none resize-none custom-scrollbar transition-colors"
                 />
               </div>
               {error && <p className="text-red-500 dark:text-red-400 text-[10px] px-4 pb-2 font-mono truncate" title={error}>{error}</p>}
            </div>
          </div>

          <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-[#0A0A0A]">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || projectItems.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded py-2 font-bold tracking-wider text-[10px] transition-colors disabled:opacity-50 uppercase shadow-sm"
            >
              {isLoading ? (
                <><i className="fa-solid fa-spinner animate-spin"></i> Processing...</>
              ) : (
                <><i className="fa-solid fa-play"></i> {result ? 'Re-Run Analysis' : 'Run Analysis'}</>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0A0A0A] relative">
          {!result && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-50/50 dark:from-cyan-900/10 via-slate-50 dark:via-[#0A0A0A] to-slate-50 dark:to-[#0A0A0A]">
              <i className="fa-solid fa-code text-cyan-500/30 dark:text-cyan-500/10 text-6xl mb-6"></i>
              <h3 className="text-sm font-mono text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-3">Workspace Ready</h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-mono max-w-sm leading-relaxed">
                Add components to the BOM Explorer and press <span className="text-cyan-600 dark:text-cyan-400">Run Analysis</span> to generate schematics and code.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm z-10 font-mono">
              <div className="text-cyan-500 flex gap-2 text-xl mb-4">
                <i className="fa-solid fa-terminal animate-pulse"></i>
              </div>
              <p className="text-cyan-600 dark:text-cyan-400 text-xs">
                Analyzing hardware compatibility...<span className="animate-ping">_</span>
              </p>
            </div>
          )}

          {result && !isLoading && (
            <>
              {/* Tabs Header (VS Code Style) */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050505] overflow-x-auto custom-scrollbar flex-shrink-0 items-center justify-between">
                <div className="flex">
                  {[
                    { id: 'overview', icon: 'fa-info-circle', label: 'readme.md' },
                    { id: 'wiring', icon: 'fa-project-diagram', label: 'wiring.txt' },
                    { id: 'code', icon: 'fa-code', label: 'main.cpp' },
                    { id: 'buy', icon: 'fa-cart-plus', label: 'shopping_list.json' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'overview' | 'wiring' | 'code' | 'buy')}
                      className={`px-4 py-2.5 font-mono text-[11px] tracking-wide transition-colors border-t-2 border-r border-r-slate-200 dark:border-r-slate-800 flex items-center gap-2 whitespace-nowrap ${
                        activeTab === tab.id 
                          ? 'border-t-cyan-500 text-cyan-600 dark:text-cyan-400 bg-white dark:bg-[#0A0A0A]' 
                          : 'border-t-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-50 dark:bg-[#050505]'
                      }`}
                    >
                      <i className={`fa-solid ${tab.icon} ${activeTab === tab.id ? 'text-cyan-500' : ''}`}></i> {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pr-4">
                  <button 
                    onClick={async () => {
                        const { jsPDF } = await import('jspdf');
                        const html2canvas = (await import('html2canvas')).default;
                        const element = document.getElementById('project-studio-content');
                        if (!element) return;
                        const canvas = await html2canvas(element, { scale: 2 });
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        pdf.save('project-studio-report.pdf');
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-file-pdf"></i> Export PDF
                  </button>
                  <button 
                    onClick={async () => {
                        const title = prompt('Nhập tên cho Dự án này:');
                        if (!title) return;
                        const supabase = (await import('@/lib/supabase/client')).createClient();
                        const { data: { user } } = await supabase.auth.getUser();
                        if (!user) { alert('Bạn cần đăng nhập để Publish dự án!'); return; }
                        const { error } = await supabase.from('public_projects').insert([{
                            title,
                            description: projectIdea || 'Không có mô tả',
                            bom_data: projectItems,
                            diagram_code: result?.wiring_diagram || '',
                            user_id: user.id
                        }]);
                        if (error) alert('Lỗi: ' + error.message);
                        else alert('Publish thành công! Mọi người có thể xem dự án này trong Thư Viện Cộng Đồng.');
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-cloud-arrow-up"></i> Publish to Community
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div id="project-studio-content" className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white dark:bg-[#0A0A0A] text-slate-800 dark:text-slate-200">
                {activeTab === 'overview' && (
                  <div className="max-w-4xl mx-auto prose prose-sm dark:prose-invert prose-headings:text-cyan-600 dark:prose-headings:text-cyan-400 prose-headings:font-bold prose-headings:font-mono prose-a:text-cyan-600 dark:prose-a:text-cyan-400">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
                      {result.compatibility_analysis}
                    </ReactMarkdown>
                  </div>
                )}
                
                {activeTab === 'wiring' && (
                  <div className="max-w-4xl mx-auto flex flex-col space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-cyan-600 dark:text-cyan-400 font-bold font-mono text-sm flex items-center gap-2">
                        <i className="fa-solid fa-link"></i> wiring.txt
                      </h3>
                    </div>
                    
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 text-amber-700 dark:text-amber-500/90 text-xs font-mono flex gap-3">
                      <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
                      <div className="leading-relaxed">
                        Nội dung do AI tạo tự động. Kiểm tra kỹ trước khi triển khai thực tế.
                      </div>
                    </div>
                    
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-table:border-slate-200 dark:prose-table:border-slate-800 prose-th:text-slate-500 dark:prose-th:text-slate-400 prose-th:font-mono prose-th:text-xs prose-td:border-slate-200 dark:prose-td:border-slate-800/50 prose-tr:border-b-slate-200 dark:prose-tr:border-b-slate-800">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
                        {result.wiring_diagram}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div className="max-w-4xl mx-auto prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
                      {result.sample_code}
                    </ReactMarkdown>
                  </div>
                )}

                {activeTab === 'buy' && (
                  <div className="max-w-4xl mx-auto space-y-2">
                    <h3 className="text-cyan-600 dark:text-cyan-400 font-bold font-mono text-sm mb-6 flex items-center gap-2">
                      <i className="fa-solid fa-cart-shopping"></i> shopping_list.json
                    </h3>
                    {projectItems.map(item => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-50 dark:bg-[#111111] p-3 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1 border border-slate-200 dark:border-none shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {item.image_url ? <img src={item.image_url} alt={item.name} className="object-contain w-full h-full" /> : <i className="fa-solid fa-microchip text-slate-400 text-lg"></i>}
                          </div>
                          <div>
                            <h4 className="font-mono font-bold text-slate-900 dark:text-slate-200 text-xs">{item.name}</h4>
                            <p className="text-[10px] font-mono text-slate-500 mt-1">QTY: <span className="text-cyan-600 dark:text-cyan-400 font-bold">{item.quantity}</span></p>
                          </div>
                        </div>
                        {item.shopee_link ? (
                          <a href={item.shopee_link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-500 px-4 py-1.5 rounded text-[10px] font-bold font-mono transition-all">
                            <i className="fa-solid fa-link"></i> SHOPEE LINK
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded self-start sm:self-auto">
                            NO_LINK_FOUND
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
