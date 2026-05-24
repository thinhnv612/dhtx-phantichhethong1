import React from 'react';
import { formatVND } from '../../utils/helpers';

interface AdminDashboardProps {
  dashboardStats: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ dashboardStats }) => {
  if (!dashboardStats) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <span className="text-4xl animate-bounce">📊</span>
        <h3 className="text-lg font-bold text-slate-800">Đang tải báo cáo doanh thu...</h3>
        <p className="text-slate-400 text-xs">Vui lòng chờ trong giây lát.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Dashboard Title */}
      <h2 className="text-2xl font-bold text-slate-800">📊 Tổng Quan Kết Quả Bán Hàng</h2>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doanh Thu (Thực Nhận)</span>
          <span className="text-xl sm:text-2xl font-extrabold text-amber-600 tracking-tight">
            {formatVND(dashboardStats.kpis?.totalRevenue)}
          </span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tổng số Đơn Hàng</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {dashboardStats.kpis?.totalOrders}
          </span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sản phẩm hiện có</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {dashboardStats.kpis?.totalProducts}
          </span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Voucher Hoạt Động</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {dashboardStats.kpis?.activeVouchers}
          </span>
        </div>
      </div>

      {/* SVG Revenue Graph & Best sellers columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Custom SVG Line Chart */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base uppercase tracking-wider">Xu hướng Doanh thu (7 Ngày gần nhất)</h3>
          {dashboardStats.revenueTrend?.length > 0 ? (
            <div className="h-64 relative pt-6">
              {/* Draw SVG path mathematically */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                {(() => {
                  const trend: { revenue: number }[] = dashboardStats.revenueTrend;
                  const maxRev = Math.max(...trend.map(x => x.revenue), 100000);
                  const minRev = 0;
                  const stepX = 100 / (trend.length - 1 || 1);
                  
                  const points = trend.map((x, i) => {
                    const rawY = ((x.revenue - minRev) / (maxRev - minRev)) * 70;
                    const y = 85 - rawY; // Invert coordinates
                    const px = i * stepX;
                    return { x: px, y };
                  });

                  const pathStr = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                  const areaStr = `${pathStr} L 100 85 L 0 85 Z`;

                  return (
                    <>
                      {/* Grid lines */}
                      <line x1="0" y1="85" x2="100" y2="85" stroke="#f1f5f9" strokeWidth="0.8" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#f8fafc" strokeWidth="0.8" />
                      <line x1="0" y1="15" x2="100" y2="15" stroke="#f8fafc" strokeWidth="0.8" />

                      {/* Area Fill */}
                      <path d={areaStr} fill="url(#chartGrad)" />
                      {/* Colored Line */}
                      <path d={pathStr} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                      {/* Circle points */}
                      {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="2" fill="#fff" stroke="#f59e0b" strokeWidth="1.5" />
                      ))}
                    </>
                  );
                })()}
              </svg>
              
              {/* Labels */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[9px] font-bold text-slate-400">
                {dashboardStats.revenueTrend.map((x: any, i: number) => (
                  <span key={i}>{x.date.split('-').slice(1).join('/')}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-semibold">Chưa có đủ số liệu doanh số tuần này</div>
          )}
        </div>

        {/* Best Sellers side panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base uppercase tracking-wider">Món Bán Chạy Nhất</h3>
          <div className="divide-y divide-slate-100">
            {dashboardStats.bestSellers?.map((bs: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-3 text-sm font-semibold">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-extrabold">{idx + 1}</span>
                  <span className="text-slate-800 line-clamp-1">{bs.name}</span>
                </div>
                <span className="text-slate-500 whitespace-nowrap">Đã bán: <span className="text-slate-800 font-extrabold">{bs.sold}</span></span>
              </div>
            ))}
            {(!dashboardStats.bestSellers || dashboardStats.bestSellers.length === 0) && (
              <div className="py-8 text-center text-slate-400 text-xs font-semibold">Chưa có sản phẩm bán được</div>
            )}
          </div>
        </div>

      </div>

      {/* Stock Alarm Warning Indicator */}
      {dashboardStats.lowStock?.length > 0 && (
        <div className="p-4 sm:p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-start space-x-3 text-rose-800 animate-pulse">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-rose-950">Cảnh báo hết hàng!</h4>
            <p className="text-xs sm:text-sm font-medium mt-1">Các sản phẩm sau đây có tồn kho dưới 5. Vui lòng vào mục Quản lý Nhập Kho để nhập thêm hàng tránh gián đoạn dịch vụ:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {dashboardStats.lowStock.map((ls: any) => (
                <span key={ls.id} className="inline-flex items-center bg-rose-100 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold text-rose-900">
                  {ls.name} ({ls.stock_quantity} cái)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
