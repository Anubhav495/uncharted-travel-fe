import React, { useEffect } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose }) => {
    
    // This effect handles the auto-closing functionality and remains unchanged.
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose(); 
            }, 2000); 

            return () => {
                clearTimeout(timer);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 cursor-pointer"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md relative text-center cursor-default"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmation-modal-title"
            >
                {/* --- NEW: Explicit Close Button --- */}
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl p-1 rounded-full transition-colors duration-200"
                    aria-label="Close modal"
                >
                    &times;
                </button>
                
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                
                <h2 id="confirmation-modal-title" className="text-2xl font-semibold text-gray-800 mb-3">Welcome, Explorer!</h2>
                <p className="text-gray-600">
                    Thanks for joining the journey! We'll keep you updated and send your invite to the front of the line at launch.
                </p>
            </div>
        </div>
    );
};

export default ConfirmationModal;