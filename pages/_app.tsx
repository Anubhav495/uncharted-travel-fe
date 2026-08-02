import '../src/index.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { DefaultSeo, OrganizationJsonLd } from 'next-seo';
import SEO from '../next-seo.config';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import { ToastProvider } from '../src/context/ToastContext';
import { AuthProvider } from '../src/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isRegistrationPage = router.pathname === '/register/guide';
  const headerVariant = isRegistrationPage ? 'minimal' : 'default';

  return (
    <SessionProvider session={pageProps.session}>
      <DefaultSeo {...SEO} />
      <OrganizationJsonLd
        type="Organization"
        id="https://unchartedtravel.in/#organization"
        logo="https://unchartedtravel.in/assets/logo.png"
        legalName="Uncharted Travel"
        name="Uncharted Travel"
        address={{
          streetAddress: 'Parvati Valley',
          addressLocality: 'Kasol',
          addressRegion: 'Himachal Pradesh',
          postalCode: '175105',
          addressCountry: 'IN',
        }}
        contactPoint={[
          {
            telephone: '+91 8318217817',
            contactType: 'customer service',
            email: 'hello@unchartedtravel.in',
            availableLanguage: ['English', 'Hindi'],
          },
        ]}
        url="https://unchartedtravel.in"
      />
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <Header variant={headerVariant} />
            <Component {...pageProps} />
            {!isRegistrationPage && <Footer />}
            <Analytics />
            <SpeedInsights />
          </div>
        </AuthProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
