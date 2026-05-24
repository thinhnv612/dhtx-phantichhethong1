import React from 'react';
import { Product, Voucher, SupportTicket } from '../../types';

interface AdminModalsProps {
  // Product Modal
  productCrudModal: { open: boolean; mode: 'create' | 'edit'; data?: Partial<Product> };
  setProductCrudModal: React.Dispatch<React.SetStateAction<{ open: boolean; mode: 'create' | 'edit'; data?: Partial<Product> }>>;
  saveProductCrud: (e: React.FormEvent) => void;

  // Voucher Modal
  voucherCrudModal: { open: boolean; data?: Partial<Voucher> };
  setVoucherCrudModal: React.Dispatch<React.SetStateAction<{ open: boolean; data?: Partial<Voucher> }>>;
  saveVoucherCrud: (e: React.FormEvent) => void;

  // Staff Modal
  staffCrudModal: { open: boolean; data?: { username: string; password?: string; role: 'ADMIN' | 'STAFF' } };
  setStaffCrudModal: React.Dispatch<React.SetStateAction<{ open: boolean; data?: { username: string; password?: string; role: 'ADMIN' | 'STAFF' } }>>;
  saveStaffCrud: (e: React.FormEvent) => void;

  // Stock Import Modal
  importStockModal: { open: boolean; product_id: number; quantity: number };
  setImportStockModal: React.Dispatch<React.SetStateAction<{ open: boolean; product_id: number; quantity: number }>>;
  handleStockImport: (e: React.FormEvent) => void;
  adminProducts: Product[];

  // Support Reply Modal
  replySupportModal: { open: boolean; ticket?: SupportTicket; text: string };
  setReplySupportModal: React.Dispatch<React.SetStateAction<{ open: boolean; ticket?: SupportTicket; text: string }>>;
  handleSupportReply: (e: React.FormEvent) => void;
}

