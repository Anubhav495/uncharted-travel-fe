import { z } from 'zod';
import type { ExtractedPackageData } from './types';
import { PackageExtractionError } from './identity';

const source = z.enum(['extracted', 'local', 'manual', 'not_found']);
const httpsUrl = z.string().url().refine((value) => { try { return new URL(value).protocol === 'https:'; } catch { return false; } });
const evidence = z.object({ sourceUrl: httpsUrl, section: z.string(), rawText: z.string(), capturedAt: z.string() });
const metadata = z.object({
    status: z.enum(['found', 'not_found', 'ambiguous', 'unavailable']), completeness: z.enum(['complete', 'partial', 'unknown']),
    reason: z.string().optional(), evidence: z.array(evidence),
    variant: z.string().optional(), alternatives: z.array(z.string()).optional(),
    items: z.array(z.object({ text: z.string(), assertion: z.enum(['included', 'excluded', 'conditional', 'mentioned', 'unknown']), evidence })).optional(),
});
const packageSchema = z.object({
    providerName: z.string().min(1), sourceUrl: httpsUrl, packageName: z.string().nullable(), price: z.string().nullable(),
    durationDays: z.string().nullable(), difficulty: z.string().nullable().optional(), location: z.string().nullable().optional(), batchSize: z.string().nullable(),
    inclusions: z.array(z.string()), exclusions: z.array(z.string()), safetyGear: z.array(z.string()),
    itinerary: z.array(z.object({ day: z.number().int().nonnegative().nullable(), title: z.string().min(1), description: z.string().optional(),
        distance: z.string().optional(), elevation: z.string().optional(), meals: z.string().optional(), evidence: evidence.optional() })),
    importantDetails: z.array(z.object({ label: z.string(), value: z.string(), source, metadata: metadata.optional() })),
    fieldSources: z.record(z.string(), source), fieldMetadata: z.record(z.string(), metadata).optional(), extractionWarnings: z.array(z.string()), extractedAt: z.string(),
    priceDetails: z.object({
        rawText: z.string().nullable(), amount: z.number().positive().nullable(), currency: z.literal('INR').nullable(), taxPercentage: z.number().min(0).max(100).nullable(),
        basis: z.literal('listed_per_person_base'), basePriceText: z.string().optional(), route: z.string().nullable().optional(),
        additionalCosts: z.array(z.object({ kind: z.enum(['insurance', 'transport']), label: z.string().optional(), displayText: z.string(), amount: z.number().positive().nullable(), currency: z.literal('INR').nullable().optional() })).optional(),
        breakdownRawText: z.string().optional(), breakdownWarning: z.string().optional(),
    }).optional(),
    identity: z.object({ status: z.enum(['matched', 'uncertain']), expectedTrekSlug: z.string(), reason: z.string().optional() }).optional(),
    facts: z.object({
        duration: z.object({ days: z.number().int().positive().nullable(), nights: z.number().int().positive().nullable(), trekkingDays: z.number().int().positive().nullable(), travelDays: z.number().int().positive().nullable() }).optional(),
        batchSize: z.object({ minimum: z.number().int().positive().nullable(), maximum: z.number().int().positive().nullable(), kind: z.enum(['range', 'maximum', 'minimum', 'fixed']) }).optional(),
        measures: z.record(z.string(), z.object({ rawText: z.string(), values: z.array(z.object({ amount: z.number().positive(), unit: z.enum(['m', 'ft', 'km']) })) })).optional(),
    }).optional(),
}).passthrough();

export function parsePackageResult(value: unknown): ExtractedPackageData {
    const result = packageSchema.safeParse(value);
    if (!result.success) throw new PackageExtractionError('malformed_result', 'The provider returned incomplete or malformed package data. Please retry.', 502);
    return result.data as ExtractedPackageData;
}
