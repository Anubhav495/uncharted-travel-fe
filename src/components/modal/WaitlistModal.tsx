import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap'; 

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitEmail: (email: string) => void;
    isLoading?: boolean;
    error?: string | null;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({
    isOpen,
    onClose,
    onSubmitEmail,
    isLoading = false,
    error: appError = null,
}) => {
    const [email, setEmail] = useState('');
    const [localError, setLocalError] = useState('');
    const snowContainerRef = useRef<HTMLDivElement | null>(null);
    const modalContentRef = useRef<HTMLDivElement | null>(null);

    const initSnow = useCallback(() => {
        const container = snowContainerRef.current;
        const modal = modalContentRef.current;
        if (!container || !modal) return;

        const modalWidth = modal.offsetWidth;
        const modalHeight = modal.offsetHeight;
        const numFlakes = 30;

        const animateFlake = (flake: HTMLElement) => {
            gsap.to(flake, {
                y: modalHeight + 20, x: `+=${gsap.utils.random(-25, 25)}`,
                rotation: gsap.utils.random(-270, 270), opacity: 0,
                duration: gsap.utils.random(4, 8), delay: gsap.utils.random(0, 4),
                ease: 'none',
                onComplete: () => {
                    if (snowContainerRef.current) { 
                        gsap.set(flake, {
                            x: gsap.utils.random(0, modalWidth), y: gsap.utils.random(-50, -20),
                            opacity: gsap.utils.random(0.3, 0.8), rotation: 0,
                        });
                        animateFlake(flake);
                    }
                }
            });
        };

        while (container.firstChild) {
            gsap.killTweensOf(container.firstChild);
            container.removeChild(container.firstChild);
        }
        
        for (let i = 0; i < numFlakes; i++) {
            const flake = document.createElement('span');
            flake.innerHTML = '❅';
            flake.style.position = 'absolute';
            // --- The Controlling Property: Color changed to an even darker gray ---
            flake.style.color = '#64748B'; // Tailwind's slate-500
            flake.style.fontSize = `${gsap.utils.random(10, 20)}px`;
            flake.style.userSelect = 'none';
            flake.style.pointerEvents = 'none';
            container.appendChild(flake);
            gsap.set(flake, {
                x: gsap.utils.random(0, modalWidth), y: gsap.utils.random(-modalHeight * 0.5, -20),
                opacity: gsap.utils.random(0.3, 0.8),
            });
            animateFlake(flake);
        }
    }, []); 

    useEffect(() => {
        if (isOpen && modalContentRef.current) {
            const timeoutId = setTimeout(() => {
                initSnow();
            }, 100); 

            return () => clearTimeout(timeoutId);
        }
    }, [isOpen, initSnow]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen || appError) {
            setLocalError('');
        }
    }, [isOpen, appError]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        if (!email.trim()) {
            setLocalError('Email address is required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setLocalError('Please enter a valid email address.');
            return;
        }
        setLocalError('');
        onSubmitEmail(email);
    };

    if (!isOpen) return null;
    const displayError = appError || localError;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                ref={modalContentRef}
                className="bg-sky-100 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md relative overflow-hidden"
                role="dialog" aria-modal="true" aria-labelledby="waitlist-modal-title"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 text-gray-400 hover:text-gray-600 text-2xl p-1 rounded-full"
                    aria-label="Close modal" disabled={isLoading}
                >
                    &times;
                </button>
                <div ref={snowContainerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden" />
                <div className="relative z-10">
                    <h2 id="waitlist-modal-title" className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Join Our Waitlist!
                    </h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Be the first to know when UnchartedTravel launches. Get exclusive updates and early access.
                    </p>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label htmlFor="email-waitlist" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email" id="email-waitlist" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className={`w-full px-4 py-2 border rounded-md shadow-sm sm:text-sm text-gray-900 placeholder-gray-400 ${
                                    displayError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                required aria-describedby={displayError ? "email-error" : undefined}
                                disabled={isLoading}
                            />
                            {displayError && ( <p id="email-error" className="text-red-500 text-xs mt-1">{displayError}</p> )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : ( 'Notify Me' )}
                        </button>
                    </form>
                    <p className="text-xs text-gray-700 mt-4 text-center">We respect your privacy. No spam, ever.</p>
                </div>
            </div>
        </div>
    );
};
export default WaitlistModal;