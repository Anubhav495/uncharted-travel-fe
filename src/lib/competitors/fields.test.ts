import { readFileSync } from 'fs';
import { join } from 'path';
import type { Page } from 'puppeteer';
import { indiahikesAdapter } from './providers/indiahikes';
import { trekTheHimalayasAdapter } from './providers/trekTheHimalayas';
import { collectPackageFields } from './dom';
import { resolvePackageSnapshot } from './fields';
import { normalizeBatchSize, normalizeDuration, normalizeMeasure } from './normalize';
import { checkPackageIdentity, isSupportedTrekSlug } from './identity';
import { toUnchartedPackage } from './localPackage';
import { treks } from '@/data/treks';
import { parsePackageResult } from './validation';

export function testPage() {
    return {
        waitForSelector: jest.fn().mockResolvedValue(null), waitForFunction: jest.fn().mockResolvedValue({ dispose: jest.fn() }),
        evaluate: jest.fn(async (fn: (...args: any[]) => unknown, ...args: any[]) => new Function(`return (${fn.toString()})`)()(...args)),
    } as unknown as Page;
}

afterEach(() => { document.body.innerHTML = ''; document.title = ''; });
const renderPackage = (html: string) => { document.body.innerHTML = `<h1>Hampta Pass Trek</h1>${html}`; };
const resolve = () => resolvePackageSnapshot(collectPackageFields('indiahikes', 'https://indiahikes.com/hampta-pass', '2026-11-09T00:00:00Z'));

