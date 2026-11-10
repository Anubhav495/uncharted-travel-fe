import { getProviderPackageUrl, getSupportedProvider, isExistingProviderName, normalizeProviderName, SUPPORTED_PROVIDERS } from './catalog';
import { getAdapterForUrl } from './index';
import { treks } from '@/data/treks';

it('resolves curated provider URLs and does not invent paths for missing packages', () => {
    expect(getProviderPackageUrl('indiahikes', 'har-ki-dun-trek')).toBe('https://indiahikes.com/har-ki-dun');
    expect(getProviderPackageUrl('trek-the-himalayas', 'hampta-pass')).toBe('https://trekthehimalayas.com/hampta-pass-trek');
    expect(getProviderPackageUrl('indiahikes', 'sar-pass-trek')).toBeNull();
    expect(getProviderPackageUrl('trek-the-himalayas', 'buni-buni-pass')).toBeNull();
    expect(getProviderPackageUrl('unknown', 'hampta-pass')).toBeNull();
    expect(getProviderPackageUrl('indiahikes', '__proto__')).toBeNull();
    expect(getSupportedProvider(null)).toBeNull();
});

it('keeps every mapped URL on its adapter domain and tied to an existing local trek', () => {
    for (const provider of SUPPORTED_PROVIDERS) for (const slug of Object.keys(provider.packages)) {
        const url = getProviderPackageUrl(provider.id, slug)!;
        expect(treks.some((trek) => trek.slug === slug)).toBe(true);
        expect(getAdapterForUrl(url)?.domain).toBe(provider.domain);
        expect(new URL(url).protocol).toBe('https:');
    }
});

it('normalizes request duplicates and recognizes current provider aliases', () => {
    expect(normalizeProviderName('  Himalayan   Trails! ')).toBe('himalayan trails');
    for (const value of ['TTH', 'trek the himalayas', 'Indiahikes', 'indiahikes.com']) expect(isExistingProviderName(value)).toBe(true);
    expect(isExistingProviderName('Himalayan Trails')).toBe(false);
});
