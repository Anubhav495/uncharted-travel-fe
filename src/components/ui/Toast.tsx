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
    success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-slate-900/95', border: 'border-emerald-500/40 shadow-emerald-500/10' },
    error: { icon: AlertCircle, color: 'text-rose-400', bg: 'bg-slate-900/95', border: 'border-rose-500/40 shadow-rose-500/10' },
    warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-slate-900/95', border: 'border-amber-500/40 shadow-amber-500/10' },
    info: { icon: Info, color: 'text-yellow-400', bg: 'bg-slate-900/95', border: 'border-yellow-400/40 shadow-yellow-400/10' },
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
                    initial={{ opacity: 0, y: -40, x: '-50%', scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.95 }}
                    className="fixed top-6 left-1/2 z-[9999] max-w-sm w-full px-4"
                >
                    <div className={`flex items-start p-4 shadow-2xl border ${config.bg} ${config.border} backdrop-blur-xl`}>
                        <div className="p-1.5 bg-slate-800/80 flex items-center justify-center flex-shrink-0">
                            <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                            <h3 className={`text-[11px] font-sans font-bold uppercase tracking-widest ${config.color}`}>
                                {type === 'error' ? 'Notice' : type}
                            </h3>
                            <p className="mt-1 text-xs font-sans text-slate-200 leading-snug">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-3 inline-flex flex-shrink-0 p-1 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
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
