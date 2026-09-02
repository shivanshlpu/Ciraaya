'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

/* ─── Types ───────────────────────────────────────── */
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

/* ─── Minimal Luxury Toast Item ───────────────────── */
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const iconConfig = {
    success: {
      symbol: '✓',
      bg: 'bg-[#EFF8F2]',
      color: 'text-[#2A7A4C]',
      border: 'border-[#C4E3CE]',
    },
    error: {
      symbol: '✕',
      bg: 'bg-[#FDEDEC]',
      color: 'text-[#C53030]',
      border: 'border-[#F5C2C0]',
    },
    info: {
      symbol: '✦',
      bg: 'bg-[#FBF7EE]',
      color: 'text-[#9E7B32]',
      border: 'border-[#E8D5AA]',
    },
  }[toast.type];

  return (
    <div
      role="alert"
      className={`
        bg-[#18181B] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10
        flex items-center gap-3 min-w-[280px] max-w-[420px] transition-all duration-300
        ${toast.exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}
    >
      {/* Accent Circle Icon */}
      <span
        className={`
          w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border
          ${iconConfig.bg} ${iconConfig.color} ${iconConfig.border}
        `}
      >
        {iconConfig.symbol}
      </span>

      {/* Crystal Clear White Text */}
      <p className="text-xs font-medium text-white leading-snug flex-1">
        {toast.message}
      </p>

      {/* Dismiss Button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="w-6 h-6 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0 text-xs cursor-pointer"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

/* ─── Provider ────────────────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container — top-right with high z-index */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
