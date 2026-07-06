import { parseMobileCatalogueView, resolveMobileCatalogueView } from './mobileCatalogueView';

describe('parseMobileCatalogueView', () => {
    it.each(['compare', 'immerse', 'convert'] as const)(
        'accepts the %s preview',
        (view) => {
            expect(parseMobileCatalogueView(view)).toBe(view);
        },
    );

    it('uses the first value when Next.js provides an array', () => {
        expect(parseMobileCatalogueView(['immerse', 'compare'])).toBe('immerse');
    });

    it.each([undefined, '', 'grid', 'COMPARE', ['unknown', 'convert']])(
        'falls back for an unsupported value',
        (view) => {
            expect(parseMobileCatalogueView(view)).toBeUndefined();
        },
    );
});

describe('resolveMobileCatalogueView', () => {
    it.each([undefined, '', 'unknown', ['unknown', 'immerse']])(
        'defaults unsupported values to compare',
        (view) => {
            expect(resolveMobileCatalogueView(view)).toBe('compare');
        },
    );

    it.each(['compare', 'immerse', 'convert'] as const)(
        'preserves the explicit %s preview',
        (view) => {
            expect(resolveMobileCatalogueView(view)).toBe(view);
        },
    );
});
