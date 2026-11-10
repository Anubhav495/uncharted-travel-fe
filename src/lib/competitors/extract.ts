import type { Page } from 'puppeteer';
import { activateCostTab, collectPackageFields } from './dom';
import { resolvePackageSnapshot } from './fields';
import { PackageExtractionError } from './identity';
import { extractPackagePrice, type PriceProvider } from './packagePrice';
import { resolvePackagePrice } from './price';
import type { ExtractedPackageData } from './types';

export const EXTRACTION_TIMEOUT = 10000;

export async function extractProviderPackage(page: Page, url: string, provider: PriceProvider, providerName: string): Promise<ExtractedPackageData> {
    const deadline = Date.now() + EXTRACTION_TIMEOUT;
    const remaining = (maximum: number) => Math.max(1, Math.min(maximum, deadline - Date.now()));
    await page.waitForSelector('h1', { timeout: remaining(4000) }).catch(() => {});
    await page.waitForFunction(() => !!document.querySelector('h1')
        && !document.querySelector('[aria-busy="true"], [data-loading="true"]'), { timeout: remaining(2000), polling: 100 })
        .then((handle) => handle.dispose()).catch(() => {});
    const extractedAt = new Date().toISOString();
    const snapshot = await page.evaluate(collectPackageFields, provider, url, extractedAt);
    if (snapshot.pageState !== 'package') throw new PackageExtractionError(snapshot.pageState === 'challenge' ? 'provider_challenge' : 'invalid_package_page',
        snapshot.pageState === 'challenge' ? 'The provider requires browser verification. Its package details could not be read.' : 'This link does not expose a valid trek package.');

    const readRemainingSections = async () => {
        for (const key of [...snapshot.pendingSections]) {
            if (Date.now() >= deadline) break;
            const before = await page.evaluate(activateCostTab, key);
            if (before === null) continue;
            try {
                const handle = await page.waitForFunction((previous: string) => {
                    const panel = document.querySelector('#costterms .costtermsprose, [data-tab="costterms"] .costtermsprose');
                    return !!panel && panel.textContent !== previous;
                }, { timeout: remaining(2000), polling: 100 }, before);
                await handle.dispose();
                const next = await page.evaluate(collectPackageFields, provider, url, extractedAt);
                if (next.sections[key]?.length) {
                    snapshot.sections[key] = next.sections[key];
                    snapshot.pendingSections = snapshot.pendingSections.filter((item) => item !== key);
                }
            } catch { /* Keep an explicit unavailable status for unmounted sections. */ }
        }
    };
    const [price] = await Promise.all([
        extractPackagePrice(page, provider, remaining(6000)).catch(() => resolvePackagePrice(null)),
        readRemainingSections(),
    ]);
    // Hydration can finish while price or tab content is being awaited. Re-read
    // scalar fields, retaining differing readings as explicit conflicts.
    const latest = await page.evaluate(collectPackageFields, provider, url, extractedAt);
    if (latest.pageState !== 'package') throw new PackageExtractionError('provider_changed_page', 'The provider page changed while its details were being read. Please retry.');
    for (const [key, values] of Object.entries(latest.fields)) {
        snapshot.fields[key] = [...(snapshot.fields[key] || []), ...values];
    }
    if (!snapshot.itinerary.length || snapshot.itinerary.every((section) => !section.days.length)) snapshot.itinerary = latest.itinerary;
    snapshot.loading = latest.loading;
    for (const [key, sections] of Object.entries(latest.sections)) {
        if (!snapshot.sections[key]?.length || snapshot.sections[key].every((section) => !section.items.length || section.partial)) snapshot.sections[key] = sections;
    }
    const data = resolvePackageSnapshot(snapshot);
    data.price = price.price; data.priceDetails = price.priceDetails; data.fieldSources.price = price.source;
    const conflictingPrice = price.source === 'manual' && !!price.priceDetails.rawText?.includes(' | ');
    data.fieldMetadata.price = {
        status: price.source === 'extracted' ? 'found' : conflictingPrice ? 'ambiguous' : 'unavailable', completeness: price.source === 'extracted' ? 'complete' : 'unknown',
        reason: price.source === 'extracted' ? undefined : conflictingPrice ? 'conflicting_values' : 'price_unresolved',
        evidence: price.priceDetails.rawText ? [{ sourceUrl: url, section: 'Package price', rawText: price.priceDetails.rawText.slice(0, 600), capturedAt: extractedAt }] : [],
    };
    if (price.warning) data.extractionWarnings.push(price.warning);
    // Price-card extras are the canonical amounts; retain conflicting source
    // wording instead of silently replacing it with the card's interpretation.
    for (const cost of price.priceDetails.additionalCosts || []) {
        const label = cost.kind === 'insurance' ? 'Insurance' : 'Transport';
        const existing = data.importantDetails.find((detail) => detail.label === label);
        const key = cost.kind;
        const metadata = {
            status: cost.amount === null ? 'unavailable' as const : 'found' as const,
            completeness: cost.amount === null ? 'unknown' as const : 'complete' as const,
            evidence: [{ sourceUrl: url, section: 'Package price details', rawText: cost.displayText, capturedAt: extractedAt }],
        };
        if (existing) {
            const existingAmount = existing.value.match(/₹\s*\d[\d,.]*/)?.[0];
            if (existingAmount && resolvePackagePrice(existingAmount).priceDetails.amount !== cost.amount) {
                const conflict = { ...metadata, status: 'ambiguous' as const, reason: 'charge_scope_unresolved', completeness: 'partial' as const,
                    evidence: [...(existing.metadata?.evidence || []), ...metadata.evidence] };
                existing.metadata = conflict; data.fieldMetadata[key] = conflict;
                existing.value = `${existing.value}; price details list ${cost.displayText}. Confirm the applicable charge.`;
                data.extractionWarnings.push(`${label}: source charges differ in amount or scope. Confirm the applicable charge.`);
                continue;
            }
        }
        data.fieldMetadata[key] = metadata;
        if (existing) {
            existing.value = existing.value === cost.displayText ? cost.displayText : `${existing.value}. Listed charge: ${cost.displayText}`;
            existing.metadata = { ...metadata, evidence: [...(existing.metadata?.evidence || []), ...metadata.evidence] };
            data.fieldMetadata[key] = existing.metadata;
        }
        else data.importantDetails.push({ label, value: cost.displayText, source: 'extracted', metadata });
    }
    return { ...data, providerName, sourceUrl: url, extractedAt };
}

export function reportFieldFailures(data: ExtractedPackageData) {
    let sourceUrl: string;
    try { const url = new URL(data.sourceUrl); sourceUrl = `${url.origin}${url.pathname}`; } catch { return; }
    for (const [field, metadata] of Object.entries(data.fieldMetadata || {})) {
        if (metadata.status === 'found' && metadata.completeness !== 'partial') continue;
        try {
            console.info(JSON.stringify({ event: 'package_field_extraction', provider: data.providerName, sourceUrl, field, status: metadata.status, reason: metadata.reason || 'partial_details', timestamp: data.extractedAt }));
        } catch { /* Observability must not prevent returning a useful comparison. */ }
    }
}
