import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface StoreHomeProps {
  products: Product[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (filter: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const StoreHome: React.FC<StoreHomeProps> = ({
  products,
  searchQuery,
  onSearchQueryChange,
  categoryFilter,
  onCategoryFilterChange,
  onAddToCart,
  onSelectProduct,
}) => {
  // Filters for client Products list based on category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-white shadow-xl shadow-amber-500/10 py-10 px-6 sm:py-14 sm:px-12 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-4 md:max-w-xl text-center md:text-left">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 border border-white/30 backdrop-blur-sm tracking-wider uppercase">
            🎉 SIÊU HỘI ĂN VẶT
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
            Món Ngon Nhâm Nhi <br className="hidden sm:inline" /> Giao Hàng Tức Thì!
          </h1>
          <p className="text-amber-50 text-sm sm:text-base font-medium max-w-md drop-shadow">
            Tiệm đồ ăn vặt Thủy Bùi mang đến thiên đường đồ ăn liền giòn cay hấp dẫn cùng nguồn nguyên liệu pha chế chất lượng hàng đầu.
          </p>
          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
            <button 
              onClick={() => onCategoryFilterChange('Đồ ăn vặt')} 
              className="px-5 py-2.5 bg-white text-orange-600 font-bold rounded-2xl shadow-lg shadow-orange-700/10 hover:bg-orange-50 active:scale-95 transition-all text-sm"
            >
              🍿 Đồ Ăn Vặt
            </button>
            <button 
              onClick={() => onCategoryFilterChange('Đồ chế biến sẵn')} 
              className="px-5 py-2.5 bg-amber-950/20 border border-white/30 font-bold rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-sm"
            >
              🍳 Đồ Chế Biến Sẵn
            </button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="mt-8 md:mt-0 flex space-x-4 animate-pulse">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-4xl sm:text-5xl shadow-inner transform rotate-12">
            🍕
          </div>
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-lg transform -rotate-12">
            🥤
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-xl w-fit gap-1 border border-slate-200">
          {[
            { id: 'ALL', label: 'Tất cả món' },
            { id: 'Đồ ăn vặt', label: '🍿 Đồ ăn vặt' },
            { id: 'Các loại bánh', label: '🍰 Các loại bánh' },
            { id: 'Đồ chế biến sẵn', label: '🍳 Đồ chế biến sẵn' },
            { id: 'Ngũ cốc & mứt', label: '🌾 Ngũ cốc & mứt' },
            { id: 'Sữa', label: '🥛 Sữa' },
            { id: 'Nguyên vật liệu', label: '🧂 Nguyên liệu' },
          ].map(cat => (
            <button 
              key={cat.id}
              onClick={() => onCategoryFilterChange(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                categoryFilter === cat.id ? 'bg-white text-slate-800 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search box */}
        <div className="relative flex-1 max-w-md w-full">
          <input 
            type="text"
            placeholder="Tìm kiếm sản phẩm thơm ngon..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-slate-400 absolute left-3.5 top-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
          </svg>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <ProductCard 
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center space-y-3">
            <div className="text-5xl">🥺</div>
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-slate-500 text-sm">Thử thay đổi từ khóa tìm kiếm hoặc lọc danh mục khác xem sao nhé!</p>
          </div>
        )}
      </div>
    </div>
  );
};
