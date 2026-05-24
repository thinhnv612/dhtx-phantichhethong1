import React from 'react';

interface AdminStaffProps {
  adminUsers: any[];
  onOpenStaffModal: (data?: any) => void;
  onDeleteStaff: (id: number) => void;
}

export const AdminStaff: React.FC<AdminStaffProps> = ({
  adminUsers,
  onOpenStaffModal,
  onDeleteStaff,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">👥 Quản Lý Tài Khoản Nhân Viên</h2>
        <button 
          onClick={() => onOpenStaffModal({ username: '', role: 'STAFF' })}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl flex items-center space-x-1 shadow-md active:scale-95 transition-all"
        >
          <span>+ Thêm Nhân Viên</span>
        </button>
      </div>

      {/* Staff tables */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Tên tài khoản</th>
                <th className="px-6 py-4">Phân quyền</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
              {adminUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-mono">#{u.id}</td>
                  <td className="px-6 py-4 text-slate-950 font-extrabold">{u.username}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      u.role === 'ADMIN' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {u.username === 'admin' ? (
                      <span className="text-xs text-slate-400 font-bold">Mặc định</span>
                    ) : (
                      <button 
                        onClick={() => onDeleteStaff(u.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs active:scale-95 transition-all"
                      >
                        Khóa / Xóa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
