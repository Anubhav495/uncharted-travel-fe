import type { PackageSnapshot, RawField, RawSection } from './dom';
import type { ExtractedPackageData, FieldMetadata, PackageDetail } from './types';
import { normalizeBatchSize, normalizeDuration, normalizeMeasure } from './normalize';

export const fieldMessage = (metadata?: FieldMetadata): string => {
    if (metadata?.status === 'unavailable') return 'Unable to fetch; confirm with provider.';
    if (metadata?.status === 'ambiguous') return 'Details vary; confirm the applicable package or batch.';
    if (metadata?.completeness === 'partial') return 'Partial details; confirm the complete information with the provider.';
    return 'Not stated on source.';
};

function resolveScalar(values: RawField[], validate: (text: string) => unknown = (text) => text.toLowerCase()) {
    const metadata: FieldMetadata = { status: 'not_found', completeness: 'unknown', reason: 'section_missing', evidence: values.map((value) => value.evidence) };
    if (!values.length) return { value: null as string | null, normalized: null as any, metadata };
    const parsed = values.map((value) => validate(value.text));
    if (parsed.some((value) => value === null || value === false)) {
        metadata.status = 'unavailable'; metadata.reason = 'parse_failed';
        return { value: null, normalized: null, metadata };
    }
    if (new Set(parsed.map((value) => JSON.stringify(value))).size !== 1) {
        metadata.status = 'ambiguous'; metadata.reason = 'conflicting_values';
        return { value: null, normalized: null, metadata };
    }
    metadata.status = 'found'; metadata.completeness = 'complete'; delete metadata.reason;
    return { value: values[0].text, normalized: parsed[0], metadata };
}

export function assertionFor(text: string, context: 'inclusions' | 'exclusions' | 'safetyGear') {
    if (/\b(?:no\b|not (?:included|provided|available)|without|excluded|(?:(?:must|should) )?(?:bring|carry) (?:your|their) own)\b/i.test(text)) return 'excluded' as const;
    if (/\b(?:if|when required|subject to|optional|depending on|as required)\b/i.test(text)) return 'conditional' as const;
    if (context === 'exclusions') return 'excluded' as const;
    if (context === 'inclusions' || /\b(?:provided|includes?|equipped|we (?:carry|supply))\b/i.test(text)) return 'included' as const;
    return 'mentioned' as const;
}

function resolveList(sections: RawSection[], key: 'inclusions' | 'exclusions' | 'safetyGear', pending = false) {
    const metadata: FieldMetadata = { status: pending ? 'unavailable' : 'not_found', completeness: 'unknown', reason: pending ? 'section_not_loaded' : 'section_missing', evidence: sections.map((section) => section.evidence) };
    if (!sections.length) return { values: [] as string[], metadata };
    const signatures = sections.map((section) => JSON.stringify(section.items.map((item) => item.text.toLowerCase()).sort()));
    if (new Set(signatures).size !== 1) {
        metadata.status = 'ambiguous'; metadata.reason = 'conflicting_values';
        return { values: [], metadata };
    }
    const items = sections[0].items;
    const partial = sections.some((section) => section.partial || section.unavailable);
    metadata.status = items.length ? 'found' : 'unavailable';
    metadata.completeness = items.length ? partial ? 'partial' : 'complete' : 'unknown';
    metadata.reason = partial || !items.length ? 'section_not_loaded' : undefined;
    metadata.items = items.map((item) => ({ text: item.text, assertion: assertionFor(item.text, key), evidence: item.evidence }));
    return { values: items.map((item) => item.text), metadata };
}

const detailLabels: Record<string, string> = {
    maxAltitude: 'Highest altitude', trekDistance: 'Trekking distance', baseCamp: 'Base camp', season: 'Season', months: 'Best months',
    food: 'Meals', stay: 'Accommodation', railHead: 'Nearest rail head', airport: 'Nearest airport',
    pickupLocation: 'Pickup location', dropLocation: 'Drop location', pickupTime: 'Pickup time', dropTime: 'Drop time',
    bufferDay: 'Buffer day', transport: 'Transport', insurance: 'Insurance', offloading: 'Backpack offloading', cancellationPolicy: 'Cancellation policy',
};

