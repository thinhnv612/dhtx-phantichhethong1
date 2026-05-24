import React from 'react';
import { Product } from '../../types';
import { formatVND, getProductAvatar } from '../../utils/helpers';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const av = getProductAvatar(product);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
        
        {/* Custom Glowing Food Avatar presentation */}
        <div className="h-56 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative overflow-hidden w-full">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center font-bold shadow-sm transition-all z-20">
            ✕
          </button>
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.fallback-avatar');
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
            />
          ) : null}
          <div className={`fallback-avatar absolute inset-0 flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
            <div className={`w-28 h-28 rounded-3xl ${av.bg} flex items-center justify-center text-6xl shadow-md transform rotate-3`}>
              {av.emoji}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border block w-fit ${
              product.type === 'READY_TO_EAT' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {product.type === 'READY_TO_EAT' ? '🍿 ĂN LIỀN' : '🧂 NGUYÊN LIỆU'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{product.name}</h2>
            <span className="text-2xl font-black text-amber-600 block">{formatVND(product.price)}</span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
            <p>
              {product.type === 'READY_TO_EAT'
                ? `Sản phẩm ${product.name} chế biến từ các nguyên liệu sạch sẽ nguyên chất tự nhiên, tẩm ướp gia vị mặn ngọt cay vừa phải giòn ngon khó cưỡng. Món quà vặt hảo vị tuyệt đỉnh dành cho các bạn trẻ nhâm nhi thưởng thức hàng ngày.`
                : `Nguyên liệu ${product.name.toLowerCase()} tươi mới được chọn lọc kỹ càng, đóng gói đảm bảo kín đáo, giữ trọn hương vị ban đầu. Thích hợp dùng làm bánh, trà sữa hoặc chế biến nhiều món ăn vặt độc đáo khác.`
              }
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center text-xs">
              <div>⚡ Khối lượng: <span className="font-bold text-slate-800">250 gram / túi</span></div>
              <div>📦 Tồn kho: <span className="font-bold text-slate-800">{product.stock_quantity} sản phẩm</span></div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button 
              onClick={() => { onAddToCart(product); onClose(); }}
              disabled={product.stock_quantity <= 0}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-xl text-center active:scale-95 shadow-md transition-all">
              {product.stock_quantity <= 0 ? 'Món đã hết hàng' : 'Thêm vào giỏ hàng ngay'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
