import React from 'react';

interface AdminSidebarProps {
  adminUser: string;
  adminRole: string;
  adminTab: 'dashboard' | 'orders' | 'products' | 'vouchers' | 'staff' | 'inventory' | 'support';
  onTabChange: (tab: 'dashboard' | 'orders' | 'products' | 'vouchers' | 'staff' | 'inventory' | 'support') => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  adminUser,
  adminRole,
  adminTab,
  onTabChange,
}) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      
      {/* Admin User Card */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-md space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center font-bold text-lg text-white">
            {adminUser.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-extrabold leading-none line-clamp-1">{adminUser}</div>
            <span className="inline-block px-2 py-0.5 bg-white/20 text-[10px] font-bold tracking-wider uppercase rounded-full mt-1.5 border border-white/10 text-amber-300">
              👑 {adminRole}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 scrollbar-none">
        
        {adminRole === 'ADMIN' && (
          <button 
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal ${
              adminTab === 'dashboard' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span>📊 Thống kê chung</span>
          </button>
        )}

        <button 
          onClick={() => onTabChange('orders')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal ${
            adminTab === 'orders' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <span>📡 Đơn hàng realtime</span>
        </button>

        {adminRole === 'ADMIN' && (
          <>
            <button 
              onClick={() => onTabChange('products')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal ${
                adminTab === 'products' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span>🍟 Quản lý món ăn</span>
            </button>

            <button 
              onClick={() => onTabChange('vouchers')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal ${
                adminTab === 'vouchers' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span>🏷️ Mã giảm giá</span>
            </button>

            <button 
              onClick={() => onTabChange('staff')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal ${
                adminTab === 'staff' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span>👥 Tài khoản nhân sự</span>
            </button>
          </>
        )}

        <button 
          onClick={() => onTabChange('inventory')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal ${
            adminTab === 'inventory' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <span>📦 Quản lý nhập kho</span>
        </button>

        <button 
          onClick={() => onTabChange('support')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal ${
            adminTab === 'support' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <span>✉️ Ý kiến tư vấn</span>
        </button>
        
      </nav>
    </div>
  );
};