describe.each([indiahikesAdapter, trekTheHimalayasAdapter])('$name field extraction', (adapter) => {
    it('keeps negative headings, nested qualifiers and safety claims in their own sections', async () => {
        renderPackage(`
            <section id="excluded"><h2>Not included</h2><p>Transit meals are excluded.</p><ul><li>No oxygen support available.</li></ul></section>
            <section id="included"><h2>What is included</h2><h3>Meals</h3><p>Dinner on Day 1 to breakfast on Day 5.</p>
                <ul><li>Equipment if required<ul><li>Microspikes and helmets provided.</li></ul></li></ul></section>
            <section><h2>Safety gear</h2><p>Carry your own first aid kit.</p></section>
            <article class="related-treks"><h2>Inclusions</h2><p>Free helicopter.</p></article>`);
        const data = await adapter.extract(testPage(), `https://${adapter.domain}/hampta-pass`);
        expect(data.inclusions).toContain('Meals: Dinner on Day 1 to breakfast on Day 5.');
        expect(data.inclusions.some((item) => item.includes('Transit'))).toBe(false);
        expect(data.inclusions.some((item) => item.includes('helicopter'))).toBe(false);
        expect(data.exclusions).toContain('No oxygen support available.');
        expect(data.fieldMetadata.safetyGear.items.find((item) => /No oxygen/.test(item.text)).assertion).toBe('excluded');
        expect(data.fieldMetadata.safetyGear.items.find((item) => /Microspikes/.test(item.text)).assertion).toBe('conditional');
        expect(data.fieldMetadata.safetyGear.items.find((item) => /own first aid/.test(item.text)).assertion).toBe('excluded');
        expect(data.fieldMetadata.inclusions.evidence[0].sourceUrl).toContain('#included');
    });

    it('reads labelled overview values without using cancellation numbers, drive distances or remaining seats', async () => {
        document.body.innerHTML = `<nav><p>Location</p><p>Nepal</p></nav><h1>Hampta Pass Trek</h1>
            <section id="overview"><dl><dt>Duration</dt><dd>6 days / 5 nights</dd><dt>Grade</dt><dd>Moderate to Difficult</dd>
                <dt>Location</dt><dd>Himachal Pradesh</dd><dt>Base Camp</dt><dd>Manali</dd><dt>Maximum Group Size</dt><dd>24 trekkers</dd>
                <dt>Max Altitude</dt><dd>12,500 ft</dd><dt>Trek Distance</dt><dd>22.5 km</dd></dl></section>
            <section><h2>Cancellation policy</h2><p>Duration: 15 days</p><p>Drive 195 km.</p><p>3 seats left, 2 guides.</p></section>`;
        const data = await adapter.extract(testPage(), `https://${adapter.domain}/hampta-pass`);
        expect(data).toMatchObject({ durationDays: '6 days / 5 nights', difficulty: 'Moderate to Difficult', location: 'Himachal Pradesh', batchSize: 'Maximum 24 trekkers' });
        expect(data.facts.duration).toMatchObject({ days: 6, nights: 5 });
        expect(data.facts.batchSize).toMatchObject({ maximum: 24, minimum: null, kind: 'maximum' });
        expect(data.facts.measures.trekDistance.values).toEqual([{ amount: 22.5, unit: 'km' }]);
    });

    it('keeps duplicate agreement and rejects conflicting overview/list values', async () => {
        renderPackage(`<section><p>Duration: 6 days</p><p>Duration: 6 days</p><p>Grade: Easy</p><p>Grade: Difficult</p></section>
            <section><h2>Inclusions</h2><p>Transport provided.</p></section><section><h2>Inclusions</h2><p>Transport excluded.</p></section>`);
        const data = await adapter.extract(testPage(), `https://${adapter.domain}/hampta-pass`);
        expect(data.durationDays).toBe('6 days'); expect(data.difficulty).toBeNull();
        expect(data.fieldMetadata.difficulty.status).toBe('ambiguous');
        expect(data.fieldMetadata.inclusions.status).toBe('ambiguous'); expect(data.inclusions).toEqual([]);
    });

    it('marks empty and loading sections unavailable without inventing an empty package promise', async () => {
        renderPackage('<section><h2>Inclusions</h2><div aria-busy="true"></div></section>');
        const data = await adapter.extract(testPage(), `https://${adapter.domain}/hampta-pass`);
        expect(data.fieldMetadata.inclusions.status).toBe('unavailable');
        expect(data.fieldMetadata.exclusions.status).toBe('unavailable');
        expect(data.fieldMetadata.batchSize.status).toBe('unavailable');
        expect(data.fieldMetadata.safetyGear.status).toBe('unavailable');
        renderPackage('<section><h2>Inclusions</h2><p>Meals included.</p></section>');
        const readable = await adapter.extract(testPage(), `https://${adapter.domain}/hampta-pass`);
        expect(readable.fieldMetadata.exclusions.status).toBe('not_found');
        expect(readable.fieldMetadata.batchSize.status).toBe('not_found');
    });

    it('retains fourteen days including Day 0 and ignores prose references to other days', async () => {
        renderPackage(`<section><p>Duration: 13 days</p></section><section id="itinerary">${Array.from({ length: 14 }, (_, day) =>
            `<article><h3>Day ${day}: Stage ${day}</h3><p>Trek Distance: ${day + 1}.5 km</p><p>Discuss plans for <b>day 4</b>.</p></article>`).join('')}</section>`);
        const data = await adapter.extract(testPage(), `https://${adapter.domain}/hampta-pass`);
        expect(data.itinerary).toHaveLength(14); expect(data.itinerary[0].day).toBe(0); expect(data.itinerary[13].day).toBe(13);
        expect(data.fieldMetadata.itinerary.completeness).toBe('complete');
    });

    it('flags missing days and refuses to combine different route variants', async () => {
        renderPackage('<section id="itinerary"><h3>Day 1: Arrival</h3><p>Arrive.</p><h3>Day 3: Return</h3><p>Return.</p></section>');
        const partial = await adapter.extract(testPage(), `https://${adapter.domain}/hampta-pass`);
        expect(partial.fieldMetadata.itinerary).toMatchObject({ completeness: 'partial', reason: 'missing_days' });
        renderPackage('<section id="itinerary"><div data-route="winter"><h3>Day 1: Snow</h3></div><div data-route="summer"><h3>Day 1: Meadows</h3></div></section>');
        const ambiguous = await adapter.extract(testPage(), `https://${adapter.domain}/hampta-pass`);
        expect(ambiguous.itinerary).toEqual([]); expect(ambiguous.fieldMetadata.itinerary.status).toBe('ambiguous');
    });

    it('rejects generic pages and verification pages even when they contain a price', async () => {
        document.body.innerHTML = '<h1>Explore the Himalayas</h1><p>₹8,000</p>';
        await expect(adapter.extract(testPage(), `https://${adapter.domain}/`)).rejects.toMatchObject({ code: 'invalid_package_page' });
        document.title = 'Just a moment...'; renderPackage('<p>₹8,000</p>');
        await expect(adapter.extract(testPage(), `https://${adapter.domain}/`)).rejects.toMatchObject({ code: 'provider_challenge' });
    });
});

