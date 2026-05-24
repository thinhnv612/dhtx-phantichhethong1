import React from 'react';
import { Product, Voucher } from '../../types';
import { formatVND, getProductAvatar } from '../../utils/helpers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { product: Product; quantity: number }[];
  onUpdateCartQty: (productId: number, change: number) => void;
  checkoutStep: 'cart' | 'shipping' | 'success';
  onCheckoutStepChange: (step: 'cart' | 'shipping' | 'success') => void;
  voucherCode: string;
  onVoucherCodeChange: (code: string) => void;
  appliedVoucher: Voucher | null;
  voucherError: string;
  onValidateVoucher: () => void;
  shippingInfo: { name: string; phone: string; address: string };
  onShippingInfoChange: (info: { name: string; phone: string; address: string }) => void;
  orderMessage: string;
  createdOrderInfo: { id: number; finalPrice: number } | null;
  onSubmitCheckout: (e: React.FormEvent) => void;
  isOnline: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateCartQty,
  checkoutStep,
  onCheckoutStepChange,
  voucherCode,
  onVoucherCodeChange,
  appliedVoucher,
  voucherError,
  onValidateVoucher,
  shippingInfo,
  onShippingInfoChange,
  orderMessage,
  createdOrderInfo,
  onSubmitCheckout,
  isOnline,
}) => {
  if (!isOpen) return null;

  // Subtotal calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedVoucher ? Math.min(cartSubtotal, Number(appliedVoucher.discount_amount)) : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end animate-fade-in" id="cart-drawer-panel">
      {/* Overlay click to close */}
      <div className="absolute inset-0 z-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/30">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
            <span>🛒 Giỏ Hàng Mua Sắm</span>
            {cart.length > 0 && (
              <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} món
              </span>
            )}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center font-bold">✕</button>
        </div>

        {/* Drawer Body Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {checkoutStep === 'cart' && (
            /* Step 1: List items and apply vouchers */
            <div className="space-y-6">
              {cart.length > 0 ? (
                <>
                  {/* Cart List */}
                  <div className="space-y-4">
                    {cart.map(item => {
                      const av = getProductAvatar(item.product);
                      return (
                        <div key={item.product.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div className={`w-12 h-12 rounded-xl ${av.bg} flex items-center justify-center text-2xl shadow-sm mr-3`}>
                            {av.emoji}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-extrabold text-slate-800 text-sm line-clamp-1">{item.product.name}</h4>
                            <span className="text-amber-600 text-xs font-bold block">{formatVND(item.product.price)}</span>
                          </div>
                          {/* Quantity adjustments */}
                          <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-inner">
                            <button onClick={() => onUpdateCartQty(item.product.id, -1)} className="text-slate-500 font-bold hover:text-slate-800">-</button>
                            <span className="text-xs font-extrabold text-slate-800 px-1">{item.quantity}</span>
                            <button onClick={() => onUpdateCartQty(item.product.id, 1)} className="text-slate-500 font-bold hover:text-slate-800">+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coupon validation form */}
                  <div className="border-t border-slate-100 pt-5 space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mã giảm giá (Voucher)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Nhập voucher ví dụ: ANVAT5K..."
                        value={voucherCode}
                        onChange={(e) => onVoucherCodeChange(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                        disabled={!isOnline}
                      />
                      <button 
                        onClick={onValidateVoucher}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all"
                        disabled={!isOnline}
                      >
                        Áp dụng
                      </button>
                    </div>
                    {!isOnline && (
                      <p className="text-[10px] text-rose-500 font-semibold">⚠️ Cần kết nối Internet để áp dụng mã giảm giá.</p>
                    )}
                    {voucherError && <p className="text-xs text-rose-600 font-bold animate-shake">{voucherError}</p>}
                    {appliedVoucher && (
                      <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-scale-up">
                        <span>🎉 Đã áp dụng giảm {formatVND(appliedVoucher.discount_amount)}</span>
                        <span className="text-[10px] uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">{appliedVoucher.code}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="text-5xl">🛒</div>
                  <h4 className="text-slate-800 font-bold">Giỏ hàng của bạn đang trống</h4>
                  <p className="text-slate-400 text-xs">Hãy dạo quanh tiệm và chọn những món ăn vặt giòn ngon hấp dẫn nhé!</p>
                </div>
              )}
            </div>
          )}

          {checkoutStep === 'shipping' && (
            /* Step 2: Shipping Form */
            <form onSubmit={onSubmitCheckout} className="space-y-4">
              <h4 className="font-extrabold text-slate-800 text-sm sm:text-base border-b border-slate-100 pb-2">📦 THÔNG TIN GIAO HÀNG</h4>
              
              {orderMessage && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-bold animate-shake">
                  ❌ {orderMessage}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Họ tên người nhận</label>
                <input 
                  type="text"
                  placeholder="Nguyễn Văn A..."
                  value={shippingInfo.name}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Số điện thoại</label>
                <input 
                  type="tel"
                  placeholder="09xxxxxxxx..."
                  value={shippingInfo.phone}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Địa chỉ nhận hàng</label>
                <input 
                  type="text"
                  placeholder="Số nhà, Tên đường, Quận, Hà Nội..."
                  value={shippingInfo.address}
                  onChange={(e) => onShippingInfoChange({ ...shippingInfo, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                  required
                />
              </div>

              <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-100/50 space-y-2 mt-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Tạm tính giỏ hàng:</span>
                  <span>{formatVND(cartSubtotal)}</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-600">
                    <span>Mã giảm giá:</span>
                    <span>-{formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-black text-slate-900 border-t border-slate-200/50 pt-2">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-amber-600">{formatVND(cartTotal)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => onCheckoutStepChange('cart')}
                  className="w-1/3 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold text-xs rounded-xl active:scale-95 transition-all text-center"
                >
                  Quay lại
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl active:scale-95 shadow-md shadow-amber-500/10 transition-all text-center"
                >
                  Xác nhận đặt hàng 🚀
                </button>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && createdOrderInfo && (
            /* Step 3: Success */
            <div className="py-8 text-center space-y-5 animate-scale-up">
              <div className="text-6xl">🎉</div>
              <h3 className="text-xl font-extrabold text-emerald-950">Đặt Hàng Thành Công!</h3>
              
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mã số đơn hàng của bạn</div>
                <div className="text-3xl font-black text-amber-600 select-all" title="Click để copy">#{createdOrderInfo.id}</div>
                <div className="text-[10px] text-slate-400 font-bold">Hãy lưu lại mã số này để sử dụng tính năng "Theo dõi đơn hàng".</div>
              </div>

              <div className="text-sm font-semibold text-slate-600 px-4 leading-relaxed">
                Đơn hàng trị giá <strong className="text-slate-900">{formatVND(createdOrderInfo.finalPrice)}</strong> đang được hệ thống chuyển xuống bộ phận bếp để chuẩn bị làm món.
              </div>

              <button 
                onClick={() => {
                  onCheckoutStepChange('cart');
                  onClose();
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl active:scale-95 shadow-lg transition-all"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          )}

        </div>

        {/* Drawer Footer (Only visible in cart step) */}
        {checkoutStep === 'cart' && cart.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Tạm tính món ăn</span>
                <span>{formatVND(cartSubtotal)}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between items-center text-xs font-bold text-emerald-600">
                  <span>Voucher giảm giá</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 border-t border-slate-200/50 pt-2">
                <span>Tổng giá trị đơn:</span>
                <span className="text-amber-600 text-base">{formatVND(cartTotal)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => onCheckoutStepChange('shipping')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl active:scale-95 shadow-lg shadow-amber-500/10 hover:shadow-xl transition-all"
            >
              Tiến hành thanh toán
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
