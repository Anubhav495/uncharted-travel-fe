import React, { useState, useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';
import { FeaturePreferences } from '../../../types';

interface FeaturePreferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitPreferences: (preferences: FeaturePreferences) => void;
    isLoading?: boolean;
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

const FeaturePreferenceModal: React.FC<FeaturePreferenceModalProps> = ({
    isOpen,
    onClose,
    onSubmitPreferences,
    isLoading = false,
}) => {
    const [preferences, setPreferences] = useState<FeaturePreferences>({});
    const [error, setError] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPreferences({});
            setError('');
        }
    }, [isOpen]);

    const handleCheckboxChange = (featureId: string) => {
        setPreferences(prev => ({
            ...prev,
            [featureId]: !prev[featureId]
        }));
        if (error) setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isLoading) return;

        const selectedCount = Object.values(preferences).filter(Boolean).length;
        if (selectedCount === 0) {
            setError('Please select at least one feature you are interested in.');
            scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setError('');
        onSubmitPreferences(preferences);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-xl transform transition-all duration-300 ease-out max-h-[90vh] flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="feature-modal-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h2
                            id="feature-modal-title"
                            className="text-xl font-bold text-gray-900"
                        >
                            Help Us Shape UnchartedTravel!
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Which features are you most excited about?
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <HiX className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow min-h-0">
                    <div
                        ref={scrollRef}
                        className="flex-grow overflow-y-auto p-6"
                    >
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {FEATURES_LIST.map((feature) => (
                                <label
                                    key={feature.id}
                                    className={`flex items-start p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${preferences[feature.id]
                                            ? 'bg-blue-50 border-blue-500 shadow-sm'
                                            : 'bg-gray-50 border-transparent hover:bg-gray-100'
                                        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={preferences[feature.id] || false}
                                        onChange={() => handleCheckboxChange(feature.id)}
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0"
                                        disabled={isLoading}
                                    />
                                    <span className={`ml-3 text-sm font-medium leading-relaxed ${preferences[feature.id] ? 'text-blue-700' : 'text-gray-700'
                                        }`}>
                                        {feature.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Footer - Fixed at bottom */}
                    <div className="p-6 border-t border-gray-100 flex-shrink-0 bg-white rounded-b-2xl">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center text-base"
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeaturePreferenceModal;