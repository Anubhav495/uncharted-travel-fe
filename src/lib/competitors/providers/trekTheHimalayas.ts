import type { ProviderAdapter } from '../types';
import { extractProviderPackage } from '../extract';

export const trekTheHimalayasAdapter: ProviderAdapter = {
    domain: 'trekthehimalayas.com',
    name: 'Trek The Himalayas',
    extract: (page, url) => extractProviderPackage(page, url, 'trekTheHimalayas', 'Trek The Himalayas'),
};
