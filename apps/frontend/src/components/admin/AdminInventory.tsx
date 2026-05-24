import React from 'react';
import { Product, InventoryLog } from '../../types';

interface AdminInventoryProps {
  adminProducts: Product[];
  adminInventoryLogs: InventoryLog[];
  onOpenImportModal: () => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  adminProducts,
  adminInventoryLogs,
  onOpenImportModal,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Inventory Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">📦 Quản Lý Kho & Nhập Hàng Tồn</h2>
        <button 
          onClick={onOpenImportModal}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl flex items-center space-x-1 shadow-md active:scale-95 transition-all"
        >
          <span>📦 Nhập Hàng Tồn</span>
        </button>
      </div>

      {/* Stock list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {adminProducts.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm line-clamp-1">{p.name}</h4>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider block">
                {p.type === 'READY_TO_EAT' ? 'Ăn liền' : 'Nguyên liệu'}
              </span>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1.5 rounded-2xl text-xs font-extrabold text-white ${
                p.stock_quantity <= 0 ? 'bg-rose-500' : p.stock_quantity < 5 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}>
                {p.stock_quantity} cái
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Historical logs */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base uppercase tracking-wider">Lịch sử Nhập / Xuất Kho</h3>
        
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Tên sản phẩm</th>
                  <th className="px-6 py-4">Phân loại</th>
                  <th className="px-6 py-4">Biến động kho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
                {adminInventoryLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {new Date(l.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-950">{l.product?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        l.transaction_type === 'IMPORT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        l.transaction_type === 'SALE' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {l.transaction_type === 'IMPORT' ? 'Nhập hàng' : l.transaction_type === 'SALE' ? 'Bán hàng' : 'Điều chỉnh'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-extrabold ${l.quantity_change > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {l.quantity_change > 0 ? `+${l.quantity_change}` : l.quantity_change}
                      </span>
                    </td>
                  </tr>
                ))}
                {adminInventoryLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 text-sm font-semibold">
                      Chưa có giao dịch biến động kho nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
