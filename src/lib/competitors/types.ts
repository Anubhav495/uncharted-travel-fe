import type { Page } from 'puppeteer';

export type PackageFieldSource = 'extracted' | 'local' | 'manual' | 'not_found';

export type FieldStatus = 'found' | 'not_found' | 'ambiguous' | 'unavailable';
export interface FieldEvidence {
    sourceUrl: string;
    section: string;
    rawText: string;
    capturedAt: string;
}

export interface FieldMetadata {
    status: FieldStatus;
    completeness: 'complete' | 'partial' | 'unknown';
    reason?: string;
    variant?: string;
    alternatives?: string[];
    evidence: FieldEvidence[];
    items?: { text: string; assertion: 'included' | 'excluded' | 'conditional' | 'mentioned' | 'unknown'; evidence: FieldEvidence }[];
}

export interface PackageFacts {
    duration?: { days: number | null; nights: number | null; trekkingDays: number | null; travelDays: number | null };
    batchSize?: { minimum: number | null; maximum: number | null; kind: 'range' | 'maximum' | 'minimum' | 'fixed' };
    measures?: Record<string, { rawText: string; values: { amount: number; unit: 'm' | 'ft' | 'km' }[] }>;
}

export interface ComparisonItineraryDay {
    day: number | null;
    title: string;
    description?: string;
    elevation?: string;
    distance?: string;
    meals?: string;
    evidence?: FieldEvidence;
}

export interface PackageDetail {
    label: string;
    value: string;
    source: PackageFieldSource;
    metadata?: FieldMetadata;
}

export interface PackageAdditionalCost {
    kind: 'insurance' | 'transport';
    label: string;
    displayText: string;
    amount: number | null;
    currency: 'INR' | null;
}

export interface PackagePriceDetails {
    rawText: string | null;
    amount: number | null;
    currency: 'INR' | null;
    taxPercentage: number | null;
    basis: 'listed_per_person_base';
    basePriceText?: string;
    route?: string | null;
    additionalCosts?: PackageAdditionalCost[];
    breakdownRawText?: string;
    breakdownWarning?: string;
}

export interface ExtractedPackageData {
    providerName: string;
    sourceUrl: string;
    packageName: string | null;
    price: string | null;
    priceDetails?: PackagePriceDetails;
    fieldMetadata?: Record<string, FieldMetadata>;
    facts?: PackageFacts;
    identity?: { status: 'matched' | 'uncertain'; expectedTrekSlug: string; reason?: string };
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
