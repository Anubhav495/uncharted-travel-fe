import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import WaitlistModal from './components/modals/WaitlistModal';
import FeaturePreferenceModal from './components/modals/FeaturePreferenceModal';
import ConfirmationModal from './components/modals/ConfirmationModal';
import ErrorModal from './components/modals/ErrorModal';
import { FeaturePreferences } from './types';

type ModalType = 'waitlist' | 'features' | 'confirmed' | 'error' | null;

const App: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [userEmail, setUserEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (activeModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [activeModal]);

    const handleOpenWaitlist = () => {
        setActiveModal('waitlist');
    };

    const handleWaitlistSubmit = (email: string) => {
        setUserEmail(email);
        setActiveModal('features');
    };

    const handleFeatureSubmit = async (selectedPreferencesMap: FeaturePreferences) => {
        if (!userEmail) {
            console.error("User email not set. Cannot submit. Resetting flow.");
            setActiveModal('waitlist');
            return;
        }

        setIsLoading(true);
        
        try {
            const selectedFeatureIDs: string[] = Object.entries(selectedPreferencesMap)
                .filter(([key, value]) => value === true)
                .map(([key]) => key);

            const payload = {
                email: userEmail,
                featurePreferences: selectedFeatureIDs,
            };

            const response = await fetch("/api/submitWaitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error(`API submission failed with status: ${response.status}`);
                setActiveModal('error');
                return;
            }

            setActiveModal('confirmed');
        } catch (err) {
            console.error("Error submitting feature preferences:", err);
            setActiveModal('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModals = () => {
        setActiveModal(null);
        setUserEmail('');
    };

    const handleErrorRetry = () => {
        // Go back to features modal to let user retry
        setActiveModal('features');
    };

    return (
        <div className="min-h-screen">
            <Header />
            <HomePage onJoinWaitlist={handleOpenWaitlist} />
            <Footer />

            <WaitlistModal
                isOpen={activeModal === 'waitlist'}
                onClose={handleCloseModals}
                onSubmitEmail={handleWaitlistSubmit}
            />

            <FeaturePreferenceModal
                isOpen={activeModal === 'features'}
                onClose={handleCloseModals}
                onSubmitPreferences={handleFeatureSubmit}
                isLoading={isLoading}
            />

            <ConfirmationModal
                isOpen={activeModal === 'confirmed'}
                onClose={handleCloseModals}
            />

            <ErrorModal
                isOpen={activeModal === 'error'}
                onClose={handleCloseModals}
                onRetry={handleErrorRetry}
            />
        </div>
    );
};

export default App;