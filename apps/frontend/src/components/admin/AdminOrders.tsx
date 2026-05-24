import React from 'react';
import { Order } from '../../types';
import { formatVND } from '../../utils/helpers';

interface AdminOrdersProps {
  adminOrders: Order[];
  adminOrdersFilter: string;
  onAdminOrdersFilterChange: (filter: string) => void;
  onChangeOrderStatus: (orderId: number, nextStatus: string) => void;
}

export const getOrderStatusPill = (status: string) => {
  const confs: any = {
    PENDING: { bg: 'bg-orange-50 text-orange-600 border-orange-200', text: 'Chờ duyệt' },
    PAID: { bg: 'bg-green-50 text-green-600 border-green-200', text: 'Đã thanh toán' },
    PREPARING: { bg: 'bg-yellow-50 text-yellow-700 border-yellow-200', text: 'Đang chuẩn bị' },
    SHIPPING: { bg: 'bg-blue-50 text-blue-600 border-blue-200', text: 'Đang giao hàng' },
    COMPLETED: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', text: 'Hoàn thành' },
    CANCELLED: { bg: 'bg-rose-50 text-rose-600 border-rose-200', text: 'Đã hủy' },
  };
  const c = confs[status] || { bg: 'bg-slate-50 text-slate-600 border-slate-200', text: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg}`}>
      {c.text}
    </span>
  );
};

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  adminOrders,
  adminOrdersFilter,
  onAdminOrdersFilterChange,
  onChangeOrderStatus,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header and trigger details */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <span>📡 Màn Hình Realtime Đơn Hàng</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          </h2>
          <p className="text-slate-400 text-xs font-medium mt-1">
            Đơn hàng mới hiển thị và chuông báo tự động không cần bấm F5 nhờ công nghệ Server-Sent Events (SSE).
          </p>
        </div>
        
        {/* Order Filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit self-start sm:self-auto border border-slate-200">
          {['ALL', 'PENDING', 'PREPARING', 'SHIPPING', 'COMPLETED', 'CANCELLED'].map(s => (
            <button 
              key={s}
              onClick={() => onAdminOrdersFilterChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                adminOrdersFilter === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s === 'ALL' ? 'Tất cả' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Display list */}
      <div className="space-y-4">
        {adminOrders
          .filter(o => adminOrdersFilter === 'ALL' || o.status === adminOrdersFilter)
          .map(order => {
            const details = order.customer_name.split('|');
            return (
              <div 
                key={order.id}
                className={`bg-white rounded-3xl border shadow-sm p-5 sm:p-6 space-y-4 transition-all hover:shadow-md ${
                  order.status === 'PENDING' ? 'border-orange-200 bg-orange-50/10' : 'border-slate-100'
                }`}
              >
                
                {/* Info and states */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-3 gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-800 text-base">Đơn hàng #{order.id}</span>
                    <span className="text-slate-400 text-xs font-bold">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </span>
                    {getOrderStatusPill(order.status)}
                  </div>
                  <div className="font-extrabold text-amber-600 text-lg self-start sm:self-auto">
                    {formatVND(order.final_price)}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5">
                    <div className="font-bold text-slate-700">Thông tin khách hàng:</div>
                    {details.length >= 3 ? (
                      <>
                        <div><span className="font-medium text-slate-500">Tên:</span> {details[0]?.trim()}</div>
                        <div><span className="font-medium text-slate-500">SĐT:</span> {details[1]?.trim()}</div>
                        <div><span className="font-medium text-slate-500">Địa chỉ:</span> {details[2]?.trim()}</div>
                      </>
                    ) : (
                      <div>{order.customer_name}</div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5">
                    <div className="font-bold text-slate-700">Món ăn đã đặt:</div>
                    <div className="divide-y divide-slate-100 max-h-24 overflow-y-auto">
                      {order.details?.map(d => (
                        <div key={d.id} className="flex justify-between py-1 font-semibold text-xs">
                          <span className="text-slate-600">{d.product?.name} x{d.quantity}</span>
                          <span className="text-slate-800">{formatVND(d.price_at_purchase * d.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Status actions flow */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-50">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mr-auto self-center">
                    Cập nhật nhanh tiến trình:
                  </span>
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => onChangeOrderStatus(order.id, 'PREPARING')}
                      className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 shadow-sm shadow-amber-500/10 active:scale-95 transition-all"
                    >
                      👨‍🍳 Làm món
                    </button>
                  )}
                  {order.status === 'PREPARING' && (
                    <button 
                      onClick={() => onChangeOrderStatus(order.id, 'SHIPPING')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 shadow-sm shadow-blue-500/10 active:scale-95 transition-all"
                    >
                      🛵 Giao hàng
                    </button>
                  )}
                  {order.status === 'SHIPPING' && (
                    <button 
                      onClick={() => onChangeOrderStatus(order.id, 'COMPLETED')}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 shadow-sm shadow-emerald-500/10 active:scale-95 transition-all"
                    >
                      ✅ Hoàn thành
                    </button>
                  )}
                  {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                    <button 
                      onClick={() => onChangeOrderStatus(order.id, 'CANCELLED')}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold active:scale-95 transition-all"
                    >
                      ❌ Hủy đơn
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        {adminOrders.length === 0 && (
          <div className="py-16 bg-white border border-slate-100 text-center rounded-3xl text-slate-400 text-sm font-semibold">
            Chưa có đơn hàng nào trong hệ thống
          </div>
        )}
      </div>

    </div>
  );
};
