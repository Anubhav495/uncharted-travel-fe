import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import ComparePage from '../../pages/compare';
import { treks } from '@/data/treks';
import type { ExtractedPackageData } from '@/lib/competitors/types';
import { PRICE_FALLBACK } from '@/lib/competitors/price';
import { useRouter } from 'next/router';

jest.mock('next-seo', () => ({ NextSeo: () => null }));
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
jest.mock('@/context/AuthContext', () => ({ useAuth: () => ({ user: null, loading: false }) }));
jest.mock('next/router', () => {
    const listeners = new Set<(url: string) => void>();
    const router = {
        isReady: true,
        replace: jest.fn(),
        events: {
            on: (_: string, listener: (url: string) => void) => listeners.add(listener),
            off: (_: string, listener: (url: string) => void) => listeners.delete(listener),
            emit: (_: string, url: string) => listeners.forEach((listener) => listener(url)),
        },
    };
    return { useRouter: jest.fn(() => router) };
});
const mockRouter = jest.mocked(useRouter)();

const originalFetch = global.fetch;
const competitor: ExtractedPackageData = {
    providerName: 'Trek The Himalayas', sourceUrl: 'https://trekthehimalayas.com/sar-pass-trek', packageName: 'Sar Pass',
    price: '₹8,000', durationDays: '6 days', batchSize: null,
    inclusions: ['Accommodation and meals'], exclusions: ['Travel to base camp'], safetyGear: [],
    itinerary: [{ day: 1, title: 'Arrive at base camp' }], importantDetails: [],
    fieldSources: { price: 'extracted', durationDays: 'extracted', batchSize: 'not_found' },
    extractionWarnings: ['Verify final price with the provider.'], extractedAt: '2026-10-31T00:00:00.000Z',
};

beforeEach(() => {
    global.fetch = jest.fn();
    window.history.replaceState({}, '', '/compare');
    mockRouter.isReady = true;
    jest.mocked(mockRouter.replace).mockReset().mockImplementation(async (path) => {
        window.history.replaceState({}, '', path as string);
        mockRouter.events.emit('routeChangeComplete', path, { shallow: true });
        return true;
    });
});
afterEach(() => { global.fetch = originalFetch; });
const chooseProvider = (name = 'Trek The Himalayas') => fireEvent.click(screen.getByRole('checkbox', { name }));
const compare = () => fireEvent.click(screen.getByRole('button', { name: 'Compare packages' }));
const startComparison = () => { chooseProvider(); compare(); };

it('asks users to choose supported providers instead of supplying package URLs', () => {
    render(<ComparePage />);
    expect(screen.getByRole('combobox', { name: 'Uncharted trek' })).toHaveValue(treks[0].slug);
    expect(screen.getByRole('group', { name: 'Supported providers' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Trek The Himalayas' })).not.toBeChecked();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add another package/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
});

it('shows trek-specific availability and drops selections that become unavailable', () => {
    render(<ComparePage />);
    expect(screen.getByRole('checkbox', { name: 'Indiahikes' })).toBeDisabled();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'hampta-pass' } });
    expect(screen.getByRole('checkbox', { name: 'Indiahikes' })).toBeEnabled();
    chooseProvider('Indiahikes');
    fireEvent.change(screen.getByRole('combobox'), { target: { value: treks[0].slug } });
    expect(screen.getByRole('checkbox', { name: 'Indiahikes' })).not.toBeChecked();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'buni-buni-pass' } });
    expect(screen.getByRole('button', { name: 'Compare packages' })).toBeDisabled();
    expect(screen.getByText(/Provider comparisons for this trek are coming soon/)).toBeInTheDocument();
});

it('updates the selected trek preview and uses manual confirmation for an unknown local price', () => {
    const originalPrice = treks[1].price;
    try {
        treks[1].price = 'Price on request';
        render(<ComparePage />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: treks[1].slug } });
        expect(screen.getByRole('link', { name: 'View trek' })).toHaveAttribute('href', `/destinations/${treks[1].slug}`);
        expect(screen.getByText(PRICE_FALLBACK)).toBeInTheDocument();
    } finally { treks[1].price = originalPrice; }
});

it('requires a provider selection without making a request', () => {
    render(<ComparePage />); compare();
    expect(screen.getByRole('alert')).toHaveTextContent('Select at least one provider');
    expect(global.fetch).not.toHaveBeenCalled();
});

