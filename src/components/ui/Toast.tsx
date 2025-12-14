import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const toastConfig = {
    success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
};

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const config = toastConfig[type];
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%', scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.9 }}
                    className="fixed top-4 left-1/2 z-[9999] max-w-sm w-full"
                >
                    <div className={`flex items-start p-4 rounded-xl shadow-2xl border ${config.bg} ${config.border} backdrop-blur-sm`}>
                        <Icon className={`w-5 h-5 ${config.color} mt-0.5 flex-shrink-0`} />
                        <div className="ml-3 flex-1">
                            <h3 className={`text-sm font-medium ${config.color} capitalize`}>
                                {type === 'error' ? 'Error' : type}
                            </h3>
                            <p className="mt-1 text-sm text-gray-700">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`ml-3 inline-flex flex-shrink-0 p-1.5 rounded-full hover:bg-black/5 transition-colors ${config.color}`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
