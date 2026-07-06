import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MobileCataloguePreview from './MobileCataloguePreview';
import { treks } from '@/data/treks';

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ fill, sizes, alt = '', ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
        void fill;
        void sizes;

        // The mock verifies catalogue content without Next.js image optimization.
        // eslint-disable-next-line @next/next/no-img-element
        return <img alt={alt} {...props} />;
    },
}));

describe('MobileCataloguePreview', () => {
    it.each(['compare', 'immerse', 'convert'] as const)(
        'renders every trek in the %s concept with a detail link',
        (view) => {
            render(<MobileCataloguePreview view={view} />);

            expect(screen.getAllByRole('link')).toHaveLength(treks.length);

            treks.forEach((trek) => {
                expect(screen.getByRole('link', { name: `View ${trek.title}` })).toHaveAttribute(
                    'href',
                    `/destinations/${trek.slug}`,
                );
            });
        },
    );

    it('groups the compare concept into swipe pages of three treks', () => {
        render(<MobileCataloguePreview view="compare" />);

        const pages = screen.getAllByRole('group', { name: /Trek page/ });
        expect(pages).toHaveLength(3);
        expect(pages[0].querySelectorAll('a')).toHaveLength(3);
        expect(pages[1].querySelectorAll('a')).toHaveLength(3);
        expect(pages[2].querySelectorAll('a')).toHaveLength(1);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('searches trek details and repaginates the results', () => {
        render(<MobileCataloguePreview view="compare" />);

        fireEvent.change(screen.getByRole('searchbox', { name: 'Search treks' }), {
            target: { value: 'Hard' },
        });

        expect(screen.getAllByRole('link')).toHaveLength(1);
        expect(screen.getByText('1 trek')).toBeInTheDocument();
        expect(screen.getAllByRole('group', { name: /Trek page/ })).toHaveLength(1);
    });

    it('does not match trek locations', () => {
        render(<MobileCataloguePreview view="compare" />);

        fireEvent.change(screen.getByRole('searchbox', { name: 'Search treks' }), {
            target: { value: 'Uttarakhand' },
        });

        expect(screen.getByRole('status')).toHaveTextContent('No matching treks');
    });

    it('shows an empty state when search has no matches', () => {
        render(<MobileCataloguePreview view="compare" />);

        fireEvent.change(screen.getByRole('searchbox', { name: 'Search treks' }), {
            target: { value: 'ocean' },
        });

        expect(screen.getByRole('status')).toHaveTextContent('No matching treks');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
});
