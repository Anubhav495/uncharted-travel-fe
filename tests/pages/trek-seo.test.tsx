import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { existsSync } from 'fs';
import path from 'path';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import SEO from '../../next-seo.config';
import TrekDetailsPage from '../../pages/destinations/[slug]';
import { useAuth } from '@/context/AuthContext';
import { sarPassTrek } from '@/data/treks/sar-pass';

const mockPush = jest.fn();
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const mockLoginWithGoogle = jest.fn().mockResolvedValue(undefined);
const mockShowToast = jest.fn();

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Render generated head tags in the test container for inspection.
jest.mock('next/head', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('@/context/ToastContext', () => ({
    useToast: () => ({ showToast: mockShowToast }),
}));

describe('trek page SEO', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({ ok: false });
        mockLoginWithGoogle.mockClear();
        mockShowToast.mockClear();
        mockPush.mockClear();
        jest.mocked(useAuth).mockReturnValue({
            user: null,
            loginWithGoogle: mockLoginWithGoogle,
        } as unknown as ReturnType<typeof useAuth>);
        jest.mocked(useRouter).mockReturnValue({
            query: { slug: 'hampta-pass' },
            isReady: true,
            push: mockPush,
        } as unknown as ReturnType<typeof useRouter>);
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it('uses the trek name once and applies the global brand suffix once', () => {
        const { container } = render(
            <>
                <DefaultSeo {...SEO} />
                <TrekDetailsPage />
            </>
        );

        const titles = container.querySelectorAll('title');
        expect(titles[titles.length - 1].textContent).toBe('Hampta Pass Trek | Uncharted Travel');

        const openGraphTitles = container.querySelectorAll('meta[property="og:title"]');
        expect(openGraphTitles[openGraphTitles.length - 1])
            .toHaveAttribute('content', 'Hampta Pass Trek | Uncharted Travel');

        const product = Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
            .map((script) => JSON.parse(script.textContent || '{}'))
            .find((data) => data['@type'] === 'Product');
        expect(product.name).toBe('Hampta Pass Trek');
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hampta Pass Trek');
    });

    it('shows the Baraadsar price, gallery, and guide rating', () => {
        jest.mocked(useRouter).mockReturnValue({
            query: { slug: 'baraadsar-lake-trek' },
            asPath: '/destinations/baraadsar-lake-trek',
            isReady: true,
            push: mockPush,
        } as unknown as ReturnType<typeof useRouter>);

        const { container } = render(<TrekDetailsPage />);

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Baraadsar Lake Trek');
        expect(screen.getByRole('heading', { name: 'Kailash Rawat' })).toBeInTheDocument();
        expect(screen.getAllByText('₹15,999 / person')).not.toHaveLength(0);
        expect(screen.queryByRole('img', { name: 'Baraadsar Lake Trek: photos coming soon' })).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /View Full Gallery/ }))
            .toHaveAttribute('href', '/destinations/baraadsar-lake-trek/gallery');
        expect(screen.getByText('4.8')).toBeInTheDocument();
        expect(screen.getByText('(187 reviews)')).toBeInTheDocument();
        expect(screen.queryByText('No reviews yet')).not.toBeInTheDocument();
        expect(screen.getByText('20 Years Experience')).toBeInTheDocument();
        expect(screen.getByText('Speaks Hindi, Pahadi')).toBeInTheDocument();

        const product = Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
            .map((script) => JSON.parse(script.textContent || '{}'))
            .find((data) => data['@type'] === 'Product');
        expect(product.offers.price).toBe('15999');
        expect(product.image).toEqual(['https://unchartedtravel.in/assets/images/treks/baraadsar-lake/lake-cover.jpg']);

        fireEvent.click(screen.getByRole('button', { name: 'Request This Guide' }));

        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/login'));
    });

    it('keeps the trek content without a FAQ section or FAQ structured data', () => {
        const { container } = render(<TrekDetailsPage />);
        const structuredData = Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
            .map((script) => JSON.parse(script.textContent || '{}'));

        expect(screen.queryByRole('heading', { name: 'Frequently Asked Questions' })).not.toBeInTheDocument();
        expect(structuredData.find((data) => data['@type'] === 'FAQPage')).toBeUndefined();
        expect(structuredData.find((data) => data['@type'] === 'Product')).toBeDefined();
        expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Highlights' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Inclusions & Exclusions' })).not.toBeInTheDocument();
        expect(screen.queryByText('Max Altitude')).not.toBeInTheDocument();
        expect(screen.queryByText('Best Time')).not.toBeInTheDocument();
    });

    it('uses an existing local image for the default sharing preview', () => {
        const image = SEO.openGraph.images[0];
        const pathname = decodeURIComponent(new URL(image.url).pathname);

        expect(existsSync(path.join(process.cwd(), 'public', pathname))).toBe(true);
        expect(image.width).toBe(757);
        expect(image.height).toBe(1024);
    });

    it('shows only guides and preserves the selected guide when redirecting to sign in', () => {
        jest.mocked(useRouter).mockReturnValue({
            query: { slug: sarPassTrek.slug },
            isReady: true,
            push: mockPush,
        } as unknown as ReturnType<typeof useRouter>);

        render(<TrekDetailsPage />);

        expect(screen.getByRole('heading', { name: 'Local Guides' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: sarPassTrek.guides![0].name })).toBeInTheDocument();
        expect(screen.queryByText(sarPassTrek.companies![0].name)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /companies/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /request this company/i })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Request This Guide' }));

        const loginUrl = new URL(mockPush.mock.calls[0][0], 'https://unchartedtravel.in');
        const returnUrl = new URL(loginUrl.searchParams.get('returnUrl')!, loginUrl.origin);
        expect(loginUrl.pathname).toBe('/login');
        expect(returnUrl.pathname).toBe(`/destinations/${sarPassTrek.slug}`);
        expect(returnUrl.searchParams.get('providerType')).toBe('guide');
        expect(returnUrl.searchParams.get('providerId')).toBe(sarPassTrek.guides![0].id);
        expect(returnUrl.searchParams.get('providerName')).toBe(sarPassTrek.guides![0].name);
    });

    it.each([
        ['guide', 'Pritam Negi', 'Request with Pritam Negi'],
        ['company', 'Pritam tour and travels 99', 'Request Availability'],
    ])('handles a %s booking return without offering company selection', async (providerType, providerName, title) => {
        const replace = jest.fn();
        jest.mocked(useAuth).mockReturnValue({
            user: { id: 'test-user', email: 'trekker@example.com', user_metadata: { full_name: 'Test Trekker' } },
        } as unknown as ReturnType<typeof useAuth>);
        jest.mocked(useRouter).mockReturnValue({
            pathname: '/destinations/[slug]',
            query: { slug: sarPassTrek.slug, action: 'book', providerType, providerId: 'selected-provider', providerName },
            isReady: true,
            push: mockPush,
            replace,
        } as unknown as ReturnType<typeof useRouter>);
        global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ hasEnquired: false }) });

        render(<TrekDetailsPage />);

        const modal = within(await screen.findByRole('dialog'));
        expect(modal.getByRole('heading', { name: title })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Request with Pritam tour and travels 99' })).not.toBeInTheDocument();
        expect(replace).toHaveBeenCalledWith({
            pathname: '/destinations/[slug]',
            query: { slug: sarPassTrek.slug },
        }, undefined, { shallow: true });
    });
});
