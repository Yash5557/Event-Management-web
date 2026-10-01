import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-700 bg-slate-900/95 text-slate-100';
        let icon = <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />;

        if (toast.type === 'error') {
          borderClass = 'border-rose-500/80 bg-slate-900/95 text-rose-100 shadow-rose-950/40 shadow-lg';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/80 bg-slate-900/95 text-amber-100 shadow-amber-950/40 shadow-lg';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
        } else if (toast.type === 'success') {
          borderClass = 'border-emerald-500/80 bg-slate-900/95 text-emerald-100 shadow-emerald-950/40 shadow-lg';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 ${borderClass}`}
            role="alert"
          >
            {icon}
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-semibold tracking-tight text-white mb-0.5">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed break-words">
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-md"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
