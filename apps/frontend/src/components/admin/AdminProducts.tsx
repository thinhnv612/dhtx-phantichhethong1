import React from 'react';
import { Product } from '../../types';
import { formatVND, getProductAvatar } from '../../utils/helpers';

interface AdminProductsProps {
  adminProducts: Product[];
  onOpenProductModal: (mode: 'create' | 'edit', data?: any) => void;
  onDeleteProduct: (id: number) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  adminProducts,
  onOpenProductModal,
  onDeleteProduct,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">🍟 Danh Sách Sản Phẩm Kinh Doanh</h2>
        <button 
          onClick={() => onOpenProductModal('create', { name: '', price: 10000, stock_quantity: 10, type: 'READY_TO_EAT', category: 'Đồ ăn vặt', image_url: '' })}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl flex items-center space-x-1 shadow-md active:scale-95 transition-all"
        >
          <span>+ Thêm Sản Phẩm</span>
        </button>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Tên món</th>
                <th className="px-6 py-4">Loại sản phẩm</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Đơn giá</th>
                <th className="px-6 py-4">Số lượng tồn</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
              {adminProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-mono">#{p.id}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">
                    <div className="flex items-center space-x-3">
                      {p.image_url ? (
                        <img 
                          src={p.image_url} 
                          alt={p.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                          {getProductAvatar(p).emoji}
                        </div>
                      )}
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      p.type === 'READY_TO_EAT' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {p.type === 'READY_TO_EAT' ? 'Ăn liền' : 'Nguyên liệu'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      {p.category || 'Đồ ăn vặt'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-amber-600">{formatVND(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                      p.stock_quantity <= 0 ? 'bg-rose-500' : p.stock_quantity < 5 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center space-x-2">
                    <button 
                      onClick={() => onOpenProductModal('edit', p)}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs active:scale-95 transition-all"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => onDeleteProduct(p.id)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs active:scale-95 transition-all"
                    >
                      Xóa
                    </button>
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
