'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuthModal({ onSuccess }: { onSuccess: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) {
                    setError(signUpError.message);
                } else {
                    setError('Đăng ký thành công! Đang chờ Admin phê duyệt tài khoản.');
                    await supabase.auth.signOut();
                }
            } else {
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) {
                    setError(signInError.message);
                } else if (signInData?.user) {
                    // Check if approved
                    const { data: profile } = await supabase.from('profiles').select('is_approved').eq('id', signInData.user.id).single();
                    if (profile && profile.is_approved === false) {
                        await supabase.auth.signOut();
                        setError('Tài khoản của bạn chưa được Admin phê duyệt.');
                    } else {
                        onSuccess();
                    }
                }
            }
        } catch {
            setError('Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-3xl p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl max-w-[400px] w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <i className="fa-solid fa-user-lock text-xl"></i>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{isSignUp ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}</h2>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Truy cập AI Lab và lưu trữ dữ liệu cá nhân.</p>
                </div>



                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full text-[15px] px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            className="w-full text-[15px] px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-xs text-center font-semibold">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-[15px]"
                    >
                        {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : (isSignUp ? 'Đăng ký' : 'Đăng nhập')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        type="button" 
                        onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
                    </button>
                </div>
            </div>
        </div>
    );
}
