import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import ComparePage from '../../pages/compare';
import { treks } from '@/data/treks';
import type { ExtractedPackageData } from '@/lib/competitors/types';

jest.mock('next-seo', () => ({ NextSeo: () => null }));
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const originalFetch = global.fetch;
const competitor: ExtractedPackageData = {
    providerName: 'Indiahikes',
    sourceUrl: 'https://indiahikes.com/sar-pass',
    packageName: 'Sar Pass',
    price: '₹8,000',
    durationDays: '6 days',
    batchSize: null,
    inclusions: ['Accommodation and meals'],
    exclusions: ['Travel to base camp'],
    safetyGear: [],
    itinerary: [{ day: 1, title: 'Arrive at base camp' }],
    importantDetails: [],
    fieldSources: { price: 'extracted', durationDays: 'extracted', batchSize: 'not_found' },
    extractionWarnings: ['Verify final price with the provider.'],
    extractedAt: '2026-10-31T00:00:00.000Z',
};

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    global.fetch = originalFetch;
});

it('introduces the comparison flow and updates the selected trek preview', () => {
    render(<ComparePage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Same mountains.Different journeys.');
    expect(screen.getByRole('combobox', { name: 'Uncharted trek' })).toHaveValue(treks[0].slug);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: treks[1].slug } });

    expect(screen.getByRole('link', { name: 'View trek' })).toHaveAttribute('href', `/destinations/${treks[1].slug}`);
    expect(screen.getByRole('img', { name: treks[1].title })).toBeInTheDocument();
    expect(screen.getByText(treks[1].price)).toBeInTheDocument();
});

it('allows up to three labelled package inputs and lets the user remove one', () => {
    render(<ComparePage />);

    fireEvent.click(screen.getByRole('button', { name: /add another package/i }));
    fireEvent.click(screen.getByRole('button', { name: /add another package/i }));
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
    expect(screen.getByRole('textbox', { name: 'Package link 03' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add another package/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: 'Package link 03' }), { target: { value: competitor.sourceUrl } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove package link 2' }));
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getByRole('textbox', { name: 'Package link 02' })).toHaveValue(competitor.sourceUrl);
    expect(screen.getByRole('button', { name: /add another package/i })).toBeInTheDocument();
});

it('explains when a package link is required without making a request', () => {
    render(<ComparePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Compare packages' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Add at least one competitor URL');
    expect(global.fetch).not.toHaveBeenCalled();
});

it('shows successful packages alongside Uncharted when another extraction fails', async () => {
    (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => competitor })
        .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Provider page could not be loaded' }) });

    render(<ComparePage />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Package link 01' }), { target: { value: competitor.sourceUrl } });
    fireEvent.click(screen.getByRole('button', { name: /add another package/i }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Package link 02' }), { target: { value: 'https://trekthehimalayas.com/sar-pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Compare packages' }));

    expect(screen.getByRole('button', { name: /reading packages/i })).toBeDisabled();
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Package link 01' })).toBeDisabled();

    const table = within(await screen.findByRole('table'));
    expect(table.getByRole('columnheader', { name: /Uncharted Travel/ })).toBeInTheDocument();
    expect(table.getByRole('columnheader', { name: /Indiahikes/ })).toBeInTheDocument();
    expect(table.getByRole('rowheader', { name: 'Listed price' })).toBeInTheDocument();
    expect(table.getByText('Accommodation and meals')).toBeInTheDocument();
    expect(table.getByText('Arrive at base camp')).toBeInTheDocument();
    expect(table.getByRole('link', { name: /View original package/ })).toHaveAttribute('href', competitor.sourceUrl);
    expect(screen.getByRole('region', { name: 'Trek package comparison' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('alert')).toHaveTextContent('1 link could not be extracted. Showing available results.');
    expect(screen.getByRole('button', { name: 'Compare packages' })).toBeEnabled();
    expect(global.fetch).toHaveBeenCalledWith('/api/extractPackage', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ url: competitor.sourceUrl }),
    }));
});

it('keeps the setup usable after every package fails to load', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network unavailable'));
    render(<ComparePage />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Package link 01' }), { target: { value: competitor.sourceUrl } });
    fireEvent.click(screen.getByRole('button', { name: 'Compare packages' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No competitor links could be extracted.');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Compare packages' })).toBeEnabled();
    expect(screen.getByRole('textbox', { name: 'Package link 01' })).toHaveValue(competitor.sourceUrl);
});
