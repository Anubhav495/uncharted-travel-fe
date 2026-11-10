import type { Page } from 'puppeteer';
import { addIndiahikesPriceDetails, resolvePackagePriceCandidates } from './price';

export type PriceProvider = 'indiahikes' | 'trekTheHimalayas';
export const PRICE_WAIT_TIMEOUT = 6000;

export interface PackagePriceSnapshot {
    candidates: string[];
    blocks: string[];
}

/** Self-contained: Puppeteer serializes this function into the provider page. */
export function collectPackagePriceCandidates(provider: PriceProvider, waitForContent = false, includeDetails = false): string[] | boolean | PackagePriceSnapshot {
    const normalize = (value: string | null) => value?.replace(/\s+/g, ' ').trim() || '';
    if (!document.querySelector('h1')) return waitForContent ? false : includeDetails ? { candidates: [], blocks: [] } : [];

    const excluded = 'script, style, template, noscript, del, s, strike, nav, footer, [hidden], [aria-hidden="true"], [class*="line-through"], [class*="related"], [id*="related"], [class*="recommend"]';
    const ancillary = /\b(?:deposit|instalments?|installments?|booking amount|equipment|rental|transport|offloading|insurance|optional|add[- ]?ons?)\b/i;
    const excludedCache = new WeakMap<Element, boolean>();
    const isExcluded = (element: Element) => {
        if (excludedCache.has(element)) return excludedCache.get(element)!;
        const style = window.getComputedStyle(element);
        const result = element.matches(excluded)
            || style.textDecorationLine?.includes('line-through') || style.textDecoration?.includes('line-through')
            || (element as HTMLElement).style.display === 'none'
            || !!(element.parentElement && isExcluded(element.parentElement));
        excludedCache.set(element, result);
        return result;
    };
    const textCache = new WeakMap<Element, string>();
    const textOf = (element: Element): string => {
        if (textCache.has(element)) return textCache.get(element)!;
        if (isExcluded(element)) return '';
        // Join nodes with spaces: separate React spans must not concatenate two numbers.
        const result = normalize(Array.from(element.childNodes).map((node) => {
            if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
            return node instanceof Element ? textOf(node) : '';
        }).join(' '));
        textCache.set(element, result);
        return result;
    };
    const isRelatedSection = (element: Element) => {
        let section = element.closest('section, article');
        while (section) {
            if (Array.from(section.querySelectorAll('h2, h3, h4')).some((heading) => /^(?:related|other|similar|recommended)\s+(?:treks|packages)|^you may also/i.test(normalize(heading.textContent)))) return true;
            section = section.parentElement?.closest('section, article') || null;
        }
        return false;
    };
    const roots = new Set<Element>();
    const labels = /^(?:trek (?:fee|cost|price)|package (?:price|cost)|(?:listed|base|current package) price)(?:\s*(?:\(per person\)|per person))?\s*:?$/i;
    for (const element of Array.from(document.querySelectorAll('h2, h3, h4, h5, p, span, strong, b, label, dt, div'))) {
        if (!labels.test(normalize(element.textContent)) || isExcluded(element) || isRelatedSection(element)) continue;
        let root = element.parentElement;
        for (let depth = 0; root && depth < 4; depth++, root = root.parentElement) {
            if (root.matches('body, main') || root.querySelector('h1') || normalize(root.textContent).length > 1800) break;
            if (/(?:₹|\bINR\b|\bRs\.?\s)\s*[-−]?\s*\d/.test(textOf(root))) {
                if (provider === 'indiahikes') {
                    // The fee and its additional charges can be sibling wrappers.
                    for (let level = 0; root.parentElement && level < 2; level++) {
                        const parent = root.parentElement;
                        if (parent.matches('body, main') || parent.querySelector('h1') || textOf(parent).length > 1800
                            || isRelatedSection(parent)
                            || Array.from(parent.querySelectorAll('h2, h3, h4')).some((heading) => !labels.test(normalize(heading.textContent)) && !/^optional additions$/i.test(normalize(heading.textContent)))) break;
                        if (!/\b(?:GST|insurance|transport)\b/i.test(textOf(parent))) break;
                        root = parent;
                    }
                }
                roots.add(root);
                break;
            }
        }
    }

    if (provider === 'trekTheHimalayas') {
        // Observed TTH structure: a Fixed Departures section and a mobile price bar.
        const departureSections = new Set(Array.from(document.querySelectorAll('h2, h3, h4, button, span, div'))
            .filter((element) => normalize(element.textContent) === 'Fixed Departures')
            .map((element) => element.closest('section')).filter(Boolean));
        for (const section of departureSections) {
            if (!isExcluded(section) && !isRelatedSection(section)) {
                for (const row of Array.from(section.querySelectorAll('div'))) {
                    const text = textOf(row);
                    if (text.length < 220 && /\/\s*person\b/i.test(text) && /₹/.test(text)
                        && !Array.from(row.children).some((child) => /\/\s*person\b/i.test(textOf(child)) && /₹/.test(textOf(child)))) roots.add(row);
                }
            }
        }
        for (const bar of Array.from(document.querySelectorAll('div.fixed'))) {
            if (!Array.from(bar.querySelectorAll('button')).some((button) => normalize(button.textContent) === 'View Departures')) continue;
            for (const row of Array.from(bar.querySelectorAll('div'))) {
                if (/per person/i.test(textOf(row)) && /₹/.test(textOf(row)) && textOf(row).length < 160) roots.add(row);
            }
        }
    }

    const candidates: string[] = [];
    const blocks: string[] = [];
    for (const root of roots) {
        if (includeDetails) blocks.push(textOf(root));
        const clone = root.cloneNode(true) as Element;
        // Remove old prices and separately labelled charges before considering money.
        // Check styles on originals because cloned nodes have no inherited CSS.
        const originals = [root, ...Array.from(root.querySelectorAll('*'))];
        const copies = [clone, ...Array.from(clone.querySelectorAll('*'))];
        originals.forEach((element, index) => {
            if (isExcluded(element) || (element.matches('p, li, dd, tr, label') && ancillary.test(normalize(element.textContent)))
                || (element.children.length === 0 && ancillary.test(normalize(element.textContent)))) copies[index].remove();
            // A charge label and its amount can be separate spans within a row.
            if (element !== root && element.children.length === 0 && ancillary.test(normalize(element.textContent))) {
                let row = element.parentElement;
                while (row && row !== root && textOf(row).length < 180) {
                    if (/(?:₹|INR|Rs\.?)\s*\d/i.test(textOf(row)) && !labels.test(normalize(row.firstElementChild?.textContent || ''))) {
                        copies[originals.indexOf(row)].remove();
                        break;
                    }
                    row = row.parentElement;
                }
            }
        });
        // The clone no longer has crossed-out or ancillary descendants.
        const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
        const parts: string[] = [];
        while (walker.nextNode()) parts.push(walker.currentNode.textContent || '');
        const text = normalize(parts.join(' '));
        if (/\b(?:from|onwards|starting|group total|total for)\b/i.test(text)
            || /\d\s*(?:[–—-]|to)\s*(?:₹\s*)?\d/i.test(text)) {
            candidates.push('Ambiguous package price');
            continue;
        }
        const money = /(?:[-−]\s*)?(?:₹|INR\b|Rs\.?)\s*[-−]?\s*\d[\d,.]*[^₹]*?(?=(?:₹|\bINR\b|\bRs\.?\s)|$)/gi;
        for (const match of text.matchAll(money)) {
            // Keep the complete numeric token; normalization rejects malformed amounts.
            const price = match[0].match(/^(?:[-−]\s*)?(?:₹|INR\b|Rs\.?)\s*[-−]?\s*\d[\d,.]*\S*(?:\s*\+?\s*\d+(?:\.\d+)?\s*%\s*GST)?/i)?.[0];
            if (price) candidates.push(normalize(price));
        }
    }
    if (waitForContent) {
        // A zero placeholder is not ready. Give hydration a bounded chance to replace it.
        return candidates.length > 0 && candidates.every((price) => !/(?:₹|INR|Rs\.?)\s*[-−]?\s*0(?:[.,]0+)?(?:\s|$)/i.test(price));
    }
    const uniqueCandidates = Array.from(new Set(candidates));
    return includeDetails ? { candidates: uniqueCandidates, blocks: Array.from(new Set(blocks)) } : uniqueCandidates;
}

export async function extractPackagePrice(page: Page, provider: PriceProvider, timeout = PRICE_WAIT_TIMEOUT) {
    await page.waitForFunction(collectPackagePriceCandidates, { timeout, polling: 200 }, provider, true)
        .then((handle) => handle.dispose())
        .catch(() => {});
    const snapshot = await page.evaluate(collectPackagePriceCandidates, provider, false, true) as PackagePriceSnapshot;
    const result = resolvePackagePriceCandidates(snapshot.candidates);
    if (provider === 'indiahikes' && result.priceDetails.amount !== null) {
        const details = addIndiahikesPriceDetails(result.priceDetails, snapshot.blocks);
        if (details) result.priceDetails = details;
        else if (snapshot.blocks.some((block) => /\b(?:GST|insurance|transport)\b/i.test(block))) {
            result.priceDetails.breakdownWarning = 'Additional price details could not be resolved. Confirm GST, insurance and transport with the provider.';
        }
    }
    return result;
}
