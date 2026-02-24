"use client";

import * as React from "react";

type ToastState = { message: string } | null;

const ToastCtx = React.createContext<{
  toast: ToastState;
  show: (message: string) => void;
}>({ toast: null, show: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastState>(null);

  const show = (message: string) => {
    setToast({ message });
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <ToastCtx.Provider value={{ toast, show }}>
      {children}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-2xl border border-[var(--line)] bg-white/90 backdrop-blur px-4 py-3 shadow-sm fade-in">
            <div className="text-sm font-semibold text-[var(--ink)]">{toast.message}</div>
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastCtx);
}