import React from 'react';

interface SupportFormProps {
  contactForm: { name: string; phone: string; message: string };
  onContactFormChange: (form: { name: string; phone: string; message: string }) => void;
  contactSuccess: boolean;
  onContactSuccessChange: (success: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SupportForm: React.FC<SupportFormProps> = ({
  contactForm,
  onContactFormChange,
  contactSuccess,
  onContactSuccessChange,
  onSubmit,
}) => {
  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">💬 Gửi Yêu Cầu Tư Vấn & Hỗ Trợ</h1>
        <p className="text-slate-500 text-sm sm:text-base font-medium">
          Bạn có câu hỏi về món ăn, giao hàng hoặc muốn hợp tác? Hãy gửi tin nhắn ngay, chủ tiệm sẽ phản hồi lại bạn sớm nhất!
        </p>
      </div>

      {contactSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-4 shadow-sm animate-fade-in">
          <div className="text-5xl">💌</div>
          <h2 className="text-xl font-bold text-emerald-950">Gửi Tin Nhắn Thành Công!</h2>
          <p className="text-emerald-800 text-sm font-medium">
            Cảm ơn ý kiến đóng góp quý báu của bạn. Đội ngũ nhân viên Thủy Bùi sẽ gọi điện tư vấn trực tiếp cho bạn qua số điện thoại đã cung cấp.
          </p>
          <button 
            onClick={() => onContactSuccessChange(false)}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl active:scale-95 transition-all text-sm">
            Gửi tiếp tin nhắn khác
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Họ và tên của bạn</label>
            <input 
              type="text"
              placeholder="Nguyễn Văn A..."
              value={contactForm.name}
              onChange={(e) => onContactFormChange({ ...contactForm, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Số điện thoại liên hệ</label>
            <input 
              type="tel"
              placeholder="Số điện thoại di động..."
              value={contactForm.phone}
              onChange={(e) => onContactFormChange({ ...contactForm, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Nội dung câu hỏi / Góp ý</label>
            <textarea 
              rows={4}
              placeholder="Viết thắc mắc hoặc yêu cầu tư vấn của bạn tại đây..."
              value={contactForm.message}
              onChange={(e) => onContactFormChange({ ...contactForm, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium transition-all resize-none"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl active:scale-95 shadow-lg shadow-amber-500/10 hover:shadow-xl transition-all">
            Gửi thư góp ý 🚀
          </button>
        </form>
      )}
    </div>
  );
};
