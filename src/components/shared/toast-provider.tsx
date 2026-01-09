"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface Toast {
    id: string;
    type: "success" | "error" | "info" | "warning";
    title: string;
    message?: string;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { ...toast, id }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    if (toasts.length === 0) return null;

    const getIcon = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "error":
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case "warning":
                return <AlertTriangle className="h-5 w-5 text-orange-500" />;
            case "info":
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBorderColor = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return "border-l-green-500";
            case "error":
                return "border-l-red-500";
            case "warning":
                return "border-l-orange-500";
            case "info":
                return "border-l-blue-500";
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-start gap-3 rounded-lg border border-l-4 bg-white p-4 shadow-lg animate-in slide-in-from-right-5 ${getBorderColor(toast.type)}`}
                >
                    {getIcon(toast.type)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{toast.title}</p>
                        {toast.message && (
                            <p className="text-sm text-slate-500">{toast.message}</p>
                        )}
                    </div>
                    <button
                        onClick={() => onRemove(toast.id)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
