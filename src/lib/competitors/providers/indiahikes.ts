import type { ProviderAdapter } from '../types';
import { extractProviderPackage } from '../extract';

export const indiahikesAdapter: ProviderAdapter = {
    domain: 'indiahikes.com',
    name: 'Indiahikes',
    extract: (page, url) => extractProviderPackage(page, url, 'indiahikes', 'Indiahikes'),
};
