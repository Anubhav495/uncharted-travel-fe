import { ProviderAdapter } from './types';
import { indiahikesAdapter } from './providers/indiahikes';
import { trekTheHimalayasAdapter } from './providers/trekTheHimalayas';

export const adapters: ProviderAdapter[] = [
    indiahikesAdapter,
    trekTheHimalayasAdapter,
];

export function hostnameMatchesDomain(hostname: string, domain: string): boolean {
    return hostname === domain || hostname.endsWith(`.${domain}`);
}

export function getAdapterForUrl(url: string): ProviderAdapter | null {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.toLowerCase();

        return adapters.find(adapter => hostnameMatchesDomain(hostname, adapter.domain)) || null;
    } catch {
        return null; // Invalid URL
    }
}
