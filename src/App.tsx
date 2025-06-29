import React, { useState, FunctionComponent } from 'react';
import Header from './components/header/Header.tsx';
import HomePage from './components/homepage/HomePage.tsx';
import Footer from './components/footer/Footer.tsx';
import WaitlistModal from './components/modal/WaitlistModal.tsx';
import FeaturePreferenceModal, { FeaturePreferences } from './components/modal/FeaturePreferenceModal.tsx';
import ConfirmationModal from './components/modal/ConfirmationModal.tsx';

type ModalType = 'waitlist' | 'features' | 'confirmed' | null;

const App: FunctionComponent = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [userEmail, setUserEmail] = useState<string>('');
    
    // --- REMOVED: The isLoading state and its setter are no longer used ---
    // const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleOpenWaitlist = () => {
        setActiveModal('waitlist');
    };

    const handleWaitlistSubmit = (email: string) => {
        console.log("Waitlist Email Stored (Client-side):", email);
        setUserEmail(email);
        setActiveModal('features');
    };

    const handleFeatureSubmit = (selectedPreferencesMap: FeaturePreferences) => {
        if (!userEmail) {
            console.error("User email not set. Cannot submit. Resetting flow.");
            setActiveModal('waitlist');
            return;
        }

        // Immediately provide UI feedback by showing the confirmation modal
        setActiveModal('confirmed');

        // Fire off the API call in the background without waiting for it
        const submitDataInBackground = async () => {
            const selectedFeatureIDs: string[] = Object.entries(selectedPreferencesMap)
            .filter(([key, value]) => value === true)
            .map(([key]) => key);

            if (selectedFeatureIDs.length === 0) {
                console.warn("No features were selected, but submission was attempted.");
            }
            
            const payload = {
                email: userEmail,
                featurePreferences: selectedFeatureIDs,
            };

            console.log("Submitting feature preferences in background with payload:", payload);

            try {
                const response = await fetch("/.netlify/functions/submitWaitlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    throw new Error(`API submission failed silently with status: ${response.status}`);
                }
            } catch (err) {
                console.error("Error submitting feature preferences in background:", err);
            }
        };
        submitDataInBackground();
    };

    const handleCloseModals = () => {
        setActiveModal(null);
    };

    return (
        <div>
            <Header />
            <HomePage onJoinWaitlist={handleOpenWaitlist} />
            <Footer />

            <WaitlistModal
                isOpen={activeModal === 'waitlist'}
                onClose={handleCloseModals}
                onSubmitEmail={handleWaitlistSubmit}
                // --- REMOVED: isLoading prop ---
            />

            <FeaturePreferenceModal
                isOpen={activeModal === 'features'}
                onClose={handleCloseModals}
                onSubmitPreferences={handleFeatureSubmit}
                // --- REMOVED: isLoading prop ---
            />

            <ConfirmationModal
                isOpen={activeModal === 'confirmed'}
                onClose={() => {
                    handleCloseModals();
                    setUserEmail(''); 
                }}
            />
        </div>
    );
};

export default App;