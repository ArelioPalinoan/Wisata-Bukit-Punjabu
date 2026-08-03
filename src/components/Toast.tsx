'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];

export const showToast = (title: string, message?: string, type: 'success' | 'info' | 'error' = 'success') => {
  const toast: ToastMessage = {
    id: Date.now().toString(),
    type,
    title,
    message,
  };
  toastListeners.forEach((listener) => listener(toast));
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleAddToast = (toast: ToastMessage) => {
      setToasts((prev) => [...prev.slice(-2), toast]); // Max 3 toasts
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3500);
    };

    toastListeners.push(handleAddToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleAddToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-4 rounded-2xl bg-zinc-900/95 dark:bg-zinc-900/95 text-white border border-zinc-700/60 backdrop-blur-xl shadow-2xl animate-toast-in flex items-start gap-3"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          
          <div className="flex-1 text-xs">
            <p className="font-bold text-sm text-zinc-100">{toast.title}</p>
            {toast.message && <p className="text-zinc-300 mt-0.5">{toast.message}</p>}
          </div>

          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
