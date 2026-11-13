import { readFileSync } from 'fs';
import { join } from 'path';
import type { Page } from 'puppeteer';
import { indiahikesAdapter } from './indiahikes';
import { trekTheHimalayasAdapter } from './trekTheHimalayas';
import { PRICE_FALLBACK } from '../price';
import { collectPackagePriceCandidates, PRICE_WAIT_TIMEOUT } from '../packagePrice';

function createPage() {
    return {
        waitForSelector: jest.fn().mockResolvedValue(null),
        waitForFunction: jest.fn().mockResolvedValue({ dispose: jest.fn() }),
        // Recreate the function to catch dependencies that would be missing in Chromium.
        evaluate: jest.fn(async (fn: (...args: any[]) => unknown, ...args: any[]) => {
            const serialized = new Function(`return (${fn.toString()})`)();
            return serialized(...args);
        }),
    };
}

afterEach(() => { document.body.innerHTML = ''; });

describe.each([indiahikesAdapter, trekTheHimalayasAdapter])('$name scoped package prices', (adapter) => {
    const url = `https://${adapter.domain}/hampta-pass-trek`;
    const extract = () => adapter.extract(createPage() as unknown as Page, url);

    it('ignores deposits, instalments, old prices, add-ons and related packages', async () => {
        document.body.innerHTML = `
            <h1>Hampta Pass Trek</h1>
            <p>Booking deposit ₹500</p>
            <article class="related-treks"><h2>Trek Fee</h2><p>₹2,000</p></article>
            <section><h2>Related treks</h2><article><h3>Trek Fee</h3><p>₹1,000</p></article></section>
            <section>
                <h2>Trek Fee</h2>
                <p>Deposit ₹500</p><p>First instalment ₹2,000</p>
                <del>₹12,000</del><s>₹11,000</s><span class="line-through">₹10,000</span>
                <p style="text-decoration: line-through">₹9,000</p>
                <p>₹8,000.50 <span>+ 5% GST</span></p>
                <div><span>Transport</span><span>₹2,600</span></div>
                <p>Equipment rental ₹600</p><p>Optional insurance ₹180</p>
            </section>
            <section><h2>Other treks</h2><p>₹1,000</p></section>`;
        const result = await extract();
        expect(result.price).toBe('₹8,000.50 + 5% GST');
        expect(result.priceDetails).toMatchObject({ amount: 8000.5, currency: 'INR', taxPercentage: 5 });
    });

    it.each([
        ['<p>₹8,000</p><p>₹9,000</p>'],
        ['<p>₹0</p><p>₹8,000</p>'],
        ['<p>₹8,000 – 9,000</p>'],
        ['<p>From ₹8,000</p>'],
        ['<p>₹8,000 onwards</p>'],
        ['<p>₹8,000 total for 2 people</p>'],
        ['<p>Deposit ₹500</p><p>Rental ₹600</p>'],
        ['<p>Price on request</p>'],
    ])('rejects ambiguous or unavailable pricing: %s', async (html) => {
        document.body.innerHTML = `<h1>Hampta Pass Trek</h1><section><h2>Trek Fee</h2>${html}</section>`;
        const result = await extract();
        expect(result.price).toBe(PRICE_FALLBACK);
        expect(result.priceDetails.amount).toBeNull();
        expect(result.fieldSources.price).toBe('manual');
    });

    it('does not substitute an unlabelled or unrelated amount for missing pricing', async () => {
        document.body.innerHTML = '<h1>Hampta Pass Trek</h1><p>Transport ₹1,300</p><p>₹8,000</p>';
        expect((await extract()).priceDetails.amount).toBeNull();
    });

    it('accepts agreeing duplicate batch prices', async () => {
        document.body.innerHTML = '<h1>Hampta Pass Trek</h1><section><h2>Trek Fee</h2><p>₹8,000</p><p>₹ 8000</p></section>';
        expect((await extract()).priceDetails.amount).toBe(8000);
    });

    it('continues with manual confirmation when the bounded price wait expires', async () => {
        document.body.innerHTML = '<h1>Hampta Pass Trek</h1><section><h2>Trek Fee</h2><p>₹0</p></section>';
        const page = createPage();
        page.waitForFunction.mockRejectedValue(new Error('Timed out'));
        expect((await adapter.extract(page as unknown as Page, url)).price).toBe(PRICE_FALLBACK);
        expect(page.waitForFunction).toHaveBeenCalledWith(expect.any(Function),
            { timeout: PRICE_WAIT_TIMEOUT, polling: 200 }, expect.any(String), true);
    });
});

