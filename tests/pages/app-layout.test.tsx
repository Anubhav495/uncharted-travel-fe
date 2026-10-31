import React from 'react';
import type { AppProps } from 'next/app';
import { render, screen, within } from '@testing-library/react';
import { useRouter } from 'next/router';
import App from '../../pages/_app';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('next-auth/react', () => ({
    SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@vercel/analytics/next', () => ({ Analytics: () => null }));
jest.mock('@vercel/speed-insights/next', () => ({ SpeedInsights: () => null }));
jest.mock('next-seo', () => ({ DefaultSeo: () => null, OrganizationJsonLd: () => null }));
jest.mock('../../src/components/layout/Header', () => ({
    __esModule: true,
    default: () => <header>Site navigation</header>,
}));
jest.mock('../../src/context/AuthContext', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('../../src/context/ToastContext', () => ({
    ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderPage = (pathname: string) => {
    const router = { pathname, push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(router);
    const props = {
        Component: () => <main>Page content</main>,
        pageProps: {},
        router,
    } as unknown as AppProps;
    return render(<App {...props} />);
};

it.each(['/', '/destinations', '/destinations/[slug]'])(
    'shows the complete footer with both actions on %s',
    pathname => {
        renderPage(pathname);
        const footer = within(screen.getByRole('contentinfo'));
        expect(footer.getByRole('heading', { name: 'Find Your Perfect Guide' })).toBeInTheDocument();
        expect(footer.getByRole('link', { name: 'Browse Destinations' })).toHaveAttribute('href', '/destinations');
        expect(footer.getAllByRole('link', { name: 'Become a Guide' })).toHaveLength(2);
        expect(footer.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    },
);

it.each(['/login', '/register/guide'])('keeps the footer off %s', pathname => {
    renderPage(pathname);
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
});
