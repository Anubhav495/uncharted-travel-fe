import type { ComparisonItineraryDay, FieldEvidence } from './types';

export interface RawField {
    text: string;
    evidence: FieldEvidence;
}
export interface RawSection {
    items: RawField[];
    evidence: FieldEvidence;
    partial: boolean;
    unavailable: boolean;
}
export interface PackageSnapshot {
    pageState: 'package' | 'challenge' | 'invalid';
    names: RawField[];
    fields: Record<string, RawField[]>;
    sections: Record<string, RawSection[]>;
    itinerary: { days: ComparisonItineraryDay[]; evidence: FieldEvidence; partial: boolean; variantUnresolved: boolean; variant?: string; alternatives?: string[] }[];
    pendingSections: string[];
    loading?: boolean;
}

/** No module-level runtime dependencies: this function executes in Chromium. */
export function collectPackageFields(provider: string, sourceUrl: string, capturedAt: string): PackageSnapshot {
    const normalize = (value: string | null | undefined) => value?.replace(/\s+/g, ' ').trim() || '';
    const snapshot: PackageSnapshot = { pageState: 'invalid', names: [], fields: {}, sections: {}, itinerary: [], pendingSections: [] };
    const skip = 'nav, header, footer, script, style, noscript, template, [hidden], [aria-hidden="true"], [class*="related"], [class*="recommend"], [class*="review"], [id*="related"], [id*="review"]';
    const excluded = (element: Element) => !!element.closest(skip)
        || !!element.closest('[style*="display: none"], [style*="display:none"]');
    const textCache = new WeakMap<Element, string>();
    const text = (element: Element): string => {
        if (textCache.has(element)) return textCache.get(element)!;
        if (excluded(element)) return '';
        const value = normalize(Array.from(element.childNodes).map((node) => node.nodeType === Node.TEXT_NODE ? node.textContent || '' : node instanceof Element ? text(node) : '').join(' '));
        textCache.set(element, value);
        return value;
    };
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter((element) => !excluded(element));
    const evidence = (element: Element, section: string, rawText: string): FieldEvidence => {
        const anchor = element.closest('[id]')?.id;
        return { sourceUrl: anchor ? `${sourceUrl.split('#')[0]}#${encodeURIComponent(anchor)}` : sourceUrl, section, rawText: rawText.slice(0, 600), capturedAt };
    };
    const title = normalize(document.title);
    const intro = normalize(document.body.textContent).slice(0, 700);
    if (/just a moment|access denied|security verification|verify you are human|captcha|vercel security checkpoint/i.test(`${title} ${intro}`)) {
        snapshot.pageState = 'challenge';
        return snapshot;
    }
    const h1s = headings.filter((heading) => heading.tagName === 'H1');
    if (!h1s.length || h1s.some((heading) => /^(?:home|(?:(?:all|our|popular) )?(?:treks?|trek packages|packages|destinations)|explore (?:the )?himalayas|page not found|404)$/i.test(text(heading)))) return snapshot;
    const hasPackageHeading = h1s.some((heading) => /\b(?:trek|pass|lake|kedarkantha|kheerganga|har ki (?:dun|doon)|dev roopa)\b/i.test(text(heading)));
    if (!hasPackageHeading) return snapshot;
    snapshot.pageState = 'package';
    snapshot.names = h1s.map((heading) => ({ text: text(heading), evidence: evidence(heading, 'Package heading', text(heading)) }));
    const packageRoot = h1s[0].closest('main') || document.body;
    snapshot.loading = !!packageRoot.querySelector('[aria-busy="true"], [data-loading="true"]');
    const inPackage = (element: Element) => packageRoot.contains(element)
        && !!(h1s[0].compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING);

    // Exact label aliases, separate from incidental numbers in body prose.
    const labels: Record<string, string[]> = {
        durationDays: ['Duration', 'Trek Duration', 'Days'], location: ['Location', 'Region', 'State'],
        difficulty: ['Difficulty', 'Grade', 'Difficulty Level'], batchSize: ['Batch Size', 'Group Size', 'Maximum Group Size', 'Max Group Size'],
        maxAltitude: ['Max Altitude', 'Maximum Altitude', 'Highest Altitude'], trekDistance: ['Trek Distance', 'Trekking Distance', 'Trekking km', 'Trekking', 'Distance'],
        baseCamp: ['Base Camp', 'Basecamp'], season: ['Season', 'Best Time', 'Best Time to Visit'], months: ['Months', 'Best Months'],
        food: ['Food', 'Meals'], stay: ['Stay', 'Accommodation'], railHead: ['Rail Head', 'Nearest Railway Station'], airport: ['Airport', 'Nearest Airport'],
        pickupLocation: ['Pickup Location', 'Pick-up Location', 'Pickup Point'], dropLocation: ['Drop Location', 'Drop-off Location', 'Drop Point'],
        pickupTime: ['Pickup Time', 'Pick-up Time'], dropTime: ['Drop Time', 'Drop-off Time'],
        bufferDay: ['Buffer Day', 'Buffer Days'], transport: ['Transport', 'Transportation'], insurance: ['Trek Insurance', 'Insurance'],
        offloading: ['Offloading', 'Backpack Offloading'],
    };
    const overviewKeys = new Set(['durationDays', 'location', 'difficulty', 'batchSize', 'maxAltitude', 'trekDistance', 'baseCamp', 'season', 'months']);
    const allAliases = Object.values(labels).flat().map((label) => label.toLowerCase());
    const labelNodes = Array.from(packageRoot.querySelectorAll('dt, th, p, span, strong, b, label, div')).filter((element) => !excluded(element) && inPackage(element));
    for (const [key, aliases] of Object.entries(labels)) {
        snapshot.fields[key] = [];
        for (const element of labelNodes) {
            const ownText = text(element).replace(/\s+:/g, ':');
            if (ownText.length > 260) continue;
            if (element.children.length && Array.from(element.children).some((child) => text(child) === ownText)) continue;
            const section = element.closest('section, article, [data-tab], [class*="overview"]');
            const context = `${section?.id || ''} ${section?.getAttribute('data-tab') || ''} ${section?.querySelector('h2, h3')?.textContent || ''}`;
            if (/itiner|day.wise/i.test(context)) continue;
            if (overviewKeys.has(key) && /itiner|day.wise|cancel|refund|faq|cost terms|exclusion|inclusion|how to reach/i.test(context)) continue;
            const alias = aliases.find((label) => ownText.toLowerCase() === label.toLowerCase()
                || ownText.toLowerCase().startsWith(`${label.toLowerCase()}:`));
            if (!alias) continue;
            let value = ownText.slice(alias.length).replace(/^\s*:\s*/, '').trim();
            if (!value) {
                let sibling = element.nextElementSibling;
                if (!sibling && element.parentElement && text(element.parentElement) === ownText) sibling = element.parentElement.nextElementSibling;
                if (sibling && !excluded(sibling) && !sibling.querySelector('h1, h2, h3') && !allAliases.includes(text(sibling).toLowerCase())) value = text(sibling);
            }
            if (!value || value.length > 220 || /^(?:loading|[-—]|n\/?a|unknown|tbd)$/i.test(value)
                || /(?:Duration|Grade|Distance|Rail Head|Stay|Airport|Base Camp|Season|Months)\s*:/i.test(value)) continue;
            if (key === 'durationDays' && alias === 'Days' && /^\d+$/.test(value)) value += ' days';
            if (key === 'batchSize' && /max/i.test(alias)) value = `Maximum ${value}`;
            snapshot.fields[key].push({ text: value, evidence: evidence(element, alias, `${alias}: ${value}`) });
        }
    }

    const classify = (label: string): string | null => {
        const value = label.replace(/[:?]\s*$/, '').trim().toLowerCase();
        if (/^(?:(?:trek|cost|package)\s+)?(?:exclusions?|not included|what(?:'s| is) not included|cost excludes|cost does not include)$/.test(value)) return 'exclusions';
        if (/^(?:(?:trek|cost|package)\s+)?(?:inclusions?|included|what(?:'s| is) included|cost includes)$/.test(value)) return 'inclusions';
        if (/^(?:safety(?: gear| equipment| and support| support)?|medical (?:support|equipment)|emergency support)$/.test(value)) return 'safetyGear';
        return null;
    };
    const readItems = (root: Element, sectionLabel: string, original: Element): RawField[] => {
        const values: RawField[] = [];
        let context = '';
        const nodes = Array.from(root.querySelectorAll('h3, h4, h5, h6, p, li, dt, dd, tr'));
        for (const node of nodes) {
            if (excluded(node)) continue;
            if (/^H[3-6]$/.test(node.tagName)) { context = text(node); continue; }
            if (node.closest('li') !== node && node.closest('li')) continue;
            const copy = node.cloneNode(true) as Element;
            copy.querySelectorAll('ul, ol, script, style, button').forEach((child) => child.remove());
            const value = text(copy);
            if (!value || /^read more|^view (?:more|details)$/i.test(value)) continue;
            if (node.tagName === 'P' && node.querySelector('strong, b')?.textContent?.trim() === value && /:\s*$/.test(value)) { context = value.replace(/:\s*$/, ''); continue; }
            const parentContext: string[] = [];
            let parentItem = node.parentElement?.closest('li');
            while (parentItem && root.contains(parentItem)) {
                const parentCopy = parentItem.cloneNode(true) as Element;
                parentCopy.querySelectorAll('ul, ol').forEach((list) => list.remove());
                if (text(parentCopy)) parentContext.unshift(text(parentCopy));
                parentItem = parentItem.parentElement?.closest('li');
            }
            const qualifiers = [context, ...parentContext].filter(Boolean).join(': ');
            const fullText = qualifiers && !value.startsWith(qualifiers) ? `${qualifiers}: ${value}` : value;
            if (fullText.length > 1200) {
                values.push({ text: fullText.slice(0, 1200), evidence: evidence(original, sectionLabel, fullText) });
            } else values.push({ text: fullText, evidence: evidence(original, sectionLabel, fullText) });
        }
        if (!values.length && text(root) && !root.querySelector('button')) values.push({ text: text(root), evidence: evidence(original, sectionLabel, text(root)) });
        return values.filter((value, index) => values.findIndex((other) => other.text === value.text) === index);
    };
    const contentAfter = (heading: Element): Element => {
        const rank = /^H[1-6]$/.test(heading.tagName) ? Number(heading.tagName.slice(1)) : 3;
        const section = heading.closest('section, article') || document.body;
        const boundary = headings.find((other) => other !== heading && !!(heading.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING)
            && Number(other.tagName.slice(1)) <= rank);
        const range = document.createRange();
        range.setStartAfter(heading);
        if (boundary && section.contains(boundary)) range.setEndBefore(boundary);
        else range.setEnd(section, section.childNodes.length);
        const container = document.createElement('div');
        container.append(range.cloneContents());
        container.querySelectorAll(skip).forEach((node) => node.remove());
        return container;
    };
    const sectionHeadings = [...headings, ...labelNodes.filter((node) => node.matches('strong, b') && !node.closest('h1, h2, h3, h4, h5, h6') && classify(text(node)))];
    for (const heading of sectionHeadings) {
        const headingText = text(heading);
        const operational = Object.entries(labels).find(([key, aliases]) => !overviewKeys.has(key) && aliases.some((alias) => alias.toLowerCase() === headingText.toLowerCase()))?.[0];
        const kind = classify(headingText) || (/\bcancellation policy\s*$/i.test(headingText) ? 'cancellationPolicy' : operational);
        if (!kind) continue;
        const root = contentAfter(heading);
        const items = readItems(root, text(heading), heading);
        const partial = !!root.querySelector('[aria-busy="true"], [data-loading="true"], button[aria-expanded="false"]') || items.some((item) => item.text.length >= 1200);
        (snapshot.sections[kind] ||= []).push({ items, evidence: evidence(heading, text(heading), text(root)), partial, unavailable: !items.length });
    }
    if (provider === 'trekTheHimalayas') {
        for (const container of Array.from(document.querySelectorAll('#costterms .costtermsprose, [data-tab="costterms"] .costtermsprose'))) {
            if (excluded(container)) continue;
            // This is the active content panel, not the adjacent Inclusion/Exclusion tabs.
            const kind = text(container).match(/^(Inclusion|Exclusion)\b/i)?.[1]?.toLowerCase();
            if (!kind) continue;
            const key = kind === 'inclusion' ? 'inclusions' : 'exclusions';
            (snapshot.sections[key] ||= []).push({ items: readItems(container, kind, container), evidence: evidence(container, kind, text(container)), partial: false, unavailable: false });
        }
        for (const button of Array.from(document.querySelectorAll('#costterms button, [data-tab="costterms"] button'))) {
            const kind = classify(text(button));
            if (kind && !snapshot.sections[kind]?.length) snapshot.pendingSections.push(kind);
        }
    }

    const itineraryRoots = new Set<Element>();
    for (const root of Array.from(document.querySelectorAll('#itinerary, [data-tab="itinerary"], [data-section="itinerary"]'))) if (!excluded(root)) itineraryRoots.add(root);
    if (!itineraryRoots.size) {
        for (const heading of headings) if (/^(?:.*?\b(?:itinerary|day.wise (?:plan|itinerary)|how does each day look))\b/i.test(text(heading))) itineraryRoots.add(contentAfter(heading));
    }
    for (const root of itineraryRoots) {
        const variants = Array.from(root.querySelectorAll('[data-variant], [data-route]')).filter((node) => !excluded(node));
        let variantUnresolved = variants.length > 1 && variants.filter((node) => node.getAttribute('aria-selected') === 'true' || node.getAttribute('data-active') === 'true').length !== 1;
        const active = variants.find((node) => node.getAttribute('aria-selected') === 'true' || node.getAttribute('data-active') === 'true') || root;
        let variant = active !== root ? active.getAttribute('data-variant') || active.getAttribute('data-route') || undefined : undefined;
        let alternatives = variants.map((node) => node.getAttribute('data-variant') || node.getAttribute('data-route') || '').filter(Boolean);
        if (provider === 'trekTheHimalayas' && !variants.length) {
            const routeControls = Array.from(root.querySelectorAll('div')).map((group) => Array.from(group.children).filter((child) => child.tagName === 'BUTTON'))
                .find((buttons) => buttons.length > 1 && buttons.every((button) => !/^(?:quick|detailed|trek graph|best route overview|food at|accom)/i.test(text(button))));
            if (routeControls) {
                alternatives = routeControls.map(text);
                // TTH currently marks the mounted route with this observed active class.
                const selected = routeControls.filter((button) => button.getAttribute('aria-selected') === 'true' || button.classList.contains('bg-red-600'));
                if (selected.length === 1) variant = text(selected[0]); else variantUnresolved = true;
            }
        }
        const labels = Array.from(active.querySelectorAll('h2, h3, h4, h5, div, span, p, strong, b'))
            .filter((node) => !excluded(node) && /^Day\s*\d+\b/i.test(text(node)) && text(node).length < 220)
            .filter((node) => !node.closest('li') && !node.parentElement?.closest('p'))
            .filter((node) => !Array.from(node.children).some((child) => /^Day\s*\d+\b/i.test(text(child))));
        const days: ComparisonItineraryDay[] = [];
        for (let index = 0; index < labels.length; index++) {
            const label = labels[index];
            const day = Number(text(label).match(/^Day\s*(\d+)/i)![1]);
            let card: Element = label;
            if (/^Day\s*\d+\s*$/i.test(text(label)) && label.parentElement && !labels.some((other) => other !== label && label.parentElement!.contains(other))) card = label.parentElement;
            let body = text(card);
            if (card === label && /^H[2-5]$/.test(label.tagName)) {
                const range = document.createRange();
                range.setStartAfter(label);
                const next = labels[index + 1];
                if (next) range.setEndBefore(next);
                else range.setEnd(active, active.childNodes.length);
                const holder = document.createElement('div'); holder.append(range.cloneContents());
                body = `${text(label)} ${text(holder)}`;
            }
            const titleNode = card.querySelector('h2, h3, h4, h5');
            const dayTitle = (titleNode ? text(titleNode) : text(label)).replace(/^Day\s*\d+\s*[:.\-–—]?\s*/i, '').trim();
            if (!dayTitle) continue;
            const rawBody = body.replace(/^Day\s*\d+\s*[:.\-–—]?\s*/i, '').trim();
            const description = rawBody.startsWith(dayTitle) ? rawBody.slice(dayTitle.length).trim() : rawBody;
            const metric = (pattern: RegExp) => description.match(pattern)?.[1]?.trim();
            days.push({ day, title: dayTitle, description: description || undefined,
                distance: metric(/((?:Trek|Drive) Distance\s*:[^|;]{1,100})/i),
                elevation: metric(/((?:Altitude|Elevation|Altitude Gain)\s*:[^|;]{1,100})/i),
                meals: metric(/Meals\s*:\s*([^|;]{1,100})/i),
                evidence: evidence(root, `Itinerary, Day ${day}`, `${text(label)} ${body}`),
            });
        }
        snapshot.itinerary.push({ days, evidence: evidence(root, variant ? `Itinerary – ${variant}` : 'Itinerary', text(root)), partial: !!root.querySelector('[aria-busy="true"], [data-loading="true"]'), variantUnresolved, variant, alternatives });
    }
    // Store policy destinations only when they are actually linked by this package.
    for (const link of Array.from(document.querySelectorAll('a[href]'))) {
        if (excluded(link) || !/^cancellation policy$/i.test(text(link))) continue;
        try {
            const destination = new URL(link.getAttribute('href')!, sourceUrl);
            if (destination.protocol !== 'https:' || destination.hostname !== new URL(sourceUrl).hostname) continue;
            (snapshot.fields.cancellationPolicy ||= []).push({ text: destination.href, evidence: evidence(link, 'Cancellation policy link', text(link)) });
        } catch { /* Ignore malformed policy links. */ }
    }
    return snapshot;
}

/** Only activate read-only tabs inside the provider's cost section. */
export function activateCostTab(kind: string): string | null {
    const label = kind === 'exclusions' ? 'Exclusion' : 'Inclusion';
    const buttons = Array.from(document.querySelectorAll('#costterms button, [data-tab="costterms"] button'));
    const button = buttons.find((element) => element.textContent?.trim() === label) as HTMLElement | undefined;
    const container = document.querySelector('#costterms .costtermsprose, [data-tab="costterms"] .costtermsprose');
    if (!button || !container) return null;
    const before = container.textContent || '';
    button.click();
    return before;
}