it('compares a selected provider using its ID and trek rather than a client-supplied URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => competitor });
    render(<ComparePage />); startComparison();
    expect(screen.getByRole('checkbox', { name: 'Trek The Himalayas' })).toBeDisabled();
    expect(screen.getByRole('combobox')).toBeDisabled();
    const table = within(await screen.findByRole('table'));
    expect(table.getByRole('columnheader', { name: /Uncharted Travel/ })).toBeInTheDocument();
    expect(table.getByRole('columnheader', { name: /Trek The Himalayas/ })).toBeInTheDocument();
    expect(table.getByText('Accommodation and meals')).toBeInTheDocument();
    expect(table.getByText('Arrive at base camp')).toBeInTheDocument();
    expect(table.getByRole('link', { name: /View original package/ })).toHaveAttribute('href', competitor.sourceUrl);
    expect(global.fetch).toHaveBeenCalledWith('/api/extractPackage', expect.objectContaining({ body: JSON.stringify({ providerId: 'trek-the-himalayas', trekSlug: treks[0].slug }) }));
    expect(screen.queryByText('Lowest visible price')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Trek package comparison' })).toHaveAttribute('tabindex', '0');
});

it('preserves successful results when another selected provider fails', async () => {
    (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ ...competitor, packageName: 'Hampta Pass Trek' }) })
        .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Provider requires browser verification.' }) });
    render(<ComparePage />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'hampta-pass' } });
    chooseProvider(); chooseProvider('Indiahikes'); compare();
    await screen.findByRole('table');
    expect(screen.getByRole('alert')).toHaveTextContent('1 provider could not be loaded');
    expect(screen.getByRole('list', { name: 'Provider failures' })).toHaveTextContent('Indiahikes: Provider requires browser verification.');
    expect(global.fetch).toHaveBeenCalledTimes(2);
});

it('keeps the picker usable when all providers fail', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network unavailable'));
    render(<ComparePage />); startComparison();
    expect(await screen.findByRole('alert')).toHaveTextContent('We could not load the selected providers');
    expect(screen.getByRole('checkbox', { name: 'Trek The Himalayas' })).toBeEnabled();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

it('shows the full fee breakdown while keeping listed extras separate', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ ...competitor,
        price: '₹13,450', priceDetails: {
            rawText: '₹13,450', basePriceText: '₹13,450', amount: 13450, currency: 'INR', basis: 'listed_per_person_base', taxPercentage: 5, route: 'Kotgaon to Kotgaon',
            additionalCosts: [{ kind: 'insurance', displayText: '₹210 Trek Insurance', amount: 210 }, { kind: 'transport', displayText: '₹2,600 for transport to and from basecamp', amount: 2600 }],
        },
    }) });
    render(<ComparePage />); startComparison();
    const table = within(await screen.findByRole('table'));
    expect(table.getByText('₹13,450')).toBeInTheDocument();
    expect(table.getByText('Kotgaon to Kotgaon')).toBeInTheDocument();
    const extras = within(table.getByRole('list', { name: 'Additional price details' }));
    expect(extras.getByText('+ 5% GST')).toBeInTheDocument();
    expect(extras.getByText('+ ₹210 Trek Insurance')).toBeInTheDocument();
    expect(extras.getByText('+ ₹2,600 for transport to and from basecamp')).toBeInTheDocument();
    expect(table.queryByText(/total payable/i)).not.toBeInTheDocument();
});

it('invalidates completed comparisons when the trek or provider selection changes', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => competitor });
    render(<ComparePage />); startComparison(); await screen.findByRole('table');
    chooseProvider(); expect(screen.queryByRole('table')).not.toBeInTheDocument();
    chooseProvider(); compare(); await screen.findByRole('table');
    fireEvent.change(screen.getByRole('combobox'), { target: { value: treks[1].slug } });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

it('ignores a late provider response after the selected trek changes', async () => {
    let finish!: (value: unknown) => void;
    (global.fetch as jest.Mock).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    render(<ComparePage />); startComparison();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: treks[1].slug } });
    await act(async () => { finish({ ok: true, json: async () => competitor }); });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue(treks[1].slug);
});

