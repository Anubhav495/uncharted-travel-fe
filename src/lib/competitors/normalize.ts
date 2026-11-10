import type { PackageFacts } from './types';

export function normalizeDuration(text: string): NonNullable<PackageFacts['duration']> | null {
    if (/[-−]\s*\d+\s*(?:days?|nights?)\b|\d+\.\d+\s*(?:days?|nights?)\b/i.test(text)) return null;
    const tokens = Array.from(text.matchAll(/\b(\d+)\s*(trekking\s+|travel\s+)?(days?|nights?)\b/gi));
    if (tokens.some((match) => Number(match[1]) <= 0 || Number(match[1]) > 365)) return null;
    const kinds = new Map<string, Set<number>>();
    for (const token of tokens) {
        const key = `${token[2]?.trim().toLowerCase() || ''}:${token[3].toLowerCase().replace(/s$/, '')}`;
        const values = kinds.get(key) || new Set<number>(); values.add(Number(token[1])); kinds.set(key, values);
    }
    if (Array.from(kinds.values()).some((values) => values.size > 1)) return null;
    const read = (pattern: RegExp) => {
        const match = text.match(pattern);
        const value = match ? Number(match[1]) : null;
        return value !== null && Number.isInteger(value) && value > 0 && value <= 365 ? value : null;
    };
    if (/\d\s*[-–—]\s*\d/.test(text)) return null;
    const days = read(/(?:^|\b)(\d+)\s*days?\b(?!\s*(?:trekking|travel))/i);
    const nights = read(/\b(\d+)\s*nights?\b/i);
    const trekkingDays = read(/\b(\d+)\s*trekking\s*days?\b/i);
    const travelDays = read(/\b(\d+)\s*travel\s*days?\b/i);
    return days || nights || trekkingDays || travelDays ? { days, nights, trekkingDays, travelDays } : null;
}

export function normalizeBatchSize(text: string): PackageFacts['batchSize'] | null {
    if (/\b(?:seats? (?:left|remaining)|departures?|guides?|staff)\b/i.test(text)) return null;
    const range = text.match(/\b(\d+)\s*(?:[-–—]|to)\s*(\d+)\s*(?:trekkers?|participants?|people|persons?)?\b/i);
    const amount = text.match(/\b\d+\b/);
    const maximum = /\b(?:max(?:imum)?|up to|at most)\b/i.test(text);
    const minimum = /\b(?:min(?:imum)?|at least)\b/i.test(text);
    const numbers = (text.match(/\b\d+\b/g) || []).map(Number);
    if (numbers.some((value) => value <= 0 || value > 500)) return null;
    if (range) {
        if (numbers.length !== 2) return null;
        const [low, high] = [Number(range[1]), Number(range[2])];
        return low <= high ? { minimum: low, maximum: high, kind: 'range' } : null;
    }
    if (!amount || numbers.length !== 1) return null;
    const value = Number(amount[0]);
    return { minimum: maximum ? null : value, maximum: minimum ? null : value, kind: maximum ? 'maximum' : minimum ? 'minimum' : 'fixed' };
}

export function normalizeMeasure(rawText: string): NonNullable<PackageFacts['measures']>[string] | null {
    if (/[-−]\s*\d[\d,.]*\s*(?:km|m|ft|feet)\b/i.test(rawText)) return null;
    if (/\d\s*[-–—]\s*\d/.test(rawText)) return null; // Keep an unresolved range out of numeric comparisons.
    const matches = Array.from(rawText.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*(kilomet(?:er|re)s?|kms?|met(?:er|re)s?|m|feet|ft)\b/gi));
    const values = matches.map((match) => ({
        amount: Number(match[1].replace(/,/g, '')),
        unit: (/^k/i.test(match[2]) ? 'km' : /^(?:ft|feet)$/i.test(match[2]) ? 'ft' : 'm') as 'm' | 'ft' | 'km',
    }));
    const validTokens = matches.every((match) => /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(match[1]));
    return validTokens && values.length && values.every(({ amount }) => Number.isFinite(amount) && amount > 0) ? { rawText, values } : null;
}
