import React from 'react';
import { Product } from '../../types';
import { formatVND, getProductAvatar } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onSelectProduct }) => {
  const av = getProductAvatar(product);
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 bg-slate-50 overflow-hidden flex items-center justify-center border-b border-slate-50 w-full">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

        {/* Fallback & decorative elements (visible if no image_url or if image fails to load) */}
        <div className={`fallback-avatar absolute inset-0 flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
          <div className="absolute w-36 h-36 rounded-full bg-amber-50 group-hover:scale-125 transition-transform duration-300" />
          <div className={`relative z-10 w-24 h-24 rounded-3xl ${av.bg} flex items-center justify-center text-5xl shadow-md transform group-hover:rotate-6 transition-all duration-300`}>
            {av.emoji}
          </div>
        </div>
        
        {/* Type Pill */}
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold border ${
          product.type === 'READY_TO_EAT' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          {product.type === 'READY_TO_EAT' ? '🍿 ĂN LIỀN' : '🧂 NGUYÊN LIỆU'}
        </span>

        {/* Stock Indicator */}
        {isOutOfStock ? (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
            HẾT HÀNG
          </span>
        ) : product.stock_quantity < 5 ? (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
            CHỈ CÒN {product.stock_quantity}
          </span>
        ) : (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">
            CÒN {product.stock_quantity} KHO
          </span>
        )}
      </div>

      {/* Info Body */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed">
            {product.type === 'READY_TO_EAT' 
              ? `${product.name} giòn béo thơm ngon đậm đà chuẩn vị đồ ăn vặt nhà làm, món khoái khẩu lý tưởng cho buổi trà chiều.`
              : `Nguồn nguyên liệu ${product.name.toLowerCase()} hảo hạng nguyên chất giúp các đầu bếp pha chế làm ra món ngon hảo vị tuyệt mỹ.`
            }
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đơn giá</span>
            <span className="text-xl font-extrabold text-amber-600">{formatVND(product.price)}</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => onSelectProduct(product)}
              className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-xl transition-all"
              title="Xem chi tiết">
              🔎
            </button>
            <button 
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-1 shadow-sm active:scale-95 transition-all text-sm ${
                isOutOfStock 
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/10'
              }`}>
              <span>Mua</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
