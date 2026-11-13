import { buildComparisonPath, readComparisonSelection } from './comparisonLink';
import { treks } from '@/data/treks';

it('round trips a valid comparison with unique providers in catalog order', () => {
    const path = buildComparisonPath({ trekSlug: 'hampta-pass', providerIds: ['indiahikes', 'trek-the-himalayas', 'indiahikes'] });
    expect(path).toBe('/compare?trek=hampta-pass&providers=trek-the-himalayas%2Cindiahikes');
    expect(readComparisonSelection(new URL(path, 'https://example.com').searchParams)).toEqual({
        trekSlug: 'hampta-pass', providerIds: ['trek-the-himalayas', 'indiahikes'],
    });
});

it('ignores unsupported providers, URLs and unavailable provider/trek combinations', () => {
    expect(readComparisonSelection(new URLSearchParams('trek=sar-pass-trek&providers=indiahikes,unknown,https://example.com&providers=trek-the-himalayas,trek-the-himalayas'))).toEqual({
        trekSlug: 'sar-pass-trek', providerIds: ['trek-the-himalayas'],
    });
    expect(buildComparisonPath({ trekSlug: 'sar-pass-trek', providerIds: ['indiahikes'] })).toBe('/compare?trek=sar-pass-trek');
});

it.each(['providers=trek-the-himalayas', 'trek=unknown&providers=trek-the-himalayas', 'trek=https://example.com&providers=indiahikes'])('never applies providers to an invalid or missing trek: %s', (query) => {
    expect(readComparisonSelection(new URLSearchParams(query))).toEqual({ trekSlug: treks[0].slug, providerIds: [] });
});

it('supports trek-only links and omits unrelated query parameters from generated links', () => {
    const selection = readComparisonSelection(new URLSearchParams('trek=hampta-pass&token=private&url=https://example.com'));
    expect(selection).toEqual({ trekSlug: 'hampta-pass', providerIds: [] });
    expect(buildComparisonPath(selection)).toBe('/compare?trek=hampta-pass');
});