export function resolvePackageSnapshot(snapshot: PackageSnapshot): Omit<ExtractedPackageData, 'providerName' | 'sourceUrl' | 'extractedAt'> {
    const fieldMetadata: Record<string, FieldMetadata> = {};
    const scalar = (key: string, validate?: (text: string) => unknown) => {
        const result = resolveScalar(snapshot.fields[key] || [], validate);
        if (result.metadata.status === 'not_found' && snapshot.loading) { result.metadata.status = 'unavailable'; result.metadata.reason = 'section_not_loaded'; }
        fieldMetadata[key] = result.metadata;
        return result;
    };
    const name = resolveScalar(snapshot.names);
    fieldMetadata.packageName = name.metadata;
    const duration = scalar('durationDays', normalizeDuration);
    const location = scalar('location');
    const difficulty = scalar('difficulty', (text) => /^(?:easy|moderate|difficult|hard|expert|challenging)(?:\s*(?:to|[-–—])\s*(?:easy|moderate|difficult|hard|expert|challenging))?$/i.test(text) ? text.toLowerCase().replace(/\s+/g, ' ') : null);
    const batchSize = scalar('batchSize', normalizeBatchSize);
    const inclusions = resolveList(snapshot.sections.inclusions || [], 'inclusions', snapshot.pendingSections.includes('inclusions') || snapshot.loading);
    const exclusions = resolveList(snapshot.sections.exclusions || [], 'exclusions', snapshot.pendingSections.includes('exclusions') || snapshot.loading);
    fieldMetadata.inclusions = inclusions.metadata; fieldMetadata.exclusions = exclusions.metadata;
    const explicitSafety = resolveList(snapshot.sections.safetyGear || [], 'safetyGear');
    const safetyPattern = /\b(?:oxygen|first[- ]aid|medical (?:kit|support|staff)|stretchers?|oximeter|helmets?|gaiters?|microspikes?|trek leaders?|emergency support)\b/i;
    const safetyItems = [...(explicitSafety.metadata.items || []), ...[...(inclusions.metadata.items || []), ...(exclusions.metadata.items || [])].filter((item) => safetyPattern.test(item.text))]
        .filter((item, index, items) => items.findIndex((other) => other.text === item.text) === index);
    fieldMetadata.safetyGear = safetyItems.length ? {
        status: 'found', completeness: [explicitSafety.metadata, inclusions.metadata, exclusions.metadata].some((meta) => meta.completeness === 'partial' || meta.status === 'unavailable' || meta.status === 'ambiguous') ? 'partial' : 'unknown',
        evidence: safetyItems.map((item) => item.evidence), items: safetyItems,
    } : explicitSafety.metadata;
    if (!safetyItems.length && [inclusions.metadata, exclusions.metadata, explicitSafety.metadata].some((metadata) => metadata.status === 'unavailable' || metadata.status === 'ambiguous')) {
        fieldMetadata.safetyGear = { status: 'unavailable', completeness: 'unknown', reason: 'section_not_loaded',
            evidence: [...explicitSafety.metadata.evidence, ...inclusions.metadata.evidence, ...exclusions.metadata.evidence] };
    }
    const importantDetails: PackageDetail[] = [];
    const measures: NonNullable<NonNullable<ExtractedPackageData['facts']>['measures']> = {};
    for (const [key, label] of Object.entries(detailLabels)) {
        const isMeasure = key === 'maxAltitude' || key === 'trekDistance';
        const result = scalar(key, isMeasure ? (text) => normalizeMeasure(text)?.values || null : undefined);
        if (!result.value && result.metadata.status === 'not_found' && snapshot.sections[key]?.length) {
            const sections = snapshot.sections[key];
            const values = sections.map((section) => ({ text: section.items.map((item) => item.text).join(' '), evidence: section.evidence })).filter((item) => item.text);
            const resolved = resolveScalar(values);
            if (!values.length) { resolved.metadata.status = 'unavailable'; resolved.metadata.reason = 'section_not_loaded'; }
            result.metadata = resolved.metadata; fieldMetadata[key] = result.metadata;
            result.value = key === 'cancellationPolicy' && resolved.value ? 'Cancellation conditions are available on the source. Review the applicable policy before booking.' : resolved.value;
            if (sections.some((section) => section.partial)) result.metadata.completeness = 'partial';
        }
        if (isMeasure && result.normalized) measures[key] = { rawText: result.value!, values: result.normalized };
        if (result.value || snapshot.fields[key]?.length || snapshot.sections[key]?.length) importantDetails.push({ label, value: result.value || fieldMessage(result.metadata), source: result.value ? 'extracted' : 'manual', metadata: result.metadata });
    }
    fieldMetadata.importantDetails = {
        status: importantDetails.length ? 'found' : snapshot.loading ? 'unavailable' : 'not_found',
        completeness: importantDetails.length ? importantDetails.some((detail) => detail.metadata?.status !== 'found' || detail.metadata?.completeness === 'partial') ? 'partial' : 'complete' : 'unknown',
        evidence: [],
    };

    const itineraryMeta: FieldMetadata = { status: 'not_found', completeness: 'unknown', reason: 'section_missing', evidence: snapshot.itinerary.map((section) => section.evidence) };
    let itinerary: ExtractedPackageData['itinerary'] = [];
    if (snapshot.itinerary.length) {
        const sections = snapshot.itinerary;
        itineraryMeta.variant = sections[0].variant; itineraryMeta.alternatives = sections[0].alternatives;
        const signatures = sections.map((section) => JSON.stringify({ variant: section.variant, days: section.days.map(({ day, title, description }) => ({ day, title, description })) }));
        if (sections.some((section) => section.variantUnresolved) || new Set(signatures).size > 1) {
            itineraryMeta.status = 'ambiguous'; itineraryMeta.reason = 'variant_unresolved';
        } else {
            const days = sections[0].days;
            const unique = days.filter((item, index) => days.findIndex((other) => other.day === item.day && other.title === item.title && other.description === item.description) === index);
            const repeated = unique.some((item, index) => unique.findIndex((other) => other.day === item.day) !== index);
            if (repeated) { itineraryMeta.status = 'ambiguous'; itineraryMeta.reason = 'conflicting_days'; }
            else {
                itinerary = unique.sort((a, b) => a.day! - b.day!);
                const starts = itinerary[0]?.day === 0 ? 0 : 1;
                const gaps = itinerary.some((day, index) => day.day !== index + starts);
                const statedDays = duration.normalized?.days;
                const mismatch = !!statedDays && itinerary.filter((day) => day.day !== 0).length !== statedDays;
                itineraryMeta.status = itinerary.length ? 'found' : 'unavailable';
                itineraryMeta.completeness = itinerary.length ? gaps || mismatch || sections.some((section) => section.partial) ? 'partial' : statedDays ? 'complete' : 'unknown' : 'unknown';
                itineraryMeta.reason = gaps ? 'missing_days' : mismatch ? 'duration_mismatch' : sections.some((section) => section.partial) ? 'section_not_loaded' : itinerary.length ? undefined : 'section_not_loaded';
            }
        }
    }
    fieldMetadata.itinerary = itineraryMeta;
    // Preserve both claims with their evidence rather than selecting the cheaper interpretation.
    for (const topic of ['transport', 'oxygen', 'insurance', 'offloading']) {
        const pattern = new RegExp(`^(?:${topic}|trek ${topic}|${topic} support) (?:is |are )?(?:included|provided|not included|not provided|excluded|unavailable)\\.?$`, 'i');
        const claims = [...(inclusions.metadata.items || []), ...(exclusions.metadata.items || []), ...safetyItems].filter((item) => pattern.test(item.text));
        if (claims.some((item) => item.assertion === 'included') && claims.some((item) => item.assertion === 'excluded')) {
            for (const key of ['inclusions', 'exclusions', 'safetyGear']) if (fieldMetadata[key].items?.some((item) => claims.includes(item))) {
                fieldMetadata[key].status = 'ambiguous'; fieldMetadata[key].reason = 'conflicting_claims'; fieldMetadata[key].completeness = 'partial';
            }
        }
    }
    const extractionWarnings = Object.entries(fieldMetadata)
        .filter(([, meta]) => meta.status === 'ambiguous' || meta.status === 'unavailable' || meta.completeness === 'partial')
        .map(([key, meta]) => `${detailLabels[key] || key}: ${fieldMessage(meta)}`);
    const fieldSources: ExtractedPackageData['fieldSources'] = {};
    for (const key of ['packageName', 'durationDays', 'location', 'difficulty', 'batchSize', 'inclusions', 'exclusions', 'safetyGear', 'itinerary']) {
        const metadata = fieldMetadata[key];
        fieldSources[key] = metadata.status === 'found' ? 'extracted' : metadata.status === 'not_found' ? 'not_found' : 'manual';
    }
    return {
        packageName: name.value, price: null, durationDays: duration.value, location: location.value, difficulty: difficulty.value, batchSize: batchSize.value,
        inclusions: inclusions.values, exclusions: exclusions.values, safetyGear: safetyItems.map((item) => item.text), itinerary, importantDetails,
        fieldMetadata, fieldSources, facts: { duration: duration.normalized || undefined, batchSize: batchSize.normalized || undefined, measures },
        extractionWarnings: [...extractionWarnings, 'Provider claims are extracted from public package details. Confirm arrangements before booking.'],
    };
}
