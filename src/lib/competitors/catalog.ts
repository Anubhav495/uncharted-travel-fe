export type SupportedProviderId = 'indiahikes' | 'trek-the-himalayas';

interface SupportedProvider {
    id: SupportedProviderId;
    name: string;
    domain: string;
    initials: string;
    packages: Readonly<Record<string, string>>;
}

// Curated package paths, not generated slugs. DIY guides are not package offers.
// Reviewed against the providers' public pages on 2026-11-09.
export const SUPPORTED_PROVIDERS: readonly SupportedProvider[] = [
    {
        id: 'trek-the-himalayas', name: 'Trek The Himalayas', domain: 'trekthehimalayas.com', initials: 'TTH',
        packages: {
            'sar-pass-trek': '/sar-pass-trek',
            'kareri-lake-trek': '/kareri-lake-trek',
            'kedarkantha-trek': '/kedarkantha-trek',
            'har-ki-dun-trek': '/har-ki-dun-trek',
            'rupin-pass-trek': '/rupin-pass-trek',
            'hampta-pass': '/hampta-pass-trek',
        },
    },
    {
        id: 'indiahikes', name: 'Indiahikes', domain: 'indiahikes.com', initials: 'IH',
        packages: {
            'kedarkantha-trek': '/kedarkantha-trek',
            'har-ki-dun-trek': '/har-ki-dun',
            'rupin-pass-trek': '/rupin-pass',
            'hampta-pass': '/hampta-pass',
        },
    },
];

export function getSupportedProvider(value: unknown): SupportedProvider | null {
    return SUPPORTED_PROVIDERS.find((provider) => provider.id === value) || null;
}

export function getProviderPackageUrl(providerId: unknown, trekSlug: string): string | null {
    const provider = getSupportedProvider(providerId);
    if (!provider || !Object.hasOwn(provider.packages, trekSlug)) return null;
    return `https://${provider.domain}${provider.packages[trekSlug]}`;
}

export function normalizeProviderName(name: string): string {
    return name.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function isExistingProviderName(name: string): boolean {
    const key = normalizeProviderName(name);
    return ['tth', 'india hikes', ...SUPPORTED_PROVIDERS.flatMap((provider) => [provider.name, provider.domain, provider.id])]
        .some((value) => normalizeProviderName(value) === key);
}
