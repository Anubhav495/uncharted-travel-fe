import '../src/index.css';
import type { AppProps } from 'next/app';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import WaitlistModal from '../src/components/modals/waitlist/WaitlistModal';
import FeaturePreferenceModal from '../src/components/modals/waitlist/FeaturePreferenceModal';
import ConfirmationModal from '../src/components/modals/waitlist/ConfirmationModal';
import ErrorModal from '../src/components/modals/waitlist/ErrorModal';
import { FeaturePreferences } from '../src/types';

type ModalType = 'waitlist' | 'features' | 'confirmed' | 'error' | null;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isRegistrationPage = router.pathname === '/register/guide';

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Uncharted Travel';
  }, []);

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
    setActiveModal('features');
  };

  return (
    <div className="min-h-screen">
      {!isRegistrationPage && <Header />}
      <Component {...pageProps} onJoinWaitlist={handleOpenWaitlist} />
      {!isRegistrationPage && <Footer />}

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
}
