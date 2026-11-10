import type { Trek } from '@/types/trek';
import type { ExtractedPackageData, FieldMetadata, PackageDetail } from './types';
import { assertionFor } from './fields';
import { normalizeDuration, normalizeMeasure } from './normalize';
import { resolvePackagePrice } from './price';

export function toUnchartedPackage(trek: Trek): ExtractedPackageData {
    const sourceUrl = `/destinations/${trek.slug}`;
    const extractedAt = new Date().toISOString();
    const price = resolvePackagePrice(trek.price);
    const fieldMetadata: Record<string, FieldMetadata> = {};
    const metadata = (key: string, values: string[]): FieldMetadata => {
        const evidence = values.map((rawText) => ({ sourceUrl, section: `Uncharted ${key}`, rawText: rawText.slice(0, 600), capturedAt: extractedAt }));
        const result: FieldMetadata = { status: values.length ? 'found' : 'not_found', completeness: values.length ? 'complete' : 'unknown', reason: values.length ? undefined : 'section_missing', evidence };
        fieldMetadata[key] = result;
        return result;
    };
    const inclusions = trek.inclusions || [];
    const exclusions = trek.exclusions || [];
    for (const [key, values] of [['inclusions', inclusions], ['exclusions', exclusions]] as const) {
        const result = metadata(key, values);
        result.items = values.map((text, index) => ({ text, assertion: assertionFor(text, key), evidence: result.evidence[index] }));
    }
    const safety = [...(fieldMetadata.inclusions.items || []), ...(fieldMetadata.exclusions.items || [])]
        .filter((item) => /\b(?:oxygen|first[- ]aid|medical kit|stretchers?|helmets?|gaiters?|microspikes?)\b/i.test(item.text));
    metadata('safetyGear', safety.map((item) => item.text)).items = safety;
    const importantDetails: PackageDetail[] = [];
    const measures: NonNullable<NonNullable<ExtractedPackageData['facts']>['measures']> = {};
    for (const [key, label, value] of [
        ['maxAltitude', 'Highest altitude', trek.maxAltitude], ['baseCamp', 'Base camp', trek.basecamp],
        ['trekDistance', 'Trekking distance', trek.trekDistance], ['season', 'Best time to visit', trek.bestTimeToVisit],
        ['primaryGuide', 'Primary guide', trek.guideName],
    ]) {
        const meta = metadata(key, value ? [value] : []);
        if (value) importantDetails.push({ label, value, source: 'local', metadata: meta });
        if ((key === 'maxAltitude' || key === 'trekDistance') && value) {
            const measure = normalizeMeasure(value); if (measure) measures[key] = measure;
        }
    }
    if (trek.arrivalInstructions?.steps.length) {
        const value = `${trek.arrivalInstructions.title}: ${trek.arrivalInstructions.steps.join(' ')}`;
        importantDetails.push({ label: 'Arrival instructions', value, source: 'local', metadata: metadata('arrivalInstructions', [value]) });
    }
    const itinerary = (trek.itinerary || []).map((day) => ({ ...day,
        evidence: { sourceUrl, section: `Uncharted itinerary, Day ${day.day}`, rawText: `${day.title} ${day.description}`.slice(0, 600), capturedAt: extractedAt },
    }));
    const itineraryMeta = metadata('itinerary', itinerary.map((day) => day.title));
    const duration = normalizeDuration(trek.duration);
    if (itinerary.length && (itinerary.some((day, index) => day.day !== index + (itinerary[0].day === 0 ? 0 : 1))
        || (duration?.days && itinerary.filter((day) => day.day !== 0).length !== duration.days))) {
        itineraryMeta.completeness = 'partial'; itineraryMeta.reason = 'duration_mismatch';
    }
    metadata('packageName', [trek.title]); metadata('durationDays', [trek.duration]); metadata('location', [trek.location]); metadata('difficulty', [trek.difficulty]);
    metadata('batchSize', []); metadata('price', price.priceDetails.amount !== null ? [trek.price] : []);
    if (!duration) { fieldMetadata.durationDays.status = 'unavailable'; fieldMetadata.durationDays.reason = 'parse_failed'; }
    if (price.priceDetails.amount === null) { fieldMetadata.price.status = 'unavailable'; fieldMetadata.price.reason = 'price_unresolved'; }
    const fieldSources: ExtractedPackageData['fieldSources'] = {};
    for (const key of ['packageName', 'price', 'durationDays', 'location', 'difficulty', 'batchSize', 'inclusions', 'exclusions', 'safetyGear', 'itinerary']) {
        fieldSources[key] = fieldMetadata[key].status === 'found' ? 'local' : fieldMetadata[key].status === 'not_found' ? 'not_found' : 'manual';
    }
    return {
        providerName: 'Uncharted Travel', sourceUrl, packageName: trek.title, price: price.price, priceDetails: price.priceDetails,
        durationDays: duration ? trek.duration : null, difficulty: trek.difficulty, location: trek.location, batchSize: null,
        inclusions, exclusions, safetyGear: safety.map((item) => item.text), itinerary, importantDetails, fieldMetadata, fieldSources,
        facts: { duration: duration || undefined, measures },
        extractionWarnings: [
            ...(price.warning ? [price.warning] : []),
            'Uncharted details come from local trek content. Confirm operational terms before booking.',
        ], extractedAt,
    };
}
