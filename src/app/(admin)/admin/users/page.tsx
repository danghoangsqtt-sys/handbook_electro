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

  const [sortField, setSortField] = useState<keyof Profile>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSort = (field: keyof Profile) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (user.display_name && user.display_name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    // Handle null values
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 md:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#0066FF] rounded-l-2xl"></div>
        <div className="pl-2 md:pl-4">
          <h1 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Người dùng</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Quản lý tài khoản truy cập hệ thống.</p>
        </div>
        <div className="flex gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <i className="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs md:text-sm"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm người dùng..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] dark:focus:border-[#0066FF] outline-none text-xs md:text-sm w-full sm:w-64 transition-colors rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>
          <button onClick={fetchUsers} className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-800 px-3 py-2.5 md:px-4 md:py-3 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0">
            <i className="fa-solid fa-rotate-right"></i> <span className="hidden sm:inline">Tải lại</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#050505] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 hidden md:table">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800 text-xs">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-[#FF003C] transition-colors" onClick={() => handleSort('display_name')}>
                  Tên hiển thị {sortField === 'display_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#FF003C] transition-colors" onClick={() => handleSort('email')}>
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#FF003C] transition-colors" onClick={() => handleSort('created_at')}>
                  Ngày đăng ký {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-[#FF003C] transition-colors" onClick={() => handleSort('is_approved')}>
                  Trạng thái {sortField === 'is_approved' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center border-b border-slate-200 dark:border-slate-800">
                    <i className="fa-solid fa-spinner animate-spin text-2xl text-[#0066FF] mb-2"></i>
                    <p className="text-[#888] mt-2 font-medium text-xs">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#888] font-medium text-xs border-b border-slate-200 dark:border-slate-800">
                    Chưa có người dùng nào.
                  </td>
                </tr>
              ) : (
                sortedUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">{user.display_name || <span className="text-slate-500 italic">Chưa cập nhật</span>}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{user.email || <span className="text-slate-500 italic">Ẩn</span>}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-center">
                      {user.is_approved ? (
                        <span className="text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-2.5 py-1 text-[9px] uppercase font-semibold rounded-md shadow-[0_0_5px_rgba(57,255,20,0.1)] inline-block">ĐÃ DUYỆT</span>
                      ) : (
                        <span className="text-[#0066FF] bg-[#0066FF]/10 border border-[#0066FF]/30 px-2.5 py-1 text-[9px] uppercase font-semibold rounded-md shadow-[0_0_5px_rgba(0,102,255,0.1)] inline-block">CHỜ DUYỆT</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleApproval(user.id, user.is_approved)}
                        className={`px-3 py-1.5 rounded-lg border font-medium text-[10px] transition-all ${
                          user.is_approved
                            ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[#FF003C] hover:bg-[#FF003C]/10 hover:border-[#FF003C]/50'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[#39FF14] hover:bg-[#39FF14]/10 hover:border-[#39FF14]/50'
                        }`}
                      >
                        {user.is_approved ? 'KHÓA' : 'PHÊ DUYỆT'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-3 p-3 bg-slate-50/50 dark:bg-[#050505]">
          {loading ? (
            <div className="py-10 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
              <i className="fa-solid fa-spinner animate-spin text-xl text-[#0066FF] mb-2"></i>
              <p className="text-slate-500 mt-2 font-medium text-[10px]">Đang tải dữ liệu...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center text-slate-500 font-medium text-[10px] border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
              Chưa có người dùng nào.
            </div>
          ) : (
            sortedUsers.map(user => (
              <div key={user.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 flex items-center rounded-xl shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0066FF]"></div>
                
                <div className="flex gap-3 items-center pl-1.5 w-full">
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-200 text-sm truncate mb-0.5">{user.display_name || <span className="text-slate-500 italic">Chưa cập nhật</span>}</h3>
                    <p className="text-slate-500 text-[10px] md:text-xs truncate mb-1">{user.email || <span className="text-slate-500 italic">Ẩn</span>} • {new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {user.is_approved ? (
                        <span className="text-[#39FF14] text-[9px] uppercase font-semibold whitespace-nowrap"><i className="fa-solid fa-circle text-[6px] mr-1"></i> Đã duyệt</span>
                      ) : (
                        <span className="text-[#0066FF] text-[9px] uppercase font-semibold whitespace-nowrap"><i className="fa-solid fa-circle text-[6px] mr-1"></i> Chờ duyệt</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => toggleApproval(user.id, user.is_approved)}
                      className={`px-2 py-1.5 rounded-md border font-medium text-[9px] transition-all whitespace-nowrap ${
                        user.is_approved
                          ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[#FF003C] hover:bg-[#FF003C]/10 hover:border-[#FF003C]/30'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[#39FF14] hover:bg-[#39FF14]/10 hover:border-[#39FF14]/30'
                      }`}
                    >
                      {user.is_approved ? 'KHÓA LẠI' : 'PHÊ DUYỆT'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
