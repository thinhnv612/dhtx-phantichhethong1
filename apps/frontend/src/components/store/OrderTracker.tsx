import React from 'react';
import { Order } from '../../types';
import { formatVND } from '../../utils/helpers';

interface OrderTrackerProps {
  trackOrderId: string;
  onTrackOrderIdChange: (id: string) => void;
  trackedOrder: Order | null;
  trackError: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  trackOrderId,
  onTrackOrderIdChange,
  trackedOrder,
  trackError,
  onSubmit,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">📦 Theo Dõi Hành Trình Đơn Hàng</h1>
        <p className="text-slate-500 text-sm sm:text-base font-medium">
          Nhập mã số đơn hàng nhận được khi thanh toán để cập nhật tiến trình giao hàng theo thời gian thực.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={onSubmit} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-3">
        <input 
          type="number"
          placeholder="Nhập mã đơn hàng ví dụ: 1, 2..."
          value={trackOrderId}
          onChange={(e) => onTrackOrderIdChange(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-semibold"
        />
        <button 
          type="submit"
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl active:scale-95 transition-all">
          Tra cứu
        </button>
      </form>

      {trackError && (
        <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-center font-semibold animate-shake">
          ❌ {trackError}
        </div>
      )}

      {/* Tracking Stepper Details */}
      {trackedOrder && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-6 sm:space-y-8 animate-fade-in">
          
          {/* Header summary */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-wider">Mã đơn hàng</span>
                <span className="text-amber-600 font-extrabold text-base">#{trackedOrder.id}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Khách hàng: {trackedOrder.customer_name.split('|')[0] || trackedOrder.customer_name}
              </h2>
            </div>
            <div className="text-right self-start sm:self-auto">
              <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Thanh toán</span>
              <span className="text-2xl font-extrabold text-amber-600 block">{formatVND(trackedOrder.final_price)}</span>
            </div>
          </div>

          {/* Interactive visual progress wizard */}
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 z-0" />
            
            <div className="space-y-6 relative z-10">
              {/* STEP 1: PENDING */}
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                  ['PENDING', 'PAID', 'PREPARING', 'SHIPPING', 'COMPLETED'].includes(trackedOrder.status)
                    ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  📝
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Tiếp nhận đơn hàng</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Tiệm ăn vặt nhận thông tin và lập hóa đơn chờ xử lý.</p>
                  {trackedOrder.status === 'PENDING' && (
                    <span className="inline-block mt-2 bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                      ĐANG XỬ LÝ
                    </span>
                  )}
                </div>
              </div>

              {/* STEP 2: PREPARING */}
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                  ['PREPARING', 'SHIPPING', 'COMPLETED'].includes(trackedOrder.status)
                    ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  👨‍🍳
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-sans">Đang chuẩn bị chế biến</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Món ăn vặt thơm ngon đang được các đầu bếp chiên giòn và gói kín.</p>
                  {trackedOrder.status === 'PREPARING' && (
                    <span className="inline-block mt-2 bg-yellow-50 text-yellow-700 border border-yellow-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                      ĐANG LÀM MÓN
                    </span>
                  )}
                </div>
              </div>

              {/* STEP 3: SHIPPING */}
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                  ['SHIPPING', 'COMPLETED'].includes(trackedOrder.status)
                    ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  🛵
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Đang giao hàng siêu tốc</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Shipper đang trên đường vận chuyển đồ ăn nóng hổi tới tay bạn.</p>
                  {trackedOrder.status === 'SHIPPING' && (
                    <span className="inline-block mt-2 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                      ĐANG SHIP
                    </span>
                  )}
                </div>
              </div>

              {/* STEP 4: COMPLETED */}
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                  trackedOrder.status === 'COMPLETED'
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  🎉
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Giao hàng hoàn tất</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Cảm ơn bạn đã tin tưởng ủng hộ đồ ăn ngon của Tiệm Thủy Bùi!</p>
                  {trackedOrder.status === 'COMPLETED' && (
                    <span className="inline-block mt-2 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      THÀNH CÔNG
                    </span>
                  )}
                </div>
              </div>

              {/* EXCEPTION STEP: CANCELLED */}
              {trackedOrder.status === 'CANCELLED' && (
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full border-2 bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-500/20 flex items-center justify-center font-bold text-sm">
                    🚨
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-rose-600">Đơn hàng bị hủy bỏ</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Rất tiếc đơn hàng đã bị hủy. Hàng tồn kho của các sản phẩm đã được tự động hoàn lại.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order summary tables */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Chi tiết món đã đặt</h4>
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl">
              {trackedOrder.details?.map(d => (
                <div key={d.id} className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-600">{d.product.name} <span className="text-slate-400">x{d.quantity}</span></span>
                  <span className="text-slate-800">{formatVND(d.price_at_purchase * d.quantity)}</span>
                </div>
              ))}
              {trackedOrder.discount_applied > 0 && (
                <div className="flex justify-between items-center text-sm font-semibold text-emerald-600 pt-2 border-t border-slate-200">
                  <span>Voucher giảm giá</span>
                  <span>-{formatVND(trackedOrder.discount_applied)}</span>
                </div>
              )}
            </div>
            
            {/* Shipping details */}
            {trackedOrder.customer_name.includes('|') && (
              <div className="bg-amber-50/20 border border-amber-100/50 p-4 rounded-2xl text-xs sm:text-sm space-y-2">
                <div className="font-bold text-amber-950">Thông tin nhận hàng</div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Người nhận:</span> {trackedOrder.customer_name.split('|')[0]?.trim()}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Điện thoại:</span> {trackedOrder.customer_name.split('|')[1]?.trim()}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Địa chỉ:</span> {trackedOrder.customer_name.split('|')[2]?.trim()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