it('preserves explicit none and contradictory provider claims with a confirmation status', () => {
    renderPackage('<section><h2>Inclusions</h2><p>Transport included.</p></section><section><h2>Exclusions</h2><p>Transport not included.</p></section>');
    const data = resolve(); expect(data.fieldMetadata.inclusions.status).toBe('ambiguous'); expect(data.exclusions).toEqual(['Transport not included.']);
    renderPackage('<section><h2>Exclusions</h2><p>None.</p></section>');
    expect(resolve().exclusions).toEqual(['None.']); expect(resolve().fieldMetadata.exclusions.status).toBe('found');
});

it('reads operational sections and links a policy without inventing a refund schedule', () => {
    renderPackage(`<section id="meals"><h2>Meals</h2><p>Vegetarian meals from Day 1 dinner to Day 5 breakfast, excluding transit.</p></section>
        <section id="policy"><h2>Cancellation Policy</h2><p>Rescheduling is subject to the selected batch conditions.</p></section>
        <a href="https://indiahikes.com/cancellation-policy">Cancellation Policy</a>
        <section><p>Pickup Location: Dehradun</p><p>Base Camp: Kotgaon</p><p>Pickup Time: 6 AM, weather permitting</p></section>`);
    const data = resolve();
    expect(data.importantDetails.find((detail) => detail.label === 'Meals').value).toContain('excluding transit');
    expect(data.importantDetails.find((detail) => detail.label === 'Cancellation policy').value).toBe('https://indiahikes.com/cancellation-policy');
    expect(data.importantDetails.find((detail) => detail.label === 'Pickup location').value).toBe('Dehradun');
    expect(data.importantDetails.find((detail) => detail.label === 'Base camp').value).toBe('Kotgaon');
});

it('retains both transport charge scopes instead of claiming a one-way charge is a round-trip total', async () => {
    renderPackage(`<section><p>Transport: ₹1,300 one-way, optional</p></section>
        <section><h2>Trek Fee</h2><p>₹13,450</p><p>+ 5% GST</p><p>+ ₹210 Trek Insurance</p><p>+ ₹2,600 for transport to and from basecamp</p></section>`);
    const data = await indiahikesAdapter.extract(testPage(), 'https://indiahikes.com/hampta-pass');
    const detail = data.importantDetails.find((item) => item.label === 'Transport');
    expect(detail.value).toContain('₹1,300 one-way, optional'); expect(detail.value).toContain('₹2,600');
    expect(detail.metadata.status).toBe('ambiguous'); expect(detail.metadata.reason).toBe('charge_scope_unresolved');
    expect(data.priceDetails.amount).toBe(13450);
});

it('does not concatenate inline spans into a false safety assertion', () => {
    renderPackage('<section><h2>Safety gear</h2><p>Oxygen is <span>not</span><span>provided</span>.</p></section>');
    expect(resolve().fieldMetadata.safetyGear.items[0].assertion).toBe('excluded');
    renderPackage('<section><h2>Safety gear</h2><p>Satellite communication is not available.</p></section>');
    expect(resolve().safetyGear).toEqual(['Satellite communication is not available.']);
});

it('reads both TTH cost tabs without reclassifying the mounted inclusion panel as exclusions', async () => {
    renderPackage('<section id="costterms"><button>Inclusion</button><button>Exclusion</button><div class="costtermsprose">Inclusion<ul><li>Meals included.</li></ul></div></section>');
    const button = Array.from(document.querySelectorAll('button')).find((element) => element.textContent === 'Exclusion')!;
    button.onclick = () => { document.querySelector('.costtermsprose')!.innerHTML = 'Exclusion<ul><li>Transport not included.</li></ul>'; };
    const data = await trekTheHimalayasAdapter.extract(testPage(), 'https://trekthehimalayas.com/hampta-pass');
    expect(data.inclusions).toEqual(['Meals included.']); expect(data.exclusions).toEqual(['Transport not included.']);
    button.onclick = null;
    document.querySelector('.costtermsprose')!.innerHTML = 'Inclusion<ul><li>Meals included.</li></ul>';
    const blockedTab = await trekTheHimalayasAdapter.extract(testPage(), 'https://trekthehimalayas.com/hampta-pass');
    expect(blockedTab.exclusions).toEqual([]); expect(blockedTab.fieldMetadata.exclusions.status).toBe('unavailable');
});