it('holds uncertain routes for review and rejects clear trek mismatches', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ ...competitor, packageName: 'Sar Pass Winter Route' }) });
    render(<ComparePage />); startComparison();
    const include = await screen.findByRole('button', { name: 'Confirm and include Trek The Himalayas' });
    expect(screen.queryByRole('table')).not.toBeInTheDocument(); fireEvent.click(include);
    expect(screen.getByRole('table')).toBeInTheDocument();
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ ...competitor, packageName: 'Hampta Pass Trek' }) });
    compare(); expect(await screen.findByRole('list', { name: 'Provider failures' })).toHaveTextContent('different trek');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

it('retains full itineraries, field statuses and the nested day controls', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ ...competitor,
        itinerary: Array.from({ length: 14 }, (_, day) => ({ day, title: `Route stage ${day}` })),
        batchSize: null, fieldMetadata: { batchSize: { status: 'unavailable', completeness: 'unknown', evidence: [] }, itinerary: { status: 'found', completeness: 'partial', evidence: [] } },
    }) });
    render(<ComparePage />); startComparison();
    const table = within(await screen.findByRole('table'));
    expect(table.getByText('Route stage 13')).toBeInTheDocument(); expect(table.getByText('Day 0')).toBeInTheDocument();
    expect(table.getByText(/Partial details/)).toBeInTheDocument();
    expect(table.getByText('Unable to fetch; confirm with provider.')).toBeInTheDocument();
});

it('rejects malformed successful provider responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ ...competitor, inclusions: null }) });
    render(<ComparePage />); startComparison();
    expect(await screen.findByRole('list', { name: 'Provider failures' })).toHaveTextContent('malformed');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

it('offers a provider support request alongside the comparison picker', () => {
    render(<ComparePage />);
    fireEvent.click(screen.getByText('Request provider support'));
    expect(screen.getByRole('link', { name: 'Sign in to request a provider' })).toBeInTheDocument();
    const comparisonForm = screen.getByRole('form', { name: 'Set up your trek comparison' });
    expect((screen.getByRole('button', { name: 'Compare packages' }) as HTMLButtonElement).form).toBe(comparisonForm);
    expect(screen.getByText('Request provider support').closest('form')).toBeNull();
});

it('restores the selected trek after sign-in and rejects unknown trek query values', () => {
    try {
        window.history.replaceState({}, '', '/compare?trek=hampta-pass#provider-request');
        const view = render(<ComparePage />);
        expect(screen.getByRole('combobox', { name: 'Uncharted trek' })).toHaveValue('hampta-pass');
        expect(screen.getByRole('link', { name: 'Sign in to request a provider' })).toHaveAttribute('href', '/login?returnUrl=%2Fcompare%3Ftrek%3Dhampta-pass%23provider-request');
        view.unmount(); window.history.replaceState({}, '', '/compare?trek=unknown');
        render(<ComparePage />);
        expect(screen.getByRole('combobox', { name: 'Uncharted trek' })).toHaveValue(treks[0].slug);
    } finally { window.history.replaceState({}, '', '/compare'); }
});

const hampta = { ...competitor, packageName: 'Hampta Pass Trek' };
const indiaHikesHampta = { ...hampta, providerName: 'Indiahikes', sourceUrl: 'https://indiahikes.com/hampta-pass' };
function compareBoth() {
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'hampta-pass' } });
    chooseProvider(); chooseProvider('Indiahikes'); compare();
}

it('retries only a failed provider while preserving the successful package and its open itinerary', async () => {
    let finish!: (value: unknown) => void;
    (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Timed out' }) })
        .mockResolvedValueOnce({ ok: true, json: async () => indiaHikesHampta })
        .mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }));
    render(<ComparePage />); compareBoth();
    await screen.findByRole('table');
    const expand = screen.getAllByRole('button', { name: 'Expand all' }).at(-1)!;
    fireEvent.click(expand);
    expect(expand).toHaveAccessibleName('Collapse all');
    const retry = screen.getByRole('button', { name: 'Retry Trek The Himalayas' });
    fireEvent.click(retry); fireEvent.click(retry);
    expect(retry).toBeDisabled();
    expect(screen.getByRole('columnheader', { name: /Indiahikes/ })).toBeInTheDocument();
    expect(screen.queryByText('Reading packages...')).not.toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenLastCalledWith('/api/extractPackage', expect.objectContaining({ body: JSON.stringify({ providerId: 'trek-the-himalayas', trekSlug: 'hampta-pass' }) }));
    await act(async () => { finish({ ok: true, json: async () => hampta }); });
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
        'The details', expect.stringContaining('Uncharted Travel'), expect.stringContaining('Trek The Himalayas'), expect.stringContaining('Indiahikes'),
    ]);
    expect(screen.queryByRole('list', { name: 'Provider failures' })).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(expand).toHaveAccessibleName('Collapse all');
    expect(screen.getAllByText(/Last checked/)).toHaveLength(2);
});

