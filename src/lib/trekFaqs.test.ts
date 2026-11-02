import { buildTrekFaqs } from './trekFaqs';
import { hamptaPassTrek } from '@/data/treks/hampta-pass';
import { baraadsarLakeTrek } from '@/data/treks/baraadsar-lake';

it('uses the current trek price, route, altitude, season, and base camp in answers', () => {
    const trek = {
        ...hamptaPassTrek,
        price: '₹11,000',
        maxAltitude: '14,200 ft',
        bestTimeToVisit: 'July to September',
        basecamp: 'Updated base camp',
        itinerary: [{ day: 1, title: 'New starting point', description: '' }],
    };
    const answers = buildTrekFaqs(trek).map((item) => item.a).join('\n');

    expect(answers).toContain('₹11,000 per person');
    expect(answers).toContain('New starting point');
    expect(answers).toContain('14,200 ft');
    expect(answers).toContain('July to September');
    expect(answers).toContain('Updated base camp');
    expect(answers).not.toContain(hamptaPassTrek.price);
});

it('does not repeat the price unit when the catalogue already specifies per person', () => {
    const answer = buildTrekFaqs(baraadsarLakeTrek)[0].a;

    expect(answer).toContain(baraadsarLakeTrek.price);
    expect(answer).not.toContain('/ person per person');
});

it('omits unknown altitude and season answers without inventing missing route details', () => {
    const items = buildTrekFaqs({
        ...hamptaPassTrek,
        maxAltitude: undefined,
        bestTimeToVisit: undefined,
        basecamp: undefined,
        itinerary: undefined,
    });

    expect(items).toHaveLength(4);
    expect(items.map((item) => item.a).join('\n')).not.toMatch(/undefined|null/);
    expect(items[3].a).toContain('Contact us for the exact trailhead details');
});
