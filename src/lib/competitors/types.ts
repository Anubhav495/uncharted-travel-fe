import type { Page } from 'puppeteer';

export type PackageFieldSource = 'extracted' | 'local' | 'manual' | 'not_found';

export interface ComparisonItineraryDay {
    day: number | null;
    title: string;
    description?: string;
    elevation?: string;
    distance?: string;
    meals?: string;
}

export interface PackageDetail {
    label: string;
    value: string;
    source: PackageFieldSource;
}

export interface ExtractedPackageData {
    providerName: string;
    sourceUrl: string;
    packageName: string | null;
    price: string | null;
    durationDays: string | null;
    difficulty?: string | null;
    location?: string | null;
    batchSize: string | null;
    inclusions: string[];
    exclusions: string[];
    safetyGear: string[];
    itinerary: ComparisonItineraryDay[];
    importantDetails: PackageDetail[];
    fieldSources: Partial<Record<keyof ExtractedPackageData, PackageFieldSource>>;
    extractionWarnings: string[];
    extractedAt: string;
}

export interface ProviderAdapter {
    /** The domain this adapter handles (e.g., "indiahikes.com") */
    domain: string;
    /** The display name of the provider */
    name: string;
    /** The function that takes a Puppeteer page and extracts comparable package data */
    extract: (page: Page, url: string) => Promise<ExtractedPackageData>;
}
