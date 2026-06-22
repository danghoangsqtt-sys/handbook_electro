'use client';

import { useState } from 'react';

export default function PinLogin({ onSuccess }: { onSuccess: () => void }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length < 4) {
            setError('Mã PIN phải có ít nhất 4 ký tự');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin })
            });

            const data = await res.json();
            if (res.ok) {
                onSuccess();
            } else {
                setError(data.error || 'Xác thực thất bại');
            }
        } catch (err) {
            setError('Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-3xl">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl max-w-sm w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-lock text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Truy Cập AI Lab</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Nhập mã PIN cá nhân để đồng bộ và tiếp tục lịch sử thảo luận kỹ thuật của bạn.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Nhập mã PIN..."
                            className="w-full text-center text-xl tracking-widest px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                            maxLength={10}
                            autoFocus
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-xs text-center font-semibold">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Mở Khóa Không Gian'}
                    </button>
                </form>
            </div>
        </div>
    );
}
