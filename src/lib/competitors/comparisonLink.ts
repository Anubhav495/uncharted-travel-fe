import { treks } from '@/data/treks';
import { getProviderPackageUrl, SUPPORTED_PROVIDERS, type SupportedProviderId } from './catalog';

export interface ComparisonSelection {
    trekSlug: string;
    providerIds: SupportedProviderId[];
}

function availableProviderIds(trekSlug: string, providerIds: readonly string[]): SupportedProviderId[] {
    return SUPPORTED_PROVIDERS.filter((provider) => providerIds.includes(provider.id) && getProviderPackageUrl(provider.id, trekSlug))
        .map((provider) => provider.id);
}

export function readComparisonSelection(searchParams: URLSearchParams): ComparisonSelection {
    const requestedTrek = searchParams.get('trek');
    const trekSlug = treks.find((trek) => trek.slug === requestedTrek)?.slug;
    if (!trekSlug) return { trekSlug: treks[0]?.slug || '', providerIds: [] };
    return {
        trekSlug,
        providerIds: availableProviderIds(trekSlug, searchParams.getAll('providers').flatMap((value) => value.split(','))),
    };
}

export function buildComparisonPath({ trekSlug, providerIds }: { trekSlug: string; providerIds: readonly SupportedProviderId[] }): string {
    const params = new URLSearchParams({ trek: trekSlug });
    const available = availableProviderIds(trekSlug, providerIds);
    if (available.length) params.set('providers', available.join(','));
    return `/compare?${params.toString()}`;
}
