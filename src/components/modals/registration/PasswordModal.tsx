import React, { useState, useEffect, useRef } from 'react';
import { HiX, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string) => void;
    isSubmitting?: boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false
}) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setConfirmPassword('');
            setShowPassword(false);
            setShowConfirmPassword(false);
            setError('');
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            setError('Password is required');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        onSubmit(password);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <HiLockClosed className="text-yellow-400" />
                        Secure Your Account
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-400 mb-6 text-sm">
                        Please set a strong password to complete your guide registration.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Create Password
                            </label>
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className={`w-full bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-3 pr-12 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError('');
                                    }}
                                    className={`w-full bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-3 pr-12 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {error && (
                                <p className="text-red-500 text-xs mt-2">{error}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Must be at least 8 characters long.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-400/50 text-gray-900 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Confirm & Register'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;
