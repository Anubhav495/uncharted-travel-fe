import React, { useState, useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitEmail: (email: string) => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({
    isOpen,
    onClose,
    onSubmitEmail,
}) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setEmail('');
            setError('');
            setIsSubmitting(false);
            // Focus input after modal animation
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        if (!email.trim()) {
            setError('Email address is required.');
            return;
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            onSubmitEmail(email);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div 
                className="bg-white w-full sm:w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-all duration-300 ease-out"
                role="dialog"
                aria-modal="true"
                aria-labelledby="waitlist-modal-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                    <h2 
                        id="waitlist-modal-title" 
                        className="text-xl sm:text-2xl font-bold text-gray-900"
                    >
                        Join Our Waitlist!
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <HiX className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                        Be the first to know when UnchartedTravel launches. Get exclusive updates and early access.
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label 
                                htmlFor="email-waitlist" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                ref={inputRef}
                                type="email"
                                id="email-waitlist"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                placeholder="you@example.com"
                                className={`w-full px-4 py-3 border rounded-xl text-base transition-colors ${
                                    error 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                } focus:outline-none focus:ring-2`}
                                required
                                disabled={isSubmitting}
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center text-base"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Notify Me'
                            )}
                        </button>
                    </form>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                        We respect your privacy. No spam, ever.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WaitlistModal;