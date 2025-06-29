import React, { useEffect } from 'react';
import { HiX, HiCheck } from 'react-icons/hi';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div 
                className="bg-white w-full sm:w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-all duration-300 ease-out"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmation-modal-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
                            <HiCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 
                            id="confirmation-modal-title" 
                            className="text-xl font-bold text-gray-900"
                        >
                            Welcome, Explorer!
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
                <div className="p-4 sm:p-6">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                        Thanks for joining the journey! We'll keep you updated and send your invite to the front of the line at launch.
                    </p>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-800 text-sm font-medium">
                            🎉 You're now on the waitlist! Check your email for confirmation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;