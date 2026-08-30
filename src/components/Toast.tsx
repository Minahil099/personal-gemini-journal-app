import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-sm transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
                : isError
                ? 'bg-rose-900 text-rose-50 border-rose-700'
                : 'bg-stone-900 text-stone-50 border-stone-700'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs leading-relaxed font-medium">{toast.message}</div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-stone-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