it('updates a repeated retry failure and keeps retry available without clearing other packages', async () => {
    (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => hampta })
        .mockRejectedValueOnce(new Error('Network unavailable'))
        .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Browser verification required' }) });
    render(<ComparePage />); compareBoth(); await screen.findByRole('table');
    fireEvent.click(screen.getByRole('button', { name: 'Retry Indiahikes' }));
    expect(await screen.findByText(/Browser verification required/)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Provider failures' })).toHaveTextContent('Indiahikes: Browser verification required');
    expect(screen.getByRole('button', { name: 'Retry Indiahikes' })).toBeEnabled();
    expect(screen.getByRole('columnheader', { name: /Trek The Himalayas/ })).toBeInTheDocument();
});

it('recovers from all providers failing and holds an uncertain retry result for confirmation', async () => {
    (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network unavailable'))
        .mockResolvedValueOnce({ ok: true, json: async () => ({ ...competitor, packageName: 'Sar Pass Winter Route' }) });
    render(<ComparePage />); startComparison();
    fireEvent.click(await screen.findByRole('button', { name: 'Retry Trek The Himalayas' }));
    const confirm = await screen.findByRole('button', { name: 'Confirm and include Trek The Himalayas' });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    fireEvent.click(confirm);
    expect(screen.getByRole('table')).toBeInTheDocument();
});

it.each(['trek', 'provider', 'new comparison'])('aborts and ignores an old retry after changing %s', async (change) => {
    let finish!: (value: unknown) => void;
    (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network unavailable'))
        .mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }))
        .mockRejectedValue(new Error('New comparison failed'));
    render(<ComparePage />); startComparison();
    fireEvent.click(await screen.findByRole('button', { name: 'Retry Trek The Himalayas' }));
    const signal = (global.fetch as jest.Mock).mock.calls[1][1].signal as AbortSignal;
    if (change === 'trek') fireEvent.change(screen.getByRole('combobox'), { target: { value: 'hampta-pass' } });
    else if (change === 'provider') chooseProvider();
    else compare();
    expect(signal.aborted).toBe(true);
    await act(async () => { finish({ ok: true, json: async () => competitor }); });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    if (change !== 'new comparison') expect(screen.queryByRole('list', { name: 'Provider failures' })).not.toBeInTheDocument();
});

