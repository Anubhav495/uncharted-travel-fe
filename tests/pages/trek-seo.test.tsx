import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { existsSync } from 'fs';
import path from 'path';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import SEO from '../../next-seo.config';
import TrekDetailsPage from '../../pages/destinations/[slug]';

const mockPush = jest.fn();
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const mockLoginWithGoogle = jest.fn().mockResolvedValue(undefined);

jest.mock('@/context/AuthContext', () => ({
    useAuth: () => ({ user: null, loginWithGoogle: mockLoginWithGoogle }),
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
    useToast: () => ({ showToast: jest.fn() }),
}));

describe('trek page SEO', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({ ok: false });
        mockLoginWithGoogle.mockClear();
        mockPush.mockClear();
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
        expect(screen.getAllByText('₹20,999 / person')).not.toHaveLength(0);
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
        expect(product.offers.price).toBe('20999');
        expect(product.image).toEqual(['https://unchartedtravel.in/assets/images/treks/baraadsar-lake/lake-cover.jpg']);

        fireEvent.click(screen.getByRole('button', { name: 'Request This Guide' }));

        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/login'));
    });

    it('adds matching visible FAQs and structured answers to the production trek layout', () => {
        const { container } = render(<TrekDetailsPage />);
        const faq = within(screen.getByRole('region', { name: 'Frequently Asked Questions' }));
        const questions = faq.getAllByRole('heading', { level: 3 });
        const structuredFaq = Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
            .map((script) => JSON.parse(script.textContent || '{}'))
            .find((data) => data['@type'] === 'FAQPage');

        expect(structuredFaq.mainEntity).toHaveLength(questions.length);
        for (const question of structuredFaq.mainEntity) {
            expect(faq.getByRole('heading', { name: question.name })).toBeInTheDocument();
            expect(faq.getByText(question.acceptedAnswer.text)).toBeInTheDocument();
        }
        expect(faq.getByText(/starts at ₹9,500 per person/)).toBeInTheDocument();
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
});
