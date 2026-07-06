export type MobileCatalogueView = 'compare' | 'immerse' | 'convert';

export function parseMobileCatalogueView(
    value: string | string[] | undefined,
): MobileCatalogueView | undefined {
    const candidate = Array.isArray(value) ? value[0] : value;

    if (candidate === 'compare' || candidate === 'immerse' || candidate === 'convert') {
        return candidate;
    }

    return undefined;
}

export function resolveMobileCatalogueView(
    value: string | string[] | undefined,
): MobileCatalogueView {
    return parseMobileCatalogueView(value) ?? 'compare';
}
