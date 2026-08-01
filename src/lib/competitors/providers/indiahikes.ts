import { ExtractedPackageData, ProviderAdapter } from '../types';

export const indiahikesAdapter: ProviderAdapter = {
    domain: 'indiahikes.com',
    name: 'Indiahikes',
    extract: async (page, url: string): Promise<ExtractedPackageData> => {
        await page.waitForSelector('h1', { timeout: 10000 }).catch(() => {});

        const data = await page.evaluate(() => {
            const getText = (selector: string) => {
                const el = document.querySelector(selector);
                return el?.textContent?.replace(/\s+/g, ' ').trim() || null;
            };

            const normalize = (value: string | null | undefined) => value?.replace(/\s+/g, ' ').trim() || '';
            const pageText = normalize(document.body.textContent);
            const packageName = getText('h1') || getText('[class*="title"]');

            const priceMatch = pageText.match(/₹\s*[\d,]+/);
            const price = priceMatch?.[0] || null;
            const durationMatch = pageText.match(/\b\d+\s*(?:days|day)\b/i);
            const durationDays = durationMatch?.[0] || null;
            const altitudeMatch = pageText.match(/\b\d{1,2},?\d{3}\s*(?:ft|feet|m|metres|meters)\b/i);
            const difficultyMatch = pageText.match(/\b(Easy|Moderate|Difficult|Hard|Expert)\b/i);

            const collectNearbyList = (keywords: string[]) => {
                const headings = Array.from(document.querySelectorAll('h2, h3, h4, h5, strong, b'));
                const matchingHeading = headings.find((heading) => {
                    const text = normalize(heading.textContent).toLowerCase();
                    return keywords.some((keyword) => text.includes(keyword));
                });

                const items: string[] = [];
                let cursor = matchingHeading?.parentElement?.nextElementSibling || matchingHeading?.nextElementSibling || null;
                let scanned = 0;

                while (cursor && scanned < 5 && items.length < 8) {
                    const tagName = cursor.tagName.toLowerCase();
                    if (/^h[1-6]$/.test(tagName)) break;

                    cursor.querySelectorAll('li').forEach((item) => {
                        const text = normalize(item.textContent);
                        if (text && text.length < 160) items.push(text);
                    });

                    cursor = cursor.nextElementSibling;
                    scanned += 1;
                }

                return Array.from(new Set(items));
            };

            const itinerary = Array.from(document.querySelectorAll('h2, h3, h4, h5, [class*="itinerary"], [class*="day"]'))
                .map((element) => normalize(element.textContent))
                .filter((text) => /\bday\s*\d+\b/i.test(text))
                .slice(0, 12)
                .map((text) => {
                    const dayMatch = text.match(/\bday\s*(\d+)\b/i);
                    const day = dayMatch ? Number(dayMatch[1]) : null;
                    const title = text.replace(/\s*\|\s*/g, ' - ').slice(0, 140);

                    return {
                        day,
                        title,
                    };
                });

            const inclusions = collectNearbyList(['inclusion', 'included', 'what is included']);
            const exclusions = collectNearbyList(['exclusion', 'not included', 'extra cost', 'additional cost']);
            const safetyGear = collectNearbyList(['safety', 'medical', 'equipment']);

            const importantDetails = [
                altitudeMatch ? { label: 'Highest altitude', value: altitudeMatch[0], source: 'extracted' as const } : null,
                difficultyMatch ? { label: 'Difficulty', value: difficultyMatch[0], source: 'extracted' as const } : null,
                pageText.toLowerCase().includes('transport') ? { label: 'Transport', value: 'Mentioned on source page. Verify included vs paid add-on.', source: 'extracted' as const } : null,
                pageText.toLowerCase().includes('insurance') ? { label: 'Insurance', value: 'Mentioned on source page. Verify whether mandatory and included.', source: 'extracted' as const } : null,
                pageText.toLowerCase().includes('offloading') ? { label: 'Backpack offloading', value: 'Mentioned on source page. Verify extra cost.', source: 'extracted' as const } : null,
            ].filter(Boolean);

            const extractionWarnings = [
                inclusions.length === 0 ? 'Inclusions were not found in a clear list on the source page.' : null,
                exclusions.length === 0 ? 'Exclusions or paid add-ons were not found in a clear list on the source page.' : null,
                itinerary.length === 0 ? 'Itinerary could not be extracted reliably from the visible page content.' : null,
                'Competitor data is parsed from public page text and should be verified before purchase.',
            ].filter(Boolean);

            const fieldSources = {
                packageName: packageName ? 'extracted' as const : 'not_found' as const,
                price: price ? 'extracted' as const : 'not_found' as const,
                durationDays: durationDays ? 'extracted' as const : 'not_found' as const,
                batchSize: 'not_found' as const,
                inclusions: inclusions.length > 0 ? 'extracted' as const : 'not_found' as const,
                exclusions: exclusions.length > 0 ? 'extracted' as const : 'not_found' as const,
                safetyGear: safetyGear.length > 0 ? 'extracted' as const : 'not_found' as const,
                itinerary: itinerary.length > 0 ? 'extracted' as const : 'not_found' as const,
                importantDetails: importantDetails.length > 0 ? 'extracted' as const : 'not_found' as const,
            };

            return {
                packageName,
                price,
                durationDays,
                difficulty: difficultyMatch?.[0] || null,
                location: null,
                batchSize: null,
                inclusions,
                exclusions,
                safetyGear,
                itinerary,
                importantDetails,
                fieldSources,
                extractionWarnings,
            };
        }) as Omit<ExtractedPackageData, 'providerName' | 'sourceUrl' | 'extractedAt'>;

        if (!data.importantDetails.some((detail) => detail.label === 'Batch size')) {
            data.importantDetails.push({
                label: 'Batch size',
                value: 'Not found on the source page',
                source: 'not_found',
            });
        }

        if (!data.importantDetails.some((detail) => detail.label === 'Transport')) {
            data.importantDetails.push({
                label: 'Transport',
                value: 'Not found clearly. Check pickup/drop and whether transfers cost extra.',
                source: 'not_found',
            });
        }

        if (!data.importantDetails.some((detail) => detail.label === 'Taxes and fees')) {
            data.importantDetails.push({
                label: 'Taxes and fees',
                value: 'Not found clearly. Verify GST, insurance, rentals, and add-ons.',
                source: 'not_found',
            });
        }

        if (!data.importantDetails.some((detail) => detail.label === 'Cancellation policy')) {
            data.importantDetails.push({
                label: 'Cancellation policy',
                value: 'Not extracted. Review the provider policy before booking.',
                source: 'not_found',
            });
        }

        return {
            providerName: 'Indiahikes',
            sourceUrl: url,
            extractedAt: new Date().toISOString(),
            ...data,
        };
    },
};
