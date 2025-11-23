import React from 'react';
import { HiX } from 'react-icons/hi';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRetry: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, onRetry }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div 
                className="bg-white w-full max-w-md rounded-2xl shadow-xl transform transition-all duration-300 ease-out"
                role="dialog"
                aria-modal="true"
                aria-labelledby="error-modal-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 
                            id="error-modal-title" 
                            className="text-xl font-bold text-gray-900"
                        >
                            Oops! Something went wrong
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <HiX className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-12 w-12 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        
                        <p className="text-gray-600 text-base leading-relaxed">
                            We're having trouble processing your request right now. Please try again in a few moments.
                        </p>
                    </div> 
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;