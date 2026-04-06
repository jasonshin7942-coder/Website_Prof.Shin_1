'use client';

import { useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;
let addToastGlobal: ((type: ToastType, message: string) => void) | null = null;

export function showToast(type: ToastType, message: string) {
  if (addToastGlobal) {
    addToastGlobal(type, message);
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 border text-sm font-medium shadow-lg animate-fade-in min-w-[280px] ${
            toast.type === 'success'
              ? 'bg-background border-success text-success'
              : toast.type === 'error'
              ? 'bg-background border-danger text-danger'
              : 'bg-background border-border text-foreground'
          }`}
        >
          <span className="mono-xs mr-2">
            {toast.type === 'success' ? '[OK]' : toast.type === 'error' ? '[ERR]' : '[i]'}
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
