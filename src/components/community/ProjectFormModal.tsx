'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PinRow {
    component: string;
    component_pin: string;
    mcu: string;
    mcu_pin: string;
    protocol: string;
    voltage: string;
}

export interface ProjectFormData {
    id?: string; // present when editing
    title: string;
    description: string;
    schematic_image_url: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pin_connections: any[] | null;
    diagram_code: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code_snippets: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bom_data: any[];
}

interface Props {
    mode: 'add' | 'edit';
    initialData?: Partial<ProjectFormData>;
    onClose: () => void;
    onSaved: () => void;
}

const PROTOCOLS = ['I2C', 'SPI', 'UART', 'GPIO', 'PWM', 'ADC', 'Power', 'GND'];
const EMPTY_PIN: PinRow = { component: '', component_pin: '', mcu: 'ESP32', mcu_pin: '', protocol: 'GPIO', voltage: '3.3V' };

export default function ProjectFormModal({ mode, initialData, onClose, onSaved }: Props) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [diagramCode, setDiagramCode] = useState(initialData?.diagram_code || '');
    const [codeSnippets, setCodeSnippets] = useState(
        typeof initialData?.code_snippets === 'string'
            ? initialData.code_snippets
            : initialData?.code_snippets
                ? JSON.stringify(initialData.code_snippets, null, 2)
                : ''
    );
    const [schematicUrl, setSchematicUrl] = useState(initialData?.schematic_image_url || '');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [pinRows, setPinRows] = useState<PinRow[]>(
        initialData?.pin_connections?.length
            ? initialData.pin_connections.map(r => ({
                component: r.component || '',
                component_pin: r.component_pin || '',
                mcu: r.mcu || 'ESP32',
                mcu_pin: r.mcu_pin || '',
                protocol: r.protocol || 'GPIO',
                voltage: r.voltage || '3.3V',
            }))
            : [{ ...EMPTY_PIN }]
    );
    const [activeSection, setActiveSection] = useState<'info' | 'schematic' | 'pins' | 'code'>('info');
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    const addPin = () => setPinRows(p => [...p, { ...EMPTY_PIN }]);
    const removePin = (i: number) => setPinRows(p => p.filter((_, idx) => idx !== i));
    const updatePin = (i: number, f: keyof PinRow, v: string) =>
        setPinRows(p => p.map((r, idx) => idx === i ? { ...r, [f]: v } : r));

    const handleSave = async () => {
        if (!title.trim()) { alert('Vui lòng nhập tên dự án!'); return; }
        setSaving(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { alert('Bạn cần đăng nhập để lưu dự án!'); setSaving(false); return; }

            // Upload schematic if file selected
            let finalSchematicUrl: string | null = schematicUrl.trim() || null;
            if (uploadFile) {
                setUploadProgress('Đang upload sơ đồ...');
                const ext = uploadFile.name.split('.').pop();
                const path = `${user.id}/${Date.now()}.${ext}`;
                const { error: ue } = await supabase.storage
                    .from('schematics')
                    .upload(path, uploadFile, { upsert: true });
                if (ue) { alert('Lỗi upload: ' + ue.message); setSaving(false); setUploadProgress(''); return; }
                const { data: { publicUrl } } = supabase.storage.from('schematics').getPublicUrl(path);
                finalSchematicUrl = publicUrl;
            }

            const validPins = pinRows.filter(r => r.component.trim() && r.component_pin.trim() && r.mcu_pin.trim());

            // Parse code snippets (support JSON or plain string)
            let parsedCode: string | null = codeSnippets.trim() || null;

            setUploadProgress(mode === 'add' ? 'Đang lưu dự án...' : 'Đang cập nhật...');

            const payload = {
                title: title.trim(),
                description: description.trim() || 'Không có mô tả',
                diagram_code: diagramCode.trim() || null,
                schematic_image_url: finalSchematicUrl,
                pin_connections: validPins.length > 0 ? validPins : null,
                code_snippets: parsedCode,
                bom_data: initialData?.bom_data || [],
                user_id: user.id,
            };

            if (mode === 'add') {
                const { error } = await supabase.from('public_projects').insert([payload]);
                if (error) { alert('Error: ' + error.message); } else { onSaved(); }
            } else {
                const { error } = await supabase.from('public_projects')
                    .update(payload)
                    .eq('id', initialData?.id)
                    .eq('user_id', user.id);
                if (error) { alert('Error: ' + error.message); } else { onSaved(); }
            }
        } finally { setSaving(false); setUploadProgress(''); }
    };

    const SECTIONS = [
        { id: 'info', label: 'Thông Tin', icon: 'fa-circle-info' },
        { id: 'schematic', label: 'Sơ Đồ', icon: 'fa-image' },
        { id: 'pins', label: 'Kết Nối Chân', icon: 'fa-plug' },
        { id: 'code', label: 'Mã Nguồn', icon: 'fa-code' },
    ] as const;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#0D1117] rounded-3xl border border-white/10 shadow-2xl max-h-[95vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/5 flex-shrink-0">
                    <div>
                        <h2 className="font-black dark:text-slate-100 text-lg flex items-center gap-2">
                            <i className={`fa-solid ${mode === 'add' ? 'fa-folder-plus text-[#2D9CDB]' : 'fa-pen-to-square text-amber-400'}`}></i>
                            {mode === 'add' ? 'Thêm Dự Án Mới' : 'Chỉnh Sửa Dự Án'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {mode === 'add' ? 'Lưu trữ dự án vào thư viện cá nhân' : 'Cập nhật thông tin dự án'}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
                        <i className="fa-solid fa-xmark text-slate-500 dark:text-slate-400 text-sm"></i>
                    </button>
                </div>

                {/* Section Tabs */}
                <div className="flex border-b border-slate-200 dark:border-white/5 px-5 gap-1 flex-shrink-0">
                    {SECTIONS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 transition-all -mb-px ${
                                activeSection === s.id
                                    ? 'border-[#2D9CDB] text-[#2D9CDB]'
                                    : 'border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <i className={`fa-solid ${s.icon} text-[10px]`}></i>
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">

                    {/* SECTION: Info */}
                    {activeSection === 'info' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Tên Dự Án *</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="VD: Trạm Thời Tiết IoT với ESP32"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9CDB] dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Mô Tả</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={4}
                                    placeholder="Mô tả ngắn về dự án, mục đích, tính năng chính..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9CDB] dark:text-slate-200 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                                    <i className="fa-solid fa-diagram-project text-purple-400"></i> Sơ Đồ Khối (Mermaid)
                                </label>
                                <textarea
                                    value={diagramCode}
                                    onChange={e => setDiagramCode(e.target.value)}
                                    rows={5}
                                    placeholder="graph TD&#10;  A[ESP32] --> B[BME280]&#10;  A --> C[OLED]"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D9CDB] dark:text-slate-200 resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* SECTION: Schematic */}
                    {activeSection === 'schematic' && (
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Upload ảnh sơ đồ nguyên lý từ KiCad, EasyEDA, Fritzing hoặc nhập URL trực tiếp.</p>
                            <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#161B22] border border-dashed border-slate-300 dark:border-[#30363D] rounded-xl cursor-pointer hover:border-[#2D9CDB] transition-colors group">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-cloud-arrow-up text-emerald-400 text-lg group-hover:scale-110 transition-transform"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        {uploadFile ? uploadFile.name : 'Upload PNG / JPG / SVG'}
                                    </p>
                                    {!uploadFile && <p className="text-xs text-slate-400 mt-0.5">Tối đa 5MB — Sơ đồ nguyên lý</p>}
                                    {uploadFile && (
                                        <p className="text-xs text-emerald-500 mt-0.5">{(uploadFile.size / 1024).toFixed(0)} KB</p>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => { setUploadFile(e.target.files?.[0] || null); if (e.target.files?.[0]) setSchematicUrl(''); }}
                                />
                                {uploadFile && (
                                    <button onClick={e => { e.preventDefault(); setUploadFile(null); }} className="text-red-400 hover:text-red-600 transition-colors">
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </label>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-200 dark:bg-white/5"></div>
                                <span className="text-xs text-slate-400 font-mono">OR</span>
                                <div className="flex-1 h-px bg-slate-200 dark:bg-white/5"></div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">URL Ảnh</label>
                                <input
                                    type="url"
                                    value={schematicUrl}
                                    onChange={e => { setSchematicUrl(e.target.value); if (e.target.value) setUploadFile(null); }}
                                    placeholder="https://easyeda.com/editor/..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9CDB] dark:text-slate-200"
                                />
                            </div>

                            {(schematicUrl || uploadFile) && (
                                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-2">
                                    <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                        {uploadFile ? `File: ${uploadFile.name}` : 'URL đã nhập'}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION: Pins */}
                    {activeSection === 'pins' && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Nhập bảng kết nối chân giữa linh kiện và vi điều khiển.</p>
                                <button onClick={addPin} className="flex items-center gap-1.5 text-xs text-[#2D9CDB] font-bold hover:text-cyan-400 transition-colors">
                                    <i className="fa-solid fa-plus text-[10px]"></i> Thêm dòng
                                </button>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-[#30363D] overflow-hidden">
                                <div className="grid grid-cols-12 text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-[#161B22] px-2 py-2">
                                    <span className="col-span-2">Linh Kiện</span>
                                    <span className="col-span-2">Chân LK</span>
                                    <span className="col-span-2">MCU</span>
                                    <span className="col-span-2">Chân MCU</span>
                                    <span className="col-span-2">Giao Thức</span>
                                    <span className="col-span-1">Vcc</span>
                                    <span className="col-span-1"></span>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-[#30363D] max-h-64 overflow-y-auto">
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
                            <p className="text-[10px] text-slate-400 mt-2">Chi dong co du Linh Kiện + Chân LK + Chân MCU moi duoc luu.</p>
                        </div>
                    )}

                    {/* SECTION: Code */}
                    {activeSection === 'code' && (
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Nhập mã nguồn Arduino / MicroPython / C++ cho dự án.</p>
                            <textarea
                                value={codeSnippets}
                                onChange={e => setCodeSnippets(e.target.value)}
                                rows={16}
                                placeholder={`#include <Arduino.h>\n\nvoid setup() {\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  // your code here\n}`}
                                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D9CDB] dark:text-slate-200 resize-none leading-relaxed"
                                spellCheck={false}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-5 border-t border-slate-200 dark:border-white/5 flex items-center gap-3 justify-end">
                    {uploadProgress && (
                        <span className="text-xs text-[#2D9CDB] flex items-center gap-1.5 mr-auto">
                            <i className="fa-solid fa-spinner fa-spin text-[10px]"></i>
                            {uploadProgress}
                        </span>
                    )}
                    <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                        Huy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#2D9CDB] to-[#00D4FF] hover:opacity-90 text-white font-bold rounded-xl text-sm disabled:opacity-50 shadow-md shadow-blue-500/20 transition-all"
                    >
                        <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : mode === 'add' ? 'fa-floppy-disk' : 'fa-pen-to-square'}`}></i>
                        {saving ? 'Đang lưu...' : mode === 'add' ? 'Lưu Dự Án' : 'Cập Nhật'}
                    </button>
                </div>
            </div>
        </div>
    );
}
