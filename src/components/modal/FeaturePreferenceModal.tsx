import React, { useState, useEffect, useRef } from 'react';

export interface FeaturePreferences {
    [key: string]: boolean;
}

interface FeaturePreferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitPreferences: (preferences: FeaturePreferences) => void;
    isLoading?: boolean;
    // The `error` prop is no longer needed with the silent failure approach
    error?: string | null; 
}

const FEATURES_LIST = [
    { id: 'verifiedReviews', label: 'Verified Reviews & Ratings for Guides' },
    { id: 'directMessaging', label: 'Direct Messaging with Guides Before Booking' },
    { id: 'customTours', label: 'Ability to Request Custom-Built Tours' },
    { id: 'interestTags', label: 'Search for Guides by Interest (e.g., "Food", "History", "Art")' },
    { id: 'destinationDiscovery', label: 'AI-Powered Destination Discovery' },
    { id: 'offlineAccess', label: 'Offline Access to Plans & Maps' },
    { id: 'instantBook', label: 'Instantly Book Pre-Defined Tours & Times' },
    { id: 'groupBooking', label: 'Easy Booking for My Private Group (Family, Friends)' },
];

const generateInitialPrefs = (): FeaturePreferences => 
    FEATURES_LIST.reduce((acc, feature) => ({ ...acc, [feature.id]: false }), {} as FeaturePreferences);

const FeaturePreferenceModal: React.FC<FeaturePreferenceModalProps> = ({
    isOpen,
    onClose,
    onSubmitPreferences,
    isLoading = false,
}) => {
    const [preferences, setPreferences] = useState<FeaturePreferences>(generateInitialPrefs());
    const [localError, setLocalError] = useState<string>('');
    const modalContentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isLoading) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node) && !isLoading) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, isLoading]);

    useEffect(() => {
        if (isOpen) { 
            setLocalError('');
            setPreferences(generateInitialPrefs());
        }
    }, [isOpen]);

    const handleCheckboxChange = (featureId: string) => {
        setPreferences(prev => ({ ...prev, [featureId]: !prev[featureId] }));
        if (localError) setLocalError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        const selectedCount = Object.values(preferences).filter(Boolean).length;
        if (selectedCount === 0) {
            setLocalError('Please select at least one feature you are interested in.');
            return;
        }
        setLocalError('');
        onSubmitPreferences(preferences);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                ref={modalContentRef}
                className="bg-sky-100 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg relative"
                role="dialog"
                aria-modal="true"
                aria-labelledby="feature-modal-title-multi"
                aria-describedby={localError ? "feature-error-multi" : undefined}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 text-gray-400 hover:text-gray-600 text-2xl p-1 rounded-full"
                    aria-label="Close modal"
                    disabled={isLoading}
                >
                    &times;
                </button>
                <div className="relative z-10">
                    <h2 id="feature-modal-title-multi" className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                        Help Us Shape UnchartedTravel!
                    </h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Which features are you most excited about? Select all that apply.
                    </p>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-2">
                            {FEATURES_LIST.map((feature) => (
                                <label
                                    key={feature.id}
                                    htmlFor={`feature-multi-${feature.id}`}
                                    className={`flex items-center p-3 rounded-md cursor-pointer transition-colors border ${
                                        preferences[feature.id]
                                            ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                                            : 'bg-white hover:bg-sky-50 border-gray-200'
                                    } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        id={`feature-multi-${feature.id}`}
                                        checked={preferences[feature.id] || false}
                                        onChange={() => handleCheckboxChange(feature.id)}
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                        disabled={isLoading}
                                    />
                                    <span className={`ml-3 text-sm font-medium ${preferences[feature.id] ? 'text-blue-700' : 'text-gray-700'}`}>
                                        {feature.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {localError && (
                            <p id="feature-error-multi" className="text-red-500 text-xs mt-1 mb-3 text-center">{localError}</p>
                        )}
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
                                    Submitting...
                                </>
                            ) : (
                                'Submit Preferences'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default FeaturePreferenceModal;