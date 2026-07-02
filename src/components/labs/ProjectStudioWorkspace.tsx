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
  const [showPublishModal, setShowPublishModal] = useState(false);

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
    <div className="flex-1 flex flex-col w-full h-full bg-white dark:bg-slate-900 overflow-hidden text-slate-700 dark:text-slate-300 font-sans relative z-10">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Explorer */}
        <div className={`w-full md:w-64 md:h-auto md:max-h-none border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex flex-col flex-shrink-0 ${!result && !isLoading ? 'flex-1' : 'h-[45vh]'}`}>
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-100/50 dark:bg-slate-900">
            <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              Giỏ Linh Kiện
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                {projectItems.length}
              </span>
              <button
                onClick={() => {
                  const date = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  const projectName = projectIdea ? projectIdea.replace(/"/g, '""') : 'Dự án mới';
                  
                  let csvStr = `"BẢNG KÊ LINH KIỆN (BOM) - PROJECT STUDIO"\n`;
                  csvStr += `"Ngày xuất:","${date}"\n`;
                  csvStr += `"Dự án:","${projectName}"\n\n`;
                  
                  csvStr += `"STT","Mã ID","Tên Linh Kiện","Danh Mục","Số Lượng","Đơn Vị","Trạng Thái","Ghi Chú","Link Tham Khảo"\n`;
                  
                  projectItems.forEach((item, index) => {
                    const name = item.name.replace(/"/g, '""');
                    const category = (item.category || '').replace(/"/g, '""');
                    const link = item.shopee_link || '';
                    csvStr += `"${index + 1}","${item.id}","${name}","${category}","${item.quantity}","Cái","[ ] Chưa mua","","${link}"\n`;
                  });
                  
                  csvStr += `\n"Tổng cộng:","${projectItems.length} loại linh kiện"`;
                  
                  const blob = new Blob(["\uFEFF" + csvStr], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `BOM_Export_${date.replace(/\//g, '')}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="text-slate-400 hover:text-green-500 transition-colors"
                title="Xuất Danh Sách (CSV)"
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
              <p className="text-[10px] text-slate-500 italic px-4 mt-2">Chưa có linh kiện nào.</p>
            )}

            <div className="mt-4 border-t border-slate-200 dark:border-slate-800">
               <div className="px-4 py-2 bg-slate-100/50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
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

          <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900">
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
        <div className={`flex-1 flex-col min-w-0 bg-white dark:bg-slate-900 relative overflow-hidden ${!result && !isLoading ? 'hidden md:flex' : 'flex'}`}>
          {!result && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-50/50 dark:from-cyan-900/10 via-slate-50 dark:via-slate-900 to-slate-50 dark:to-slate-900">
              <i className="fa-solid fa-code text-cyan-500/30 dark:text-cyan-500/10 text-6xl mb-4 sm:mb-6 hidden sm:block"></i>
              <h3 className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Workspace Ready</h3>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-mono max-w-sm leading-relaxed">
                Thêm linh kiện vào <span className="text-cyan-600 dark:text-cyan-400">Giỏ Linh Kiện</span> và nhấn <span className="text-cyan-600 dark:text-cyan-400">Run Analysis</span> để tạo sơ đồ mạch.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 font-mono">
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
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-auto custom-scrollbar flex-shrink-0 items-center justify-between">
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
                          ? 'border-t-cyan-500 text-cyan-600 dark:text-cyan-400 bg-white dark:bg-slate-900' 
                          : 'border-t-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-950'
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
                    onClick={() => setShowPublishModal(true)}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-folder-plus"></i> Lưu vào Thư Viện
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div id="project-studio-content" className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
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

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishProjectModal
          projectIdea={projectIdea}
          projectItems={projectItems}
          diagramCode={result?.wiring_diagram || ''}
          onClose={() => setShowPublishModal(false)}
        />
      )}
    </div>
  );
}

/* ================================================================ */
/* PublishProjectModal                                               */
/* ================================================================ */
interface PinRow {
    component: string;
    component_pin: string;
    mcu: string;
    mcu_pin: string;
    protocol: string;
    voltage: string;
    note: string;
}

const PROTOCOLS = ['I2C', 'SPI', 'UART', 'GPIO', 'PWM', 'ADC', 'Power', 'GND'];
const EMPTY_PIN: PinRow = { component: '', component_pin: '', mcu: 'ESP32', mcu_pin: '', protocol: 'GPIO', voltage: '3.3V', note: '' };

function PublishProjectModal({
    projectIdea, projectItems, diagramCode, onClose,
}: {
    projectIdea: string;
    projectItems: BOMItem[];
    diagramCode: string;
    onClose: () => void;
}) {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState(projectIdea || '');
    const [schematicUrl, setSchematicUrl] = React.useState('');
    const [uploadFile, setUploadFile] = React.useState<File | null>(null);
    const [pinRows, setPinRows] = React.useState<PinRow[]>([{ ...EMPTY_PIN }]);
    const [publishing, setPublishing] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const addPin = () => setPinRows(p => [...p, { ...EMPTY_PIN }]);
    const removePin = (i: number) => setPinRows(p => p.filter((_, idx) => idx !== i));
    const updatePin = (i: number, f: keyof PinRow, v: string) =>
        setPinRows(p => p.map((r, idx) => idx === i ? { ...r, [f]: v } : r));

    const handlePublish = async () => {
        if (!title.trim()) { alert('Vui lòng nhập tên dự án!'); return; }
        setPublishing(true);
        try {
            const supabase = (await import('@/lib/supabase/client')).createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { alert('Bạn cần đăng nhập!'); setPublishing(false); return; }
            let finalSchematicUrl: string | null = schematicUrl.trim() || null;
            if (uploadFile) {
                setUploadProgress('Đang upload sơ đồ...');
                const ext = uploadFile.name.split('.').pop();
                const path = `${user.id}/${Date.now()}.${ext}`;
                const { error: ue } = await supabase.storage.from('schematics').upload(path, uploadFile, { upsert: true });
                if (ue) { alert('Upload error: ' + ue.message); setPublishing(false); setUploadProgress(''); return; }
                const { data: { publicUrl } } = supabase.storage.from('schematics').getPublicUrl(path);
                finalSchematicUrl = publicUrl;
            }
            const validPins = pinRows.filter(r => r.component.trim() && r.component_pin.trim() && r.mcu_pin.trim());
            setUploadProgress('Đang lưu...');
            const { error } = await supabase.from('public_projects').insert([{
                title: title.trim(),
                description: description.trim() || 'Không có mô tả',
                bom_data: projectItems,
                diagram_code: diagramCode || null,
                schematic_image_url: finalSchematicUrl,
                pin_connections: validPins.length > 0 ? validPins : null,
                user_id: user.id,
            }]);
            if (error) alert('Lỗi: ' + error.message);
            else setSuccess(true);
        } finally { setPublishing(false); setUploadProgress(''); }
    };

    if (success) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-white/10 p-10 text-center max-w-sm w-full shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-check text-emerald-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-black dark:text-slate-100 mb-2">Đã lưu thành công!</h3>
                <p className="text-sm text-slate-500 mb-6">Dự án đã được lưu vào Thư Viện.</p>
                <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-[#2D9CDB] to-[#00D4FF] text-white font-bold rounded-xl">Close</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#0D1117] rounded-3xl border border-white/10 shadow-2xl max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/5 flex-shrink-0">
                    <div>
                        <h2 className="font-black dark:text-slate-100 text-lg flex items-center gap-2">
                            <i className="fa-solid fa-cloud-arrow-up text-[#2D9CDB]"></i> Lưu Dự Án
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Lưu dự án vào thư viện cá nhân của bạn</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
                        <i className="fa-solid fa-xmark text-slate-500 dark:text-slate-400 text-sm"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                    {/* Info */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Tên Dự Án *</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Trạm Thời Tiết IoT với ESP32" className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9CDB] dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Mô tả</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Mô tả ngắn về dự án..." className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9CDB] dark:text-slate-200 resize-none"/>
                        </div>
                    </div>

                    {/* Schematic Upload */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                            <i className="fa-solid fa-image text-emerald-400"></i> Sơ Đồ Nguyên Lý (tùy chọn)
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#161B22] border border-dashed border-slate-300 dark:border-[#30363D] rounded-xl cursor-pointer hover:border-[#2D9CDB] transition-colors group">
                                <i className="fa-solid fa-cloud-arrow-up text-slate-400 group-hover:text-[#2D9CDB]"></i>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{uploadFile ? uploadFile.name : 'Upload PNG/JPG từ KiCad, EasyEDA, Fritzing...'}</p>
                                    {!uploadFile && <p className="text-[10px] text-slate-400">Tối đa 5MB</p>}
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={e => { setUploadFile(e.target.files?.[0] || null); if (e.target.files?.[0]) setSchematicUrl(''); }}/>
                                {uploadFile && <button onClick={e => { e.preventDefault(); setUploadFile(null); }} className="text-xs text-red-400"><i className="fa-solid fa-xmark"></i></button>}
                            </label>
                            <div className="flex items-center gap-2"><div className="flex-1 h-px bg-slate-200 dark:bg-white/5"></div><span className="text-xs text-slate-400">hoặc URL</span><div className="flex-1 h-px bg-slate-200 dark:bg-white/5"></div></div>
                            <input type="url" value={schematicUrl} onChange={e => { setSchematicUrl(e.target.value); if (e.target.value) setUploadFile(null); }} placeholder="https://easyeda.com/..." className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9CDB] dark:text-slate-200"/>
                        </div>
                    </div>

                    {/* Pin Table Builder */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <i className="fa-solid fa-plug text-amber-400"></i> Kết Nối Chân (tùy chọn)
                            </label>
                            <button onClick={addPin} className="text-xs text-[#2D9CDB] font-bold flex items-center gap-1">
                                <i className="fa-solid fa-plus text-[10px]"></i> Thêm dòng
                            </button>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-[#30363D] overflow-hidden">
                            <div className="grid grid-cols-12 text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-[#161B22] px-2 py-1.5">
                                <span className="col-span-2">Linh kiện</span>
                                <span className="col-span-2">Pin</span>
                                <span className="col-span-2">MCU</span>
                                <span className="col-span-2">Chân MCU</span>
                                <span className="col-span-2">Giao thức</span>
                                <span className="col-span-1">Vcc</span>
                                <span className="col-span-1"></span>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-[#30363D]">
                                {pinRows.map((row, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-1 items-center p-1.5 bg-white dark:bg-[#0D1117]">
                                        <input value={row.component} onChange={e => updatePin(i,'component',e.target.value)} placeholder="BME280" className="col-span-2 px-1.5 py-1 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded text-xs dark:text-slate-200 focus:outline-none focus:border-[#2D9CDB]"/>
                                        <input value={row.component_pin} onChange={e => updatePin(i,'component_pin',e.target.value)} placeholder="SDA" className="col-span-2 px-1.5 py-1 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded text-xs font-mono dark:text-slate-200 focus:outline-none focus:border-[#2D9CDB]"/>
                                        <input value={row.mcu} onChange={e => updatePin(i,'mcu',e.target.value)} placeholder="ESP32" className="col-span-2 px-1.5 py-1 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded text-xs dark:text-slate-200 focus:outline-none focus:border-[#2D9CDB]"/>
                                        <input value={row.mcu_pin} onChange={e => updatePin(i,'mcu_pin',e.target.value)} placeholder="GPIO21" className="col-span-2 px-1.5 py-1 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded text-xs font-mono dark:text-[#2D9CDB] focus:outline-none focus:border-[#2D9CDB]"/>
                                        <select value={row.protocol} onChange={e => updatePin(i,'protocol',e.target.value)} className="col-span-2 px-1 py-1 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded text-xs dark:text-slate-200 focus:outline-none focus:border-[#2D9CDB]">
                                            {PROTOCOLS.map(p => <option key={p}>{p}</option>)}
                                        </select>
                                        <input value={row.voltage} onChange={e => updatePin(i,'voltage',e.target.value)} placeholder="3.3V" className="col-span-1 px-1.5 py-1 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded text-xs dark:text-slate-200 focus:outline-none focus:border-[#2D9CDB]"/>
                                        <button onClick={() => removePin(i)} className="col-span-1 flex justify-center text-slate-400 hover:text-red-400 transition-colors">
                                            <i className="fa-solid fa-xmark text-xs"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5">Only rows with Linh kiện + Pin + Chân MCU will be saved.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-5 border-t border-slate-200 dark:border-white/5 flex items-center gap-3 justify-end">
                    {uploadProgress && <span className="text-xs text-[#2D9CDB] flex items-center gap-1.5 mr-auto"><i className="fa-solid fa-spinner fa-spin text-[10px]"></i>{uploadProgress}</span>}
                    <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Hủy</button>
                    <button onClick={handlePublish} disabled={publishing} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#2D9CDB] to-[#00D4FF] hover:opacity-90 text-white font-bold rounded-xl text-sm disabled:opacity-50 shadow-md shadow-blue-500/20 transition-all">
                        <i className={`fa-solid ${publishing ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'}`}></i>
                        {publishing ? 'Đang lưu...' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
}