it('allows independent retries of both failed providers without dropping either recovered result', async () => {
    let finishTth!: (value: unknown) => void; let finishIh!: (value: unknown) => void;
    (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Timed out')).mockRejectedValueOnce(new Error('Timed out'))
        .mockReturnValueOnce(new Promise((resolve) => { finishTth = resolve; }))
        .mockReturnValueOnce(new Promise((resolve) => { finishIh = resolve; }));
    render(<ComparePage />); compareBoth();
    fireEvent.click(await screen.findByRole('button', { name: 'Retry Trek The Himalayas' }));
    fireEvent.click(screen.getByRole('button', { name: 'Retry Indiahikes' }));
    await act(async () => { finishIh({ ok: true, json: async () => indiaHikesHampta }); });
    expect(screen.getByRole('columnheader', { name: /Indiahikes/ })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('1 provider could not be loaded');
    await act(async () => { finishTth({ ok: true, json: async () => hampta }); });
    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(4);
});

it('opens a shared comparison, restores valid providers once and loads both automatically', async () => {
    window.history.replaceState({}, '', '/compare?trek=hampta-pass&providers=indiahikes,unknown,trek-the-himalayas,indiahikes');
    (global.fetch as jest.Mock).mockImplementation(async (_, options) => ({ ok: true, json: async () => JSON.parse(options.body).providerId === 'indiahikes' ? indiaHikesHampta : hampta }));
    render(<ComparePage />);
    expect(screen.getByRole('combobox')).toHaveValue('hampta-pass');
    expect(screen.getByRole('checkbox', { name: 'Trek The Himalayas' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Indiahikes' })).toBeChecked();
    expect(within(await screen.findByRole('table')).getAllByRole('columnheader')).toHaveLength(4);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(screen.getAllByText(/Last checked/)).toHaveLength(2);
});

it('requires route confirmation when an automatically loaded shared package is uncertain', async () => {
    window.history.replaceState({}, '', '/compare?trek=sar-pass-trek&providers=trek-the-himalayas');
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ ...competitor, packageName: 'Sar Pass Winter Route' }) });
    render(<ComparePage />);
    expect(await screen.findByRole('button', { name: 'Confirm and include Trek The Himalayas' })).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

it.each([
    '/compare?trek=unknown&providers=trek-the-himalayas',
    '/compare?providers=trek-the-himalayas',
    '/compare?trek=sar-pass-trek&providers=indiahikes,unknown',
])('does not fetch unsupported shared selections: %s', (url) => {
    window.history.replaceState({}, '', url);
    render(<ComparePage />);
    expect(screen.getByRole('checkbox', { name: 'Trek The Himalayas' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Indiahikes' })).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Copy comparison link' })).toBeDisabled();
    expect(global.fetch).not.toHaveBeenCalled();
});

it('keeps URL selections up to date without fetching on each picker change', async () => {
    render(<ComparePage />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'hampta-pass' } });
    chooseProvider('Indiahikes'); chooseProvider();
    await act(async () => {});
    expect(window.location.search).toBe('?trek=hampta-pass&providers=trek-the-himalayas%2Cindiahikes');
    expect(mockRouter.replace).toHaveBeenLastCalledWith('/compare?trek=hampta-pass&providers=trek-the-himalayas%2Cindiahikes', undefined, { shallow: true, scroll: false });
    expect(global.fetch).not.toHaveBeenCalled();
    chooseProvider(); chooseProvider('Indiahikes');
    expect(window.location.search).toBe('?trek=hampta-pass');
    expect(global.fetch).not.toHaveBeenCalled();
});

it('restores the URL selection and comparison after a refresh', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => hampta });
    const view = render(<ComparePage />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'hampta-pass' } });
    chooseProvider(); compare(); await screen.findByRole('table');
    view.unmount();
    render(<ComparePage />);
    expect(screen.getByRole('combobox')).toHaveValue('hampta-pass');
    expect(screen.getByRole('checkbox', { name: 'Trek The Himalayas' })).toBeChecked();
    await screen.findByRole('table');
    expect(global.fetch).toHaveBeenCalledTimes(2);
});

it('waits for the router before restoring a shared comparison', async () => {
    window.history.replaceState({}, '', '/compare?trek=hampta-pass&providers=trek-the-himalayas');
    mockRouter.isReady = false;
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => hampta });
    const view = render(<ComparePage />);
    expect(global.fetch).not.toHaveBeenCalled();
    mockRouter.isReady = true; view.rerender(<ComparePage />);
    await screen.findByRole('table');
    expect(global.fetch).toHaveBeenCalledTimes(1);
});

it('restores a same-page shared link and ignores the previous link’s late response', async () => {
    window.history.replaceState({}, '', '/compare?trek=sar-pass-trek&providers=trek-the-himalayas');
    let finish!: (value: unknown) => void;
    (global.fetch as jest.Mock).mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }))
        .mockResolvedValueOnce({ ok: true, json: async () => hampta });
    render(<ComparePage />);
    const signal = (global.fetch as jest.Mock).mock.calls[0][1].signal as AbortSignal;
    await act(async () => {
        const url = '/compare?trek=hampta-pass&providers=trek-the-himalayas';
        window.history.replaceState({}, '', url);
        mockRouter.events.emit('routeChangeComplete', url, { shallow: true });
    });
    expect(signal.aborted).toBe(true);
    await screen.findByRole('table');
    await act(async () => { finish({ ok: true, json: async () => competitor }); });
    expect(screen.getByRole('columnheader', { name: /Trek The Himalayas/ })).toHaveTextContent('Hampta Pass Trek');
    expect(screen.getByRole('combobox')).toHaveValue('hampta-pass');
});
