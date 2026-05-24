import React from 'react';

export interface Toast {
  id: number;
  text: string;
  type: 'success' | 'info' | 'warn';
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`flex items-start p-4 rounded-xl shadow-xl border animate-slide-in text-sm font-medium ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
            toast.type === 'warn' ? 'bg-rose-50 text-rose-800 border-rose-200' :
            'bg-slate-900 text-white border-slate-800'
          }`}>
          <span className="mr-2">
            {toast.type === 'success' ? '✅' : toast.type === 'warn' ? '⚠️' : 'ℹ️'}
          </span>
          <div className="flex-1">{toast.text}</div>
          <button onClick={() => onRemoveToast(toast.id)} className="ml-2 hover:opacity-75">✕</button>
        </div>
      ))}
    </div>
  );
};
