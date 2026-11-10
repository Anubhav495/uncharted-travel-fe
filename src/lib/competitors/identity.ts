import type { ExtractedPackageData } from './types';

// Explicit aliases only. Substring/fuzzy matches can conflate different treks.
const aliases: Record<string, string[]> = {
    'sar-pass-trek': ['sar pass'],
    'kheerganga-trek': ['kheerganga', 'kheer ganga'],
    'kareri-lake-trek': ['kareri lake'],
    'kedarkantha-trek': ['kedarkantha'],
    'har-ki-dun-trek': ['har ki dun', 'har ki doon'],
    'rupin-pass-trek': ['rupin pass'],
    'dev-roopa-trek': ['dev roopa', 'deo roopa'],
    'buni-buni-pass': ['buni buni pass'],
    'hampta-pass': ['hampta pass', 'hamta pass'],
    'baraadsar-lake-trek': ['baraadsar lake', 'baradsar lake'],
};

export class PackageExtractionError extends Error {
    constructor(public code: string, message: string, public status = 422) {
        super(message);
        this.name = 'PackageExtractionError';
    }
}

export function isSupportedTrekSlug(value: string): boolean {
    return Object.hasOwn(aliases, value);
}

export function checkPackageIdentity(pkg: ExtractedPackageData, expectedTrekSlug: string): NonNullable<ExtractedPackageData['identity']> {
    const name = (pkg.packageName || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const base = name.replace(/\b(?:trek|trekking|package|expedition|20\d{2})\b/g, '').replace(/\s+/g, ' ').trim();
    if (!aliases[expectedTrekSlug]) throw new PackageExtractionError('invalid_trek', 'Select a supported Uncharted trek.', 400);
    if (aliases[expectedTrekSlug].includes(base)) {
        const itinerary = pkg.fieldMetadata?.itinerary;
        if (itinerary?.alternatives && itinerary.alternatives.length > 1) return { status: 'uncertain', expectedTrekSlug,
            reason: itinerary.variant ? `The provider itinerary uses the ${itinerary.variant} route. Confirm that this is the route you want to compare.` : 'The provider lists multiple route variants. Confirm the applicable route.' };
        return { status: 'matched', expectedTrekSlug };
    }
    const other = Object.entries(aliases).find(([slug, names]) => slug !== expectedTrekSlug && names.some((alias) => (` ${base} `).includes(` ${alias} `)));
    if (other) throw new PackageExtractionError('trek_mismatch', 'This package is for a different trek. Check the selected trek and package link.');
    return { status: 'uncertain', expectedTrekSlug, reason: 'The package name or route variant needs confirmation.' };
}
