/** @jest-environment node */
import { readFileSync } from 'fs';
import path from 'path';
import { treks } from '@/data/treks';

const { buildLlmsFiles } = require('./generate-llms');

it('includes every current trek and exact listed price in the generated documents', () => {
    const files = buildLlmsFiles(treks);

    for (const trek of treks) {
        const url = `https://unchartedtravel.in/destinations/${trek.slug}`;
        expect(files['llms.txt']).toContain(url);
        expect(files['llms.txt']).toContain(trek.price);
        expect(files['llms-full.txt']).toContain(`- URL: ${url}`);
        expect(files['llms-full.txt']).toContain(`- Listed price: ${trek.price}`);
    }
});

it('reflects source changes rather than retaining manually copied trek information', () => {
    const trek = {
        ...treks[0],
        title: 'Updated Trek',
        slug: 'updated-trek',
        price: '₹12,345',
        duration: '9 Days',
        bestTimeToVisit: 'August',
        guides: [{ ...treks[0].guides![0], name: 'Updated Guide' }],
        itinerary: [{ day: 1, title: 'Updated camp', description: 'Updated route details.' }],
    };
    const files = buildLlmsFiles([trek]);

    for (const content of Object.values(files) as string[]) {
        expect(content).toContain('Updated Trek');
        expect(content).toContain('/destinations/updated-trek');
        expect(content).toContain('₹12,345');
        expect(content).toContain('9 Days');
        expect(content).not.toContain(treks[0].price);
    }
    expect(files['llms-full.txt']).toContain('Updated Guide');
    expect(files['llms-full.txt']).toContain('Updated camp');
    expect(files['llms-full.txt']).toContain('Updated route details.');
    expect(files['llms-full.txt']).toContain('August');
});

it('handles unavailable optional details and escapes Markdown table separators', () => {
    const files = buildLlmsFiles([{
        ...treks[0],
        location: 'Valley | Region',
        overview: undefined,
        guides: undefined,
        guideName: '',
        companies: undefined,
        highlights: undefined,
        itinerary: undefined,
        inclusions: undefined,
        exclusions: undefined,
        arrivalInstructions: undefined,
    }]);

    expect(files['llms.txt']).toContain('Valley \\| Region');
    expect(files['llms-full.txt']).not.toMatch(/undefined|null|\[object Object\]/);
    expect(files['llms-full.txt']).not.toContain('### Itinerary');
    expect(files['llms-full.txt']).not.toContain('### Inclusions');
    expect(files['llms-full.txt']).not.toContain('### Frequently Asked Questions');
});

it('keeps the checked-in public documents synchronized with the catalogue', () => {
    const files = buildLlmsFiles(treks);

    for (const [name, content] of Object.entries(files)) {
        expect(readFileSync(path.join(process.cwd(), 'public', name), 'utf8')).toBe(content);
    }
});
