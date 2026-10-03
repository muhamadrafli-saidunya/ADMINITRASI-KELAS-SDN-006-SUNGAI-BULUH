import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      <AnimatePresence>
        {toasts.map(toast => {
          let bg = 'bg-slate-900 text-white border-slate-700';
          let icon = <Info className="h-5 w-5 text-blue-400 shrink-0" />;

          if (toast.type === 'success') {
            bg = 'bg-emerald-900/95 text-emerald-100 border-emerald-600';
            icon = <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
          } else if (toast.type === 'error') {
            bg = 'bg-rose-900/95 text-rose-100 border-rose-600';
            icon = <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />;
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-900/95 text-amber-100 border-amber-600';
            icon = <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />;
          } else if (toast.type === 'info') {
            bg = 'bg-blue-900/95 text-blue-100 border-blue-600';
            icon = <Info className="h-5 w-5 text-blue-400 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md ${bg}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold leading-tight tracking-wide">{toast.title}</h4>
                <p className="text-xs text-slate-200/90 mt-0.5 leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-300 hover:text-white transition-colors p-0.5 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
