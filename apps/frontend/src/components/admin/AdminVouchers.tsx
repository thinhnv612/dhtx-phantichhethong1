import React from 'react';
import { Voucher } from '../../types';
import { formatVND } from '../../utils/helpers';

interface AdminVouchersProps {
  adminVouchers: Voucher[];
  onOpenVoucherModal: (data?: any) => void;
  onDeleteVoucher: (id: number) => void;
}

export const AdminVouchers: React.FC<AdminVouchersProps> = ({
  adminVouchers,
  onOpenVoucherModal,
  onDeleteVoucher,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">🏷️ Quản Lý Phiếu Giảm Giá (Vouchers)</h2>
        <button 
          onClick={() => onOpenVoucherModal({ code: '', discount_amount: 5000, min_order_value: 20000, usage_limit: 100 })}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl flex items-center space-x-1 shadow-md active:scale-95 transition-all"
        >
          <span>+ Thêm Voucher</span>
        </button>
      </div>

      {/* Vouchers lists */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-4">Mã CODE</th>
                <th className="px-6 py-4">Số tiền giảm</th>
                <th className="px-6 py-4">Đơn tối thiểu</th>
                <th className="px-6 py-4">Giới hạn dùng</th>
                <th className="px-6 py-4">Đã sử dụng</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
              {adminVouchers.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-amber-600">{v.code}</td>
                  <td className="px-6 py-4 text-emerald-600">{formatVND(v.discount_amount)}</td>
                  <td className="px-6 py-4 text-slate-600">{formatVND(v.min_order_value)}</td>
                  <td className="px-6 py-4 font-mono">{v.usage_limit} lượt</td>
                  <td className="px-6 py-4 font-mono">{v.used_count} lượt</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDeleteVoucher(v.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs active:scale-95 transition-all"
                    >
                      Xóa bỏ
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
