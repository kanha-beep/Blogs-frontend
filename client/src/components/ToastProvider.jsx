"use client";

import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = ({ title = "Error", message = "Something went wrong", type = "error" }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, title, message, type }]);
    window.setTimeout(() => removeToast(id), 4000);
  };

  const value = useMemo(() => ({ showToast, removeToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-[24px] border px-4 py-3 shadow-[0_18px_40px_rgba(115,120,72,0.18)] backdrop-blur-xl ${
              toast.type === "error"
                ? "border-[#efc2b3] bg-[rgba(255,245,239,0.96)]"
                : "border-[#cde3b2] bg-[rgba(247,253,238,0.96)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#42503d]">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-full border border-[#dbe6b8] px-2 py-1 text-xs text-[#465240] transition hover:bg-[#f4efcf]"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
