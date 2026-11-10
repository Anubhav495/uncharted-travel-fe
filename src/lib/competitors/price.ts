import type { PackageAdditionalCost, PackagePriceDetails } from './types';

export const PRICE_FALLBACK = 'Unable to fetch the price, please confirm manually';
export const PRICE_FALLBACK_WARNING = 'A positive package price could not be parsed from the source page. Confirm the price manually.';

/** Parse only a labelled base amount; percentages and extra charges are never summed. */
export function normalizePackagePrice(price: string | null): PackagePriceDetails {
    const rawPrice = price?.trim() || '';
    const match = rawPrice.match(/^([-−]?)\s*(?:₹|INR\b|Rs\.?\s)\s*([-−]?)\s*(\d[\d,.]*)(?=\s|\/|\+|$)/i);
    const amountText = match?.[3];
    const validFormat = amountText && /^(?:\d+|\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d{1,2})?$/.test(amountText);
    const amount = validFormat ? Number(amountText.replace(/,/g, '')) : NaN;

    // Reject ranges, multiple base amounts, and unrecognised trailing text.
    const suffix = match ? rawPrice.slice(match[0].length).trim() : '';
    const validSuffix = /^(?:(?:\+\s*)?\d+(?:\.\d+)?\s*%\s*GST\s*)?(?:(?:\/\s*|per\s+)(?:person|trekker|head))?$/i.test(suffix);
    const taxMatch = suffix.match(/(\d+(?:\.\d+)?)\s*%\s*GST/i);
    const valid = match && !match[1] && !match[2] && Number.isFinite(amount) && amount > 0 && validSuffix;

    return {
        rawText: rawPrice || null,
        amount: valid ? amount : null,
        currency: valid ? 'INR' : null,
        taxPercentage: valid && taxMatch ? Number(taxMatch[1]) : null,
        basis: 'listed_per_person_base',
    };
}

/** Keep the existing display contract and expose a structured, nullable base amount. */
export function resolvePackagePrice(price: string | null) {
    const priceDetails = normalizePackagePrice(price);
    if (priceDetails.amount === null) {
        return { price: PRICE_FALLBACK, priceDetails, source: 'manual' as const, warning: PRICE_FALLBACK_WARNING };
    }
    const rawPrice = priceDetails.rawText!;
    return { price: rawPrice, priceDetails, source: 'extracted' as const, warning: null };
}
/** Every current price block must agree, including desktop/mobile and batch duplicates. */
export function resolvePackagePriceCandidates(candidates: string[]) {
    if (candidates.length === 0) return resolvePackagePrice(null);
    const prices = candidates.map(resolvePackagePrice);
    const first = prices[0];
    if (prices.some(({ priceDetails }) => priceDetails.amount === null
        || priceDetails.amount !== first.priceDetails.amount
        || priceDetails.taxPercentage !== first.priceDetails.taxPercentage)) {
        return resolvePackagePrice(candidates.join(' | '));
    }
    return first;
}

/** Read the extras from the same labelled fee card, never from itinerary prose. */
export function addIndiahikesPriceDetails(price: PackagePriceDetails, blocks: string[]): PackagePriceDetails | null {
    if (price.amount === null) return null;
    const moneyPattern = /(?:[-−]\s*)?(?:₹|INR\b|Rs\.?)\s*[-−]?\s*\d[\d,.]*\S*/gi;
    const parsed = blocks.map((rawText) => {
        const segments = rawText.split(/\s*\+\s*/);
        const baseSegment = segments[0];
        const baseToken = Array.from(baseSegment.matchAll(moneyPattern))
            .find((match) => normalizePackagePrice(match[0]).amount === price.amount);
        if (!baseToken) return null;
        const routeText = baseSegment.slice(baseToken.index! + baseToken[0].length).trim();
        const route = /^[a-z][a-z\s.'’()-]{0,65}\s+to\s+[a-z][a-z\s.'’()-]{0,65}$/i.test(routeText) ? routeText : null;
        const taxRates = Array.from(rawText.matchAll(/\b(\d+(?:\.\d+)?)\s*%\s*GST\b/gi)).map((match) => Number(match[1]));
        if (new Set(taxRates).size > 1) return null;
        const taxPercentage = taxRates[0] ?? price.taxPercentage;
        const additionalCosts: PackageAdditionalCost[] = [];
        for (const segment of segments.slice(1)) {
            const text = segment.replace(/\b(?:view insurance info|optional additions)\b.*$/i, '').trim();
            const insurance = /\b(?:trek\s+)?insurance\b/i.test(text);
            const transport = /\btransport\b/i.test(text);
            if (insurance === transport) continue;
            const tokens = Array.from(text.matchAll(moneyPattern));
            if (tokens.length > 1 || text.length > 200) return null;
            const value = normalizePackagePrice(tokens[0]?.[0] || null);
            const kind = insurance ? 'insurance' : 'transport';
            if (additionalCosts.some((cost) => cost.kind === kind)) return null;
            additionalCosts.push({
                kind,
                label: insurance ? 'Trek Insurance' : 'Transport',
                displayText: text,
                amount: value.amount,
                currency: value.currency,
            });
        }
        return {
            ...price,
            basePriceText: baseToken[0],
            route,
            taxPercentage,
            additionalCosts,
            breakdownRawText: rawText,
        };
    });

    if (parsed.length === 0 || parsed.some((details) => details === null)) return null;
    // Different cards can represent different batches even when base prices agree.
    const signature = (details: PackagePriceDetails) => JSON.stringify({
        route: details.route, taxPercentage: details.taxPercentage, costs: details.additionalCosts,
    });
    if (parsed.some((details) => signature(details) !== signature(parsed[0]))) return null;
    return parsed[0];
}
