import React from 'react';
import { SupportTicket } from '../../types';

interface AdminSupportProps {
  adminSupport: SupportTicket[];
  onOpenReplyModal: (ticket: SupportTicket) => void;
}

export const AdminSupport: React.FC<AdminSupportProps> = ({
  adminSupport,
  onOpenReplyModal,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-800">✉️ Hộp Thư Góp Ý & Tư Vấn Khách Hàng</h2>
        <p className="text-slate-400 text-xs font-semibold mt-1">
          Đọc và liên hệ hỗ trợ hoặc trả lời trực tiếp các câu hỏi gửi từ trang chủ của khách hàng.
        </p>
      </div>

      {/* Tickets list */}
      <div className="space-y-4">
        {adminSupport.map(ticket => (
          <div 
            key={ticket.id}
            className={`bg-white rounded-3xl border shadow-sm p-5 sm:p-6 space-y-4 transition-all hover:shadow-md ${
              ticket.status === 'PENDING' ? 'border-amber-200 bg-amber-50/10' : 'border-slate-100'
            }`}
          >
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                  Góp ý #{ticket.id} từ {ticket.customer_name}
                </span>
                <span className="text-slate-400 text-xs font-bold font-mono">
                  {new Date(ticket.created_at).toLocaleString('vi-VN')}
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                ticket.status === 'PENDING' 
                  ? 'bg-orange-50 text-orange-600 border-orange-200' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                {ticket.status === 'PENDING' ? 'Chờ trả lời' : 'Đã trả lời'}
              </span>
            </div>

            <div className="text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 p-4 rounded-2xl leading-relaxed">
              {ticket.message}
            </div>

            {ticket.reply && (
              <div className="bg-emerald-50/20 border border-emerald-100/50 p-4 rounded-2xl text-xs sm:text-sm space-y-1">
                <div className="font-bold text-emerald-950">Phản hồi của tiệm:</div>
                <div className="text-slate-600">{ticket.reply}</div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-50">
              <span className="text-slate-500">
                📞 SĐT liên hệ: <a href={`tel:${ticket.phone}`} className="text-amber-600 hover:underline">{ticket.phone}</a>
              </span>
              {ticket.status === 'PENDING' && (
                <button 
                  onClick={() => onOpenReplyModal(ticket)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs hover:bg-amber-600 shadow-sm shadow-amber-500/10 active:scale-95 transition-all"
                >
                  ✉️ Trả lời
                </button>
              )}
            </div>

          </div>
        ))}
        {adminSupport.length === 0 && (
          <div className="py-16 bg-white border border-slate-100 text-center rounded-3xl text-slate-400 text-sm font-semibold animate-fade-in">
            Chưa nhận được câu hỏi góp ý nào từ khách hàng
          </div>
        )}
      </div>

    </div>
  );
};
