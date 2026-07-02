'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  is_approved: boolean;
  created_at: string;
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, display_name, is_approved, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: !currentStatus })
      .eq('id', id);

    if (error) {
      alert('Lỗi cập nhật: ' + error.message);
    } else {
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Danh sách Người dùng</h1>
        <button onClick={fetchUsers} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-2">
          <i className="fa-solid fa-rotate-right"></i> Làm mới
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Tên hiển thị</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Email</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Ngày tạo</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Trạng thái</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <i className="fa-solid fa-spinner animate-spin text-xl"></i>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Chưa có người dùng nào.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-slate-200 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="p-4 font-medium">{user.display_name || <span className="text-slate-400 italic">Chưa cập nhật</span>}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{user.email || <span className="text-slate-400 italic">Ẩn</span>}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4">
                      {user.is_approved ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold rounded-full flex items-center gap-1 w-max">
                          <i className="fa-solid fa-check-circle"></i> Đã duyệt
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold rounded-full flex items-center gap-1 w-max">
                          <i className="fa-solid fa-clock"></i> Chờ duyệt
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleApproval(user.id, user.is_approved)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                          user.is_approved
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40'
                        }`}
                      >
                        {user.is_approved ? 'Khóa tài khoản' : 'Phê duyệt'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