export const AdminModals: React.FC<AdminModalsProps> = ({
  productCrudModal,
  setProductCrudModal,
  saveProductCrud,

  voucherCrudModal,
  setVoucherCrudModal,
  saveVoucherCrud,

  staffCrudModal,
  setStaffCrudModal,
  saveStaffCrud,

  importStockModal,
  setImportStockModal,
  handleStockImport,
  adminProducts,

  replySupportModal,
  setReplySupportModal,
  handleSupportReply,
}) => {
  return (
    <>
      {/* DIALOG A: PRODUCT CREATE/EDIT */}
      {productCrudModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-5 animate-scale-up">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
              {productCrudModal.mode === 'create' ? '🍟 Tạo Mới Sản Phẩm' : '🍟 Chỉnh Sửa Sản Phẩm'}
            </h3>

            <form onSubmit={saveProductCrud} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tên sản phẩm</label>
                <input 
                  type="text"
                  placeholder="Ví dụ: Bánh Tráng Trộn..."
                  value={productCrudModal.data?.name || ''}
                  onChange={(e) => setProductCrudModal({ ...productCrudModal, data: { ...productCrudModal.data, name: e.target.value } as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Ảnh sản phẩm (Link URL)</label>
                <input 
                  type="url"
                  placeholder="Nhập đường dẫn ảnh (https://...)"
                  value={productCrudModal.data?.image_url || ''}
                  onChange={(e) => setProductCrudModal({ ...productCrudModal, data: { ...productCrudModal.data, image_url: e.target.value } as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {productCrudModal.data?.image_url && (
                <div className="mt-2 flex items-center justify-center bg-slate-50 p-2 rounded-2xl border border-slate-100 relative overflow-hidden h-28 w-full">
                  <img 
                    src={productCrudModal.data.image_url} 
                    alt="Live Preview" 
                    className="max-h-full max-w-full rounded-xl object-contain shadow-xs"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23f43f5e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='9' y1='9' x2='15' y2='15'/%3E%3Cline x1='15' y1='9' x2='9' y2='15'/%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute bottom-1 right-2 bg-slate-950/60 backdrop-blur-xs text-[9px] font-bold text-white px-2 py-0.5 rounded-full">
                    Xem trước ảnh
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Đơn giá (VNĐ)</label>
                  <input 
                    type="number"
                    min="0"
                    value={productCrudModal.data?.price || 0}
                    onChange={(e) => setProductCrudModal({ ...productCrudModal, data: { ...productCrudModal.data, price: Number(e.target.value) } as any })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Số lượng ban đầu</label>
                  <input 
                    type="number"
                    min="0"
                    value={productCrudModal.data?.stock_quantity || 0}
                    onChange={(e) => setProductCrudModal({ ...productCrudModal, data: { ...productCrudModal.data, stock_quantity: Number(e.target.value) } as any })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Loại danh mục (Nhóm kho)</label>
                <select 
                  value={productCrudModal.data?.type || 'READY_TO_EAT'}
                  onChange={(e) => {
                    const nextType = e.target.value as 'READY_TO_EAT' | 'RAW_MATERIAL';
                    const nextCat = nextType === 'RAW_MATERIAL' ? 'Nguyên vật liệu' : 'Đồ ăn vặt';
                    setProductCrudModal({ 
                      ...productCrudModal, 
                      data: { ...productCrudModal.data, type: nextType, category: nextCat } as any 
                    });
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value="READY_TO_EAT">🍿 Đồ ăn sẵn bán lẻ</option>
                  <option value="RAW_MATERIAL">🧂 Nguyên liệu thô (Kho)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Danh mục chi tiết</label>
                <select 
                  value={productCrudModal.data?.category || 'Đồ ăn vặt'}
                  onChange={(e) => setProductCrudModal({ ...productCrudModal, data: { ...productCrudModal.data, category: e.target.value } as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value="Đồ ăn vặt">🍿 Đồ ăn vặt</option>
                  <option value="Các loại bánh">🍰 Các loại bánh</option>
                  <option value="Đồ chế biến sẵn">🍳 Đồ chế biến sẵn</option>
                  <option value="Ngũ cốc & mứt">🌾 Ngũ cốc & mứt</option>
                  <option value="Sữa">🥛 Sữa</option>
                  <option value="Nguyên vật liệu">🧂 Nguyên vật liệu</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button type="submit" className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm active:scale-95 transition-all">Lưu lại</button>
                <button type="button" onClick={() => setProductCrudModal({ open: false, mode: 'create' })} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm active:scale-95 transition-all">Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG B: VOUCHER CREATE */}
      {voucherCrudModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-5 animate-scale-up">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
              🏷️ Tạo Mới Voucher Giảm Giá
            </h3>

            <form onSubmit={saveVoucherCrud} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Mã giảm giá (CODE)</label>
                <input 
                  type="text"
                  placeholder="Ví dụ: ANVAT20K..."
                  value={voucherCrudModal.data?.code || ''}
                  onChange={(e) => setVoucherCrudModal({ ...voucherCrudModal, data: { ...voucherCrudModal.data, code: e.target.value.toUpperCase() } as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Số tiền giảm (VNĐ)</label>
                  <input 
                    type="number"
                    min="1000"
                    value={voucherCrudModal.data?.discount_amount || 0}
                    onChange={(e) => setVoucherCrudModal({ ...voucherCrudModal, data: { ...voucherCrudModal.data, discount_amount: Number(e.target.value) } as any })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Đơn tối thiểu (VNĐ)</label>
                  <input 
                    type="number"
                    min="0"
                    value={voucherCrudModal.data?.min_order_value || 0}
                    onChange={(e) => setVoucherCrudModal({ ...voucherCrudModal, data: { ...voucherCrudModal.data, min_order_value: Number(e.target.value) } as any })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tổng số lượt sử dụng tối đa</label>
                <input 
                  type="number"
                  min="1"
                  value={voucherCrudModal.data?.usage_limit || 0}
                  onChange={(e) => setVoucherCrudModal({ ...voucherCrudModal, data: { ...voucherCrudModal.data, usage_limit: Number(e.target.value) } as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button type="submit" className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm active:scale-95 transition-all">Lưu lại</button>
                <button type="button" onClick={() => setVoucherCrudModal({ open: false })} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm active:scale-95 transition-all">Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG C: STAFF REGISTRATION */}
      {staffCrudModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-5 animate-scale-up">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
              👥 Đăng Ký Tài Khoản Nhân Viên
            </h3>

            <form onSubmit={saveStaffCrud} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tên đăng nhập</label>
                <input 
                  type="text"
                  placeholder="Ví dụ: hoangnv..."
                  value={staffCrudModal.data?.username || ''}
                  onChange={(e) => setStaffCrudModal({ ...staffCrudModal, data: { ...staffCrudModal.data, username: e.target.value.toLowerCase() } as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Mật khẩu ban đầu</label>
                <input 
                  type="password"
                  placeholder="Nhập mật khẩu cho nhân viên..."
                  value={staffCrudModal.data?.password || ''}
                  onChange={(e) => setStaffCrudModal({ ...staffCrudModal, data: { ...staffCrudModal.data, password: e.target.value } as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Vai trò (Phân quyền)</label>
                <select 
                  value={staffCrudModal.data?.role || 'STAFF'}
                  onChange={(e) => setStaffCrudModal({ ...staffCrudModal, data: { ...staffCrudModal.data, role: e.target.value } as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value="STAFF">STAFF (Nhân viên đứng quầy)</option>
                  <option value="ADMIN">ADMIN (Chủ cửa hàng)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button type="submit" className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm active:scale-95 transition-all">Tạo tài khoản</button>
                <button type="button" onClick={() => setStaffCrudModal({ open: false })} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm active:scale-95 transition-all">Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG D: INVENTORY STOCK IMPORT */}
      {importStockModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-5 animate-scale-up">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
              📦 Nhập Hàng Vào Kho Tồn
            </h3>

            <form onSubmit={handleStockImport} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Chọn sản phẩm cần nhập</label>
                <select 
                  value={importStockModal.product_id}
                  onChange={(e) => setImportStockModal({ ...importStockModal, product_id: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value={0} disabled>-- Chọn sản phẩm --</option>
                  {adminProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Tồn hiện tại: {p.stock_quantity})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Số lượng nhập thêm</label>
                <input 
                  type="number"
                  min="1"
                  value={importStockModal.quantity}
                  onChange={(e) => setImportStockModal({ ...importStockModal, quantity: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button type="submit" className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm active:scale-95 transition-all">Nhập kho 🚀</button>
                <button type="button" onClick={() => setImportStockModal({ open: false, product_id: 0, quantity: 10 })} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm active:scale-95 transition-all">Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG E: SUPPORT MESSAGE REPLY */}
      {replySupportModal.open && replySupportModal.ticket && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-5 animate-scale-up">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
              ✉️ Trả Lời Góp Ý #{replySupportModal.ticket.id}
            </h3>

            <div className="text-slate-500 text-xs bg-slate-50 p-4 rounded-2xl">
              <div className="font-bold text-slate-700">Khách hàng: {replySupportModal.ticket.customer_name}</div>
              <div className="mt-1 leading-relaxed">"{replySupportModal.ticket.message}"</div>
            </div>

            <form onSubmit={handleSupportReply} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Viết tin nhắn phản hồi</label>
                <textarea 
                  rows={4}
                  placeholder="Chào bạn, Tiệm ăn vặt xin chân thành cảm ơn ý kiến và xin phản hồi..."
                  value={replySupportModal.text}
                  onChange={(e) => setReplySupportModal({ ...replySupportModal, text: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button type="submit" className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm active:scale-95 transition-all">Gửi phản hồi</button>
                <button type="button" onClick={() => setReplySupportModal({ open: false, text: '' })} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm active:scale-95 transition-all">Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
