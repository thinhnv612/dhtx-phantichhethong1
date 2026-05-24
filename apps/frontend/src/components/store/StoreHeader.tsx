import React from 'react';

interface StoreHeaderProps {
  portal: 'store' | 'admin';
  setPortal: (portal: 'store' | 'admin') => void;
  storeTab: 'home' | 'track' | 'support';
  setStoreTab: (tab: 'home' | 'track' | 'support') => void;
  cartItemsCount: number;
  onCartTrigger: () => void;
  newOrderAlert: boolean;
  alertCount: number;
  onAlertClick: () => void;
  adminToken: string;
  onAdminLogout: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  portal,
  setPortal,
  storeTab,
  setStoreTab,
  cartItemsCount,
  onCartTrigger,
  newOrderAlert,
  alertCount,
  onAlertClick,
  adminToken,
  onAdminLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-amber-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => { setPortal('store'); setStoreTab('home'); }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 transform hover:scale-105 transition-all">
              <span className="text-xl sm:text-2xl text-white">🍿</span>
            </div>
            <div>
              <span className="block text-base sm:text-lg font-bold text-amber-950 leading-none">Tiệm Ăn Vặt</span>
              <span className="block text-xs sm:text-sm font-semibold text-amber-500 tracking-wider">THỦY BÙI</span>
            </div>
          </div>

          {/* Middle navigation (Customer Portal options) */}
          {portal === 'store' && (
            <nav className="hidden md:flex space-x-2 bg-amber-100/40 p-1.5 rounded-xl border border-amber-100">
              <button 
                onClick={() => setStoreTab('home')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  storeTab === 'home' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-900 hover:bg-amber-100/50'
                }`}
              >
                🍗 Mua sắm
              </button>
              <button 
                onClick={() => setStoreTab('track')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  storeTab === 'track' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-900 hover:bg-amber-100/50'
                }`}
              >
                📦 Theo dõi đơn hàng
              </button>
              <button 
                onClick={() => setStoreTab('support')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  storeTab === 'support' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-900 hover:bg-amber-100/50'
                }`}
              >
                💬 Tư vấn & Hỗ trợ
              </button>
            </nav>
          )}

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {portal === 'store' ? (
              <>
                {/* Shopping Cart Trigger */}
                <button 
                  onClick={onCartTrigger}
                  className="relative p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50/50 rounded-xl transition-all"
                  id="cart-trigger-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => setPortal('admin')}
                  className="flex items-center space-x-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-800 hover:shadow-md transition-all"
                >
                  <span>Quản trị</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Flashing Realtime Order Alert (Admin Badge) */}
                {newOrderAlert && (
                  <button 
                    onClick={onAlertClick}
                    className="relative p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 animate-pulse transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 animate-bounce">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                      {alertCount}
                    </span>
                  </button>
                )}

                <button 
                  onClick={() => setPortal('store')}
                  className="flex items-center space-x-1 px-3 py-2 bg-amber-500 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-amber-600 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <span>Trang bán hàng</span>
                </button>
                {adminToken && (
                  <button 
                    onClick={onAdminLogout}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Đăng xuất"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sub Navigation on Mobile */}
        {portal === 'store' && (
          <div className="flex md:hidden items-center justify-center space-x-1 pb-3 overflow-x-auto border-t border-amber-50 pt-2">
            <button 
              onClick={() => setStoreTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                storeTab === 'home' ? 'bg-amber-500 text-white' : 'text-amber-900 bg-amber-50/50 hover:bg-amber-100/50'
              }`}
            >
              🍿 Mua sắm
            </button>
            <button 
              onClick={() => setStoreTab('track')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                storeTab === 'track' ? 'bg-amber-500 text-white' : 'text-amber-900 bg-amber-50/50 hover:bg-amber-100/50'
              }`}
            >
              📦 Tra cứu đơn
            </button>
            <button 
              onClick={() => setStoreTab('support')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                storeTab === 'support' ? 'bg-amber-500 text-white' : 'text-amber-900 bg-amber-50/50 hover:bg-amber-100/50'
              }`}
            >
              💬 Hỗ trợ trực tuyến
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
