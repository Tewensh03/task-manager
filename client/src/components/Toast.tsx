import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import type { ToastType } from '../types/task';

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm border border-gray-200
            ${isSuccess ? 'text-green-800' : 'text-red-800 '}`}
        >
            {isSuccess ? (
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-green-500" />
            ) : (
                <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
            )}
            <span className="flex-1">{message}</span>
            <button
                onClick={onClose}
                className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
            >
                <X size={14} />
            </button>
        </div>
    );
}