it('waits for zero placeholders to be replaced by hydrated pricing', () => {
    document.body.innerHTML = '<h1>Hampta Pass Trek</h1><section><h2>Trek Fee</h2><p>₹0</p></section>';
    expect(collectPackagePriceCandidates('indiahikes', true)).toBe(false);
    document.querySelector('p')!.textContent = '₹8,000.50 + 5% GST';
    expect(collectPackagePriceCandidates('indiahikes', true)).toBe(true);
    expect(collectPackagePriceCandidates('indiahikes')).toEqual(['₹8,000.50 + 5% GST']);
});

describe('Indiahikes detailed pricing', () => {
    function loadPricing() {
        document.body.innerHTML = readFileSync(join(__dirname, '__fixtures__', 'ih-har-ki-dun-synthetic.html'), 'utf8');
    }

    const extract = () => indiahikesAdapter.extract(createPage() as unknown as Page, 'https://indiahikes.com/har-ki-dun#gref');

    it('keeps the route, GST, insurance and round-trip transport beside the base fee', async () => {
        loadPricing();
        const result = await extract();
        expect(result.priceDetails).toMatchObject({
            amount: 13450, currency: 'INR', taxPercentage: 5,
            basePriceText: '₹13,450', route: 'Kotgaon to Kotgaon',
            additionalCosts: [
                { kind: 'insurance', amount: 210, currency: 'INR', displayText: '₹210 Trek Insurance' },
                { kind: 'transport', amount: 2600, currency: 'INR', displayText: '₹2,600 for transport to and from basecamp' },
            ],
        });
        expect(result.priceDetails.breakdownRawText).toContain('₹210');
        expect(result.priceDetails.breakdownRawText).not.toContain('₹1,300');
    });

    it('does not invent missing charges', async () => {
        document.body.innerHTML = '<h1>Har Ki Dun</h1><section><h2>Trek Fee</h2><p>₹13,450</p></section>';
        const result = await extract();
        expect(result.priceDetails.additionalCosts).toEqual([]);
        expect(result.priceDetails.taxPercentage).toBeNull();
        expect(result.priceDetails.route).toBeNull();
    });

    it('keeps an unknown insurance fee unavailable while retaining the base fee', async () => {
        loadPricing();
        document.body.innerHTML = document.body.innerHTML.replace('₹210', '₹—');
        const result = await extract();
        expect(result.priceDetails.amount).toBe(13450);
        expect(result.priceDetails.additionalCosts[0]).toMatchObject({ kind: 'insurance', amount: null });
    });

    it('does not show conflicting batch add-ons even when the base fee agrees', async () => {
        loadPricing();
        const second = document.querySelector('.trek-fee-card')!.cloneNode(true) as HTMLElement;
        second.innerHTML = second.innerHTML.replace('₹210', '₹250');
        document.body.append(second);
        const result = await extract();
        expect(result.priceDetails.amount).toBe(13450);
        expect(result.priceDetails.additionalCosts).toBeUndefined();
        expect(result.priceDetails.breakdownWarning).toContain('Confirm GST, insurance and transport');
    });
});

it.each([
    ['tth-kedarkantha.html', trekTheHimalayasAdapter, 11250, '₹11,250 +5% GST'],
    ['tth-hampta.html', trekTheHimalayasAdapter, null, PRICE_FALLBACK],
])('extracts captured DOM fixture %s', async (file, adapter, amount, price) => {
    document.body.innerHTML = readFileSync(join(__dirname, '__fixtures__', file as string), 'utf8');
    const result = await adapter.extract(createPage() as unknown as Page, `https://${adapter.domain}/fixture`);
    expect(result.priceDetails.amount).toBe(amount);
    expect(result.price).toBe(price);
});


it('rejects a captured browser challenge instead of returning an apparently successful package', async () => {
    document.body.innerHTML = readFileSync(join(__dirname, '__fixtures__', 'ih-challenge.html'), 'utf8');
    await expect(indiahikesAdapter.extract(createPage() as unknown as Page, 'https://indiahikes.com/kedarkantha-trek'))
        .rejects.toMatchObject({ code: 'provider_challenge' });
});
