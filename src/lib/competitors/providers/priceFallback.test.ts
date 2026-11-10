import type { Page } from 'puppeteer';
import { indiahikesAdapter } from './indiahikes';
import { trekTheHimalayasAdapter } from './trekTheHimalayas';
import { PRICE_FALLBACK, PRICE_FALLBACK_WARNING } from '../price';

afterEach(() => {
    document.body.innerHTML = '';
});

describe.each([indiahikesAdapter, trekTheHimalayasAdapter])('$name price fallback', (adapter) => {
    it.each([
        ['₹0', PRICE_FALLBACK, 'manual'],
        ['₹ 0.00', PRICE_FALLBACK, 'manual'],
        ['₹-500', PRICE_FALLBACK, 'manual'],
        ['-₹500', PRICE_FALLBACK, 'manual'],
        ['₹−500', PRICE_FALLBACK, 'manual'],
        ['Price on request', PRICE_FALLBACK, 'manual'],
        ['', PRICE_FALLBACK, 'manual'],
        ['₹8,00', PRICE_FALLBACK, 'manual'],
        ['₹8,000x', PRICE_FALLBACK, 'manual'],
        ['₹8,000.50', '₹8,000.50', 'extracted'],
        ['₹8,000 + 5% GST', '₹8,000 + 5% GST', 'extracted'],
        ['₹0 Current package price: ₹8,000', PRICE_FALLBACK, 'manual'],
    ])('resolves price content %s consistently', async (content, expectedPrice, source) => {
        document.body.innerHTML = '<h1>Hampta Pass Trek</h1><section><h2>Trek Fee</h2><p></p></section>';
        document.querySelector('p')!.textContent = content;
        const page = {
            waitForSelector: jest.fn().mockResolvedValue(null),
            waitForFunction: jest.fn().mockResolvedValue({ dispose: jest.fn() }),
            // Execute the actual adapter DOM extraction against the test document.
            evaluate: jest.fn(async (extract: (...args: any[]) => unknown, ...args: any[]) => extract(...args)),
        } as unknown as Page;
        const url = `https://${adapter.domain}/hampta-pass-trek`;

        const result = await adapter.extract(page, url);

        expect(result.price).toBe(expectedPrice);
        expect(result.priceDetails?.amount === null).toBe(source === 'manual');
        expect(result.fieldSources.price).toBe(source);
        expect(result.packageName).toBe('Hampta Pass Trek');
        expect(result.sourceUrl).toBe(url);
        expect(result.extractionWarnings.includes(PRICE_FALLBACK_WARNING)).toBe(source === 'manual');
    });
});
