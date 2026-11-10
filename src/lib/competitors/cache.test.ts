import { Buffer } from 'node:buffer';
import { PackageResultCache, PACKAGE_CACHE_LIMITS } from './cache';
import type { ExtractedPackageData } from './types';

const data: ExtractedPackageData = {
    providerName: 'Trek The Himalayas', sourceUrl: 'https://trekthehimalayas.com/sar-pass-trek', packageName: 'Sar Pass',
    price: '₹8,000', durationDays: '6 days', batchSize: null, inclusions: ['Meals'], exclusions: [], safetyGear: [], itinerary: [], importantDetails: [],
    fieldSources: { price: 'extracted' }, identity: { status: 'matched', expectedTrekSlug: 'sar-pass-trek' },
    extractionWarnings: [], extractedAt: '2026-11-09T00:00:00.000Z',
};

it('returns independent copies and never extends expiry on a cache hit', async () => {
    jest.useFakeTimers();
    try {
        const cache = new PackageResultCache(); const load = jest.fn().mockResolvedValue(data);
        await cache.getOrLoad('trek', load);
        jest.advanceTimersByTime(PACKAGE_CACHE_LIMITS.ttlMs - 1);
        const cached = await cache.getOrLoad('trek', load);
        cached.data.inclusions.push('Do not retain this mutation');
        expect((await cache.getOrLoad('trek', load)).data.inclusions).toEqual(['Meals']);
        jest.advanceTimersByTime(1);
        expect((await cache.getOrLoad('trek', load)).cacheStatus).toBe('miss');
        expect(load).toHaveBeenCalledTimes(2);
    } finally { jest.useRealTimers(); }
});

it('bounds retained payload bytes and evicts the least recently used result', async () => {
    const size = Buffer.byteLength(JSON.stringify(data));
    const cache = new PackageResultCache({ maxBytes: size * 2 });
    const load = jest.fn().mockResolvedValue(data);
    await cache.getOrLoad('a', load); await cache.getOrLoad('b', load);
    await cache.getOrLoad('a', load); await cache.getOrLoad('c', load);
    expect(cache.getStats()).toMatchObject({ entries: 2, payloadBytes: size * 2 });
    expect((await cache.getOrLoad('a', load)).cacheStatus).toBe('hit');
    expect((await cache.getOrLoad('b', load)).cacheStatus).toBe('miss');
});

it('caps entry count and skips oversized results without discarding the response', async () => {
    const cache = new PackageResultCache({ maxEntries: 1 }); const load = jest.fn().mockResolvedValue(data);
    await cache.getOrLoad('a', load); await cache.getOrLoad('b', load);
    expect(cache.getStats().entries).toBe(1);
    expect((await cache.getOrLoad('a', load)).cacheStatus).toBe('miss');
    const small = new PackageResultCache({ maxEntryBytes: 1 });
    expect((await small.getOrLoad('a', load)).data).toEqual(data);
    expect(small.getStats().entries).toBe(0);
});

it.each([
    { identity: { status: 'uncertain' } },
    { fieldSources: { price: 'manual' } },
    { fieldMetadata: { exclusions: { status: 'unavailable', completeness: 'unknown' } } },
    { fieldMetadata: { durationDays: { status: 'ambiguous', completeness: 'unknown' } } },
    { fieldMetadata: { itinerary: { status: 'found', completeness: 'partial' } } },
    { importantDetails: [{ label: 'Transport', value: 'Confirm', source: 'extracted', metadata: { status: 'ambiguous', completeness: 'unknown' } }] },
])('does not retain unresolved results: %j', async (change) => {
    const cache = new PackageResultCache(); const load = jest.fn().mockResolvedValue({ ...data, ...change });
    await cache.getOrLoad('a', load); await cache.getOrLoad('a', load);
    expect(cache.getStats().entries).toBe(0); expect(load).toHaveBeenCalledTimes(2);
});

it('keeps genuinely absent source fields eligible and separates provider/trek keys', async () => {
    const cache = new PackageResultCache();
    const load = jest.fn().mockResolvedValue({ ...data, fieldMetadata: { batchSize: { status: 'not_found', completeness: 'unknown', evidence: [] } } });
    await cache.getOrLoad('provider-a:trek-a', load);
    expect((await cache.getOrLoad('provider-a:trek-a', load)).cacheStatus).toBe('hit');
    expect((await cache.getOrLoad('provider-b:trek-a', load)).cacheStatus).toBe('miss');
    expect((await cache.getOrLoad('provider-a:trek-b', load)).cacheStatus).toBe('miss');
});

it('releases a rejected in-flight request so subsequent retries can succeed', async () => {
    const cache = new PackageResultCache();
    let fail!: (reason: Error) => void;
    const load = jest.fn().mockReturnValueOnce(new Promise((_, reject) => { fail = reject; })).mockResolvedValue(data);
    const first = cache.getOrLoad('a', load); const second = cache.getOrLoad('a', load);
    fail(new Error('Provider timed out'));
    expect((await Promise.allSettled([first, second])).every((result) => result.status === 'rejected')).toBe(true);
    expect(cache.getStats()).toEqual({ entries: 0, payloadBytes: 0, inFlight: 0 });
    expect((await cache.getOrLoad('a', load)).cacheStatus).toBe('miss');
    expect(load).toHaveBeenCalledTimes(2);
});