it.each([
    ['tth-kedarkantha-trek-fields.html', '6 days', 'Uttarakhand', 'Easy to Moderate', 6],
    ['tth-hampta-pass-trek-fields.html', '5 days', 'Himachal Pradesh', 'Moderate', 5],
])('reads captured provider sections: %s', (file, duration, location, difficulty, days) => {
    document.body.innerHTML = readFileSync(join(__dirname, 'providers/__fixtures__', file as string), 'utf8');
    const data = resolvePackageSnapshot(collectPackageFields('trekTheHimalayas', 'https://trekthehimalayas.com/fixture', '2026-11-09T00:00:00Z'));
    expect(data).toMatchObject({ durationDays: duration, location, difficulty }); expect(data.itinerary).toHaveLength(days as number);
    expect(data.inclusions.length).toBeGreaterThan(8); expect(data.fieldMetadata.exclusions.status).toBe('unavailable');
    expect(data.safetyGear.some((item) => /oxygen/i.test(item))).toBe(true);
    if (file === 'tth-kedarkantha-trek-fields.html') {
        expect(data.fieldMetadata.itinerary.variant).toBe('Juda-Ka-Talab');
        expect(checkPackageIdentity({ ...data, providerName: 'TTH', sourceUrl: 'https://trekthehimalayas.com/kedarkantha-trek', extractedAt: '2026-11-09' }, 'kedarkantha-trek').status).toBe('uncertain');
    }
});

it.each(['tth-kedarkantha-trek-exclusions.html', 'tth-hampta-pass-trek-exclusions.html'])('reads captured active exclusion panel: %s', (file) => {
    document.body.innerHTML = readFileSync(join(__dirname, 'providers/__fixtures__', file), 'utf8');
    const data = resolvePackageSnapshot(collectPackageFields('trekTheHimalayas', 'https://trekthehimalayas.com/fixture', '2026-11-09T00:00:00Z'));
    expect(data.exclusions.length).toBeGreaterThan(5); expect(data.inclusions).toEqual([]);
});

it('maps only explicit local package claims and identifies all current trek slugs', () => {
    const hampta = treks.find((trek) => trek.slug === 'hampta-pass')!;
    const data = toUnchartedPackage(hampta);
    expect(data.inclusions).toEqual(hampta.inclusions); expect(data.exclusions).toEqual(hampta.exclusions);
    expect(data.safetyGear.some((item) => /Microspikes/.test(item))).toBe(true);
    const absent = toUnchartedPackage({ ...hampta, inclusions: undefined, exclusions: undefined });
    expect(absent.inclusions).toEqual([]); expect(absent.fieldMetadata.inclusions.status).toBe('not_found');
    for (const trek of treks) {
        expect(isSupportedTrekSlug(trek.slug)).toBe(true);
        expect(checkPackageIdentity({ ...data, packageName: trek.title }, trek.slug).status).toBe('matched');
    }
    expect(checkPackageIdentity({ ...data, packageName: 'Hamta Pass Trek' }, 'hampta-pass').status).toBe('matched');
    expect(checkPackageIdentity({ ...data, packageName: 'Hampta Pass Winter Route' }, 'hampta-pass').status).toBe('uncertain');
    expect(() => checkPackageIdentity(data, 'sar-pass-trek')).toThrow('different trek');
});

it('normalizes only labelled duration, batch size and compatible measurements', () => {
    expect(normalizeDuration('5 nights')).toMatchObject({ days: null, nights: 5 });
    for (const value of ['0 days / 5 nights', '-5 days', '1.5 days', '6 days or 7 days']) expect(normalizeDuration(value)).toBeNull();
    expect(normalizeDuration('4 trekking days + 2 travel days')).toMatchObject({ days: null, trekkingDays: 4, travelDays: 2 });
    expect(normalizeBatchSize('8–15 participants')).toMatchObject({ minimum: 8, maximum: 15 });
    expect(normalizeBatchSize('3 seats left')).toBeNull(); expect(normalizeBatchSize('2 guides')).toBeNull(); expect(normalizeBatchSize('0')).toBeNull();
    expect(normalizeBatchSize('8–15 or 20 participants')).toBeNull();
    expect(normalizeMeasure('12,500 ft / 3,810 m')?.values).toHaveLength(2); expect(normalizeMeasure('4–5 km')).toBeNull();
});

it('rejects malformed API data before the comparison attempts to render it', () => {
    expect(() => parsePackageResult({ price: '₹8,000' })).toThrow('malformed');
    const valid = { ...toUnchartedPackage(treks[0]), sourceUrl: 'https://indiahikes.com/sar-pass', fieldMetadata: undefined };
    expect(() => parsePackageResult({ ...valid, itinerary: [{ day: -1, title: 'Bad day' }] })).toThrow('malformed');
    expect(() => parsePackageResult({ ...valid, sourceUrl: 'javascript:alert(1)' })).toThrow('malformed');
});
