import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import handler from '../../pages/api/extractPackage';
import { getAdapterForUrl } from '@/lib/competitors';
import { PackageExtractionError } from '@/lib/competitors/identity';
import type { ExtractedPackageData, ProviderAdapter } from '@/lib/competitors/types';
import { packageResultCache, PACKAGE_CACHE_LIMITS } from '@/lib/competitors/cache';

jest.mock('puppeteer', () => ({ __esModule: true, default: { launch: jest.fn() } }));
jest.mock('@/lib/competitors', () => ({ ...jest.requireActual('@/lib/competitors'), getAdapterForUrl: jest.fn() }));

const result: ExtractedPackageData = {
    providerName: 'Trek The Himalayas', sourceUrl: 'https://trekthehimalayas.com/sar-pass-trek', packageName: 'Sar Pass Trek', price: '₹8,000',
    durationDays: '6 days', location: null, difficulty: null, batchSize: null, inclusions: ['Meals included'], exclusions: [], safetyGear: [], itinerary: [], importantDetails: [],
    fieldSources: { inclusions: 'extracted' }, fieldMetadata: { exclusions: { status: 'unavailable', completeness: 'unknown', reason: 'section_not_loaded', evidence: [] } },
    extractionWarnings: [], extractedAt: '2026-11-09T00:00:00Z',
};
const extract = jest.fn();
const page = { setRequestInterception: jest.fn(), on: jest.fn(), setUserAgent: jest.fn(), goto: jest.fn(), url: jest.fn() };
const browser = { newPage: jest.fn(), close: jest.fn() };

beforeEach(() => {
    packageResultCache.clear();
    jest.resetAllMocks();
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(puppeteer.launch).mockResolvedValue(browser as any);
    jest.mocked(getAdapterForUrl).mockReturnValue({ domain: 'trekthehimalayas.com', name: 'Trek The Himalayas', extract } as ProviderAdapter);
    browser.newPage.mockResolvedValue(page); browser.close.mockResolvedValue(undefined);
    page.goto.mockResolvedValue({ ok: () => true }); page.url.mockReturnValue(result.sourceUrl);
    extract.mockResolvedValue(result);
});
afterEach(() => jest.restoreAllMocks());

async function call(body: unknown = { providerId: 'trek-the-himalayas', trekSlug: 'sar-pass-trek' }, method = 'POST') {
    const res = { status: jest.fn(), json: jest.fn(), setHeader: jest.fn() }; res.status.mockReturnValue(res);
    await handler({ method, body } as NextApiRequest, res as unknown as NextApiResponse);
    return { status: res.status.mock.calls[0][0], body: res.json.mock.calls[0][0], headers: Object.fromEntries(res.setHeader.mock.calls) };
}

it('returns validated partial packages with field statuses and a matched identity', async () => {
    const response = await call();
    expect(response.status).toBe(200); expect(response.body.identity.status).toBe('matched');
    expect(response.body.fieldMetadata.exclusions.status).toBe('unavailable');
    expect(browser.close).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('section_not_loaded'));
});

it.each([
    [{ providerId: 'unsupported', trekSlug: 'sar-pass-trek' }, 400],
    [{ providerId: 'trek-the-himalayas' }, 400],
    [{ providerId: 'trek-the-himalayas', trekSlug: 'unknown' }, 400],
    [{ url: result.sourceUrl, expectedTrekSlug: 'sar-pass-trek' }, 400],
    [{ providerId: 'trek-the-himalayas', trekSlug: 'sar-pass-trek', url: 'https://example.com' }, 400],
])('validates requests before starting a browser', async (body, status) => {
    expect((await call(body)).status).toBe(status); expect(puppeteer.launch).not.toHaveBeenCalled();
});

it('rejects unsupported methods and providers', async () => {
    expect((await call({}, 'GET')).status).toBe(405);
    jest.mocked(getAdapterForUrl).mockReturnValue(null); expect((await call()).status).toBe(400);
    expect(puppeteer.launch).not.toHaveBeenCalled();
});

it('rejects a clear trek mismatch and marks an unresolved route for review', async () => {
    extract.mockResolvedValueOnce({ ...result, packageName: 'Kedarkantha Trek' });
    expect((await call()).body.code).toBe('trek_mismatch');
    extract.mockResolvedValueOnce({ ...result, packageName: 'Sar Pass Winter Route' });
    expect((await call()).body.identity.status).toBe('uncertain');
});

