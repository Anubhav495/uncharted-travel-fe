import { PRICE_FALLBACK, PRICE_FALLBACK_WARNING, resolvePackagePrice, normalizePackagePrice, resolvePackagePriceCandidates, addIndiahikesPriceDetails } from './price';

it.each([null, '', 'Price on request', '₹0', '₹0.00', '₹-500', '-₹500', '₹−500', '₹8,00', '₹8,000.123', '₹8,000x'])(
    'uses the common fallback for invalid or non-positive price %s',
    (price) => {
        expect(resolvePackagePrice(price)).toMatchObject({
            price: PRICE_FALLBACK,
            source: 'manual',
            warning: PRICE_FALLBACK_WARNING,
        });
    },
);

it.each(['₹8,000', '₹8,000.50', '₹0.50', '₹1,23,456.78', '₹8,000 + 5% GST', '₹8,000 / person', '₹8,000/person'])(
    'preserves valid price text %s',
    (price) => {
        expect(resolvePackagePrice(price)).toMatchObject({ price, source: 'extracted', warning: null });
    },
);


it.each([
    ['₹8,000 + 5% GST', 8000, 5],
    ['₹8,000.50', 8000.5, null],
    ['INR 8,000.50 / person', 8000.5, null],
    ['Rs. 8,000', 8000, null],
])('normalizes %s into a base amount without adding taxes', (rawText, amount, taxPercentage) => {
    expect(normalizePackagePrice(rawText as string)).toEqual({
        rawText, amount, taxPercentage, currency: 'INR', basis: 'listed_per_person_base',
    });
});

it.each(['₹8,000 – ₹9,000', '₹8,000 + ₹2,000 transport', '₹8,000 or ₹9,000', '—', '0', '₹8,000 onwards'])('keeps ambiguous amounts unavailable: %s', (text) => {
    expect(normalizePackagePrice(text).amount).toBeNull();
});

it('requires duplicate price blocks to agree on the amount and tax treatment', () => {
    expect(resolvePackagePriceCandidates(['₹8,000', '₹ 8000']).priceDetails.amount).toBe(8000);
    for (const candidates of [[], ['₹0', '₹8,000'], ['₹8,000', '₹9,000'], ['₹8,000', '₹8,000 + 5% GST']]) {
        expect(resolvePackagePriceCandidates(candidates).priceDetails.amount).toBeNull();
    }
});

it('preserves decimal charges without folding them into the trek fee', () => {
    const result = addIndiahikesPriceDetails(normalizePackagePrice('₹13,450.50'), [
        'Trek Fee ₹13,450.50 Kotgaon to Kotgaon + 5% GST + ₹210.25 Trek Insurance + ₹2,600.50 for transport to and from basecamp',
    ]);
    expect(result.amount).toBe(13450.5);
    expect(result.additionalCosts.map((cost) => cost.amount)).toEqual([210.25, 2600.5]);
});

it('rejects a conflicting breakdown without borrowing details from another card', () => {
    const result = addIndiahikesPriceDetails(normalizePackagePrice('₹13,450'), [
        'Trek Fee ₹13,450 + 5% GST + ₹210 Trek Insurance',
        'Trek Fee ₹13,450 + 5% GST + ₹210 Trek Insurance + ₹250 Trek Insurance',
    ]);
    expect(result).toBeNull();
});
