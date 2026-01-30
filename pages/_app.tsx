import '../src/index.css';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import { ToastProvider } from '../src/context/ToastContext';
import { AuthProvider } from '../src/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isRegistrationPage = router.pathname === '/register/guide';
  const headerVariant = isRegistrationPage ? 'minimal' : 'default';

  useEffect(() => {
    document.title = 'Uncharted Travel';
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <Header variant={headerVariant} />
            <Component {...pageProps} />
            {!isRegistrationPage && <Footer />}
          </div>
        </AuthProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