it('returns a provider challenge reason and closes the browser', async () => {
    extract.mockRejectedValue(new PackageExtractionError('provider_challenge', 'Browser verification required.'));
    const response = await call(); expect(response).toMatchObject({ status: 422, body: { code: 'provider_challenge' } });
    expect(browser.close).toHaveBeenCalledTimes(1);
});

it('rejects malformed data and distinguishes timeouts from missing source fields', async () => {
    extract.mockResolvedValueOnce({ ...result, itinerary: 'not an array' }); expect((await call()).body.code).toBe('malformed_result');
    page.goto.mockRejectedValueOnce(Object.assign(new Error('Timeout'), { name: 'TimeoutError' }));
    expect(await call()).toMatchObject({ status: 504, body: { code: 'provider_timeout' } });
    expect(browser.close).toHaveBeenCalledTimes(2);
});

it('rejects failed loads and redirects outside the provider', async () => {
    page.goto.mockResolvedValueOnce({ ok: () => false }); expect((await call()).status).toBe(502);
    page.url.mockReturnValueOnce('https://example.com/'); expect((await call()).status).toBe(400);
    expect(extract).not.toHaveBeenCalled();
});

it('enforces the existing resource policy without allowing lookalike provider domains', async () => {
    await call(); const intercept = page.on.mock.calls.find(([event]) => event === 'request')[1];
    const request = { resourceType: () => 'script', url: () => 'https://eviltrekthehimalayas.com/app.js', abort: jest.fn(), continue: jest.fn() };
    intercept(request); expect(request.abort).toHaveBeenCalled(); expect(request.continue).not.toHaveBeenCalled();
    request.url = () => 'https://trekthehimalayas.com/app.js'; intercept(request); expect(request.continue).toHaveBeenCalled();
});

it('logging and browser cleanup errors do not discard a validated response', async () => {
    jest.mocked(console.info).mockImplementation(() => { throw new Error('Logger unavailable'); });
    browser.close.mockRejectedValue(new Error('Already closed'));
    expect((await call()).status).toBe(200);
});


it('loads only the curated package URL and never guesses an unsupported combination', async () => {
    await call();
    expect(page.goto).toHaveBeenCalledWith('https://trekthehimalayas.com/sar-pass-trek', expect.any(Object));
    jest.mocked(puppeteer.launch).mockClear();
    expect(await call({ providerId: 'indiahikes', trekSlug: 'sar-pass-trek' })).toMatchObject({ status: 404, body: { code: 'package_not_available' } });
    expect(puppeteer.launch).not.toHaveBeenCalled();
});

it('reuses a successful package until expiry without launching another browser or changing its timestamp', async () => {
    jest.useFakeTimers();
    try {
        extract.mockResolvedValue({ ...result, fieldSources: { price: 'extracted' }, fieldMetadata: {} });
        const first = await call();
        const second = await call();
        expect(first.headers).toMatchObject({ 'X-Package-Cache': 'miss', 'Cache-Control': 'no-store' });
        expect(second.headers['X-Package-Cache']).toBe('hit');
        expect(second.body).toEqual(first.body);
        expect(puppeteer.launch).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(PACKAGE_CACHE_LIMITS.ttlMs);
        expect((await call()).headers['X-Package-Cache']).toBe('miss');
        expect(puppeteer.launch).toHaveBeenCalledTimes(2);
    } finally { jest.useRealTimers(); }
});

it('validates requests even when their provider has a cached result', async () => {
    extract.mockResolvedValue({ ...result, fieldSources: { price: 'extracted' }, fieldMetadata: {} });
    await call();
    expect((await call({ providerId: 'trek-the-himalayas', trekSlug: 'sar-pass-trek', url: result.sourceUrl })).status).toBe(400);
    expect(puppeteer.launch).toHaveBeenCalledTimes(1);
});

it('coalesces concurrent requests for a package into one extraction', async () => {
    let finish!: (value: ExtractedPackageData) => void;
    extract.mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }));
    const first = call(); const second = call();
    finish(result);
    const responses = await Promise.all([first, second]);
    expect(responses.map((response) => response.headers['X-Package-Cache'])).toEqual(['miss', 'coalesced']);
    expect(puppeteer.launch).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
});

it('never caches failed extractions, so retry opens a new browser', async () => {
    extract.mockRejectedValueOnce(new PackageExtractionError('provider_challenge', 'Browser verification required.'));
    expect((await call()).status).toBe(422);
    expect((await call()).status).toBe(200);
    expect(puppeteer.launch).toHaveBeenCalledTimes(2);
});
