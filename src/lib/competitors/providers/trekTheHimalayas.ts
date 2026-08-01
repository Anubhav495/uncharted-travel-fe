import { ExtractedPackageData, ProviderAdapter } from '../types';

export const trekTheHimalayasAdapter: ProviderAdapter = {
    domain: 'trekthehimalayas.com',
    name: 'Trek The Himalayas',
    extract: async (page, url: string): Promise<ExtractedPackageData> => {
        await page.waitForSelector('h1', { timeout: 10000 }).catch(() => {});

        const data = await page.evaluate(() => {
            const normalize = (value: string | null | undefined) => value?.replace(/\s+/g, ' ').trim() || '';
            const getText = (selector: string) => normalize(document.querySelector(selector)?.textContent);
            const pageText = normalize(document.body.textContent);
            const lowerPageText = pageText.toLowerCase();

            const packageName = getText('h1') || null;

            const getValueAfterLabel = (label: string) => {
                const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`${escapedLabel}\\s*:?\\s*([^\\n|]{1,80})`, 'i');
                return pageText.match(regex)?.[1]?.trim() || null;
            };

            const getOverviewValue = (label: string) => {
                const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`${escapedLabel}\\s*:\\s*([^:]{1,120}?)(?=\\s[A-Z][A-Za-z ]{2,}:|$)`, 'i');
                return pageText.match(regex)?.[1]?.trim() || null;
            };

            const location = getOverviewValue('Location') || getValueAfterLabel('Location');
            const durationDays = getOverviewValue('Days')
                ? `${getOverviewValue('Days')} days`
                : getValueAfterLabel('Duration') || pageText.match(/\b\d+\s*days\b/i)?.[0] || null;
            const difficulty = getOverviewValue('Grade') || getValueAfterLabel('Grade');
            const altitude = getOverviewValue('Altitude') || getValueAfterLabel('Max Altitude');
            const distance = getOverviewValue('Distance') || getValueAfterLabel('Trekking km') || getValueAfterLabel('Trekking');
            const baseCamp = getOverviewValue('Base Camp');
            const season = getOverviewValue('Season');
            const months = getOverviewValue('Months');
            const food = getOverviewValue('Food');
            const stay = getOverviewValue('Stay');
            const railHead = getOverviewValue('Rail Head');
            const airport = getOverviewValue('Airport');

            const priceMatches = Array.from(pageText.matchAll(/₹\s*[\d,]+(?:\s*\+\s*\d+%?\s*GST)?/gi))
                .map((match) => normalize(match[0]))
                .filter((price) => !/^₹\s*0\b/.test(price));
            const price = priceMatches[0] || null;

            const fallbackPrice = !price && pageText.includes('₹0')
                ? '₹0 shown on page. Check current batch price on source.'
                : null;

            const pickupMatch = pageText.match(/Pickup Location:\s*(.{1,140}?)(?=\sDrop Location:|\sPickup:|$)/i);
            const dropMatch = pageText.match(/Drop Location:\s*(.{1,140}?)(?=\sPickup:|$)/i);
            const pickupTimeMatch = pageText.match(/Pickup:\s*(.{1,120}?)(?=\sKeep at least|\sGallery|$)/i);

            const findSectionItems = (headingPattern: RegExp, stopPattern: RegExp) => {
                const headingMatch = pageText.match(headingPattern);
                if (!headingMatch?.index && headingMatch?.index !== 0) return [];

                const sectionText = pageText.slice(headingMatch.index, headingMatch.index + 5000);
                const stopMatch = sectionText.slice(headingMatch[0].length).match(stopPattern);
                const scopedText = stopMatch?.index
                    ? sectionText.slice(0, headingMatch[0].length + stopMatch.index)
                    : sectionText;

                return Array.from(scopedText.matchAll(/(?:^|\s)(?:\*|-|•)\s*([^*•-][^*•]{8,180})/g))
                    .map((match) => normalize(match[1]))
                    .filter(Boolean)
                    .slice(0, 10);
            };

            const inclusions = findSectionItems(/cost terms|inclusions?/i, /exclusions?|must watch|fitness|required/i);
            const exclusions = findSectionItems(/exclusions?/i, /must watch|fitness|required|cancellation/i);
            const safetyGear = [
                lowerPageText.includes('medical') ? 'Medical and disclaimer requirements mentioned' : null,
                lowerPageText.includes('oxygen') ? 'Oxygen support mentioned' : null,
                lowerPageText.includes('trek leader') ? 'Trek leader/support staff mentioned' : null,
            ].filter(Boolean) as string[];

            const itinerary = Array.from(pageText.matchAll(/Day\s+(\d+)\s+(.*?)(?=\sDay\s+\d+\s+|##### Note:|## |$)/gi))
                .map((match) => {
                    const dayText = normalize(match[2]);
                    const titleMatch = dayText.match(/^(.{8,140}?)(?=\sAltitude:|\sDrive Distance|\sTrek Distance|\sNote:|$)/i);
                    const description = dayText
                        .replace(titleMatch?.[0] || '', '')
                        .replace(/^Altitude:\s*/i, 'Altitude: ')
                        .slice(0, 360)
                        .trim();
                    const distanceMatch = dayText.match(/(?:Trek|Drive)?\s*Distance[^:]*:\s*([^.|;]{2,80})/i);
                    const elevationMatch = dayText.match(/Altitude[^:]*:\s*([^.|;]{2,120})/i);

                    return {
                        day: Number(match[1]),
                        title: normalize(titleMatch?.[0]) || `Day ${match[1]}`,
                        description: description || undefined,
                        distance: normalize(distanceMatch?.[1]) || undefined,
                        elevation: normalize(elevationMatch?.[1]) || undefined,
                    };
                })
                .filter((day) => day.title.length > 0)
                .slice(0, 12);

            const importantDetails = [
                altitude ? { label: 'Highest altitude', value: altitude, source: 'extracted' as const } : null,
                distance ? { label: 'Trekking distance', value: distance, source: 'extracted' as const } : null,
                baseCamp ? { label: 'Base camp', value: baseCamp, source: 'extracted' as const } : null,
                season ? { label: 'Season', value: season, source: 'extracted' as const } : null,
                months ? { label: 'Best months', value: months, source: 'extracted' as const } : null,
                food ? { label: 'Food', value: food, source: 'extracted' as const } : null,
                stay ? { label: 'Stay', value: stay, source: 'extracted' as const } : null,
                pickupMatch ? { label: 'Pickup location', value: normalize(pickupMatch[1]), source: 'extracted' as const } : null,
                dropMatch ? { label: 'Drop location', value: normalize(dropMatch[1]), source: 'extracted' as const } : null,
                pickupTimeMatch ? { label: 'Pickup/drop timing', value: normalize(pickupTimeMatch[1]), source: 'extracted' as const } : null,
                railHead ? { label: 'Nearest rail head', value: railHead, source: 'extracted' as const } : null,
                airport ? { label: 'Nearest airport', value: airport, source: 'extracted' as const } : null,
                lowerPageText.includes('buffer day') ? { label: 'Buffer day', value: 'Source recommends keeping buffer days for delays.', source: 'extracted' as const } : null,
                lowerPageText.includes('cancellation policy') ? { label: 'Cancellation policy', value: 'Cancellation policy section exists on source. Review before booking.', source: 'extracted' as const } : null,
                lowerPageText.includes('gst') ? { label: 'Taxes and fees', value: 'GST is mentioned on the source page. Verify final payable amount.', source: 'extracted' as const } : null,
            ].filter(Boolean);

            const extractionWarnings = [
                !price && fallbackPrice ? 'The page currently exposes ₹0 in the visible price block, so the actual batch price needs verification.' : null,
                inclusions.length === 0 ? 'Inclusions were not found in a clear list on the source page.' : null,
                exclusions.length === 0 ? 'Exclusions or paid add-ons were not found in a clear list on the source page.' : null,
                itinerary.length === 0 ? 'Itinerary could not be extracted reliably from the visible page content.' : null,
                'Competitor data is parsed from public page text and should be verified before purchase.',
            ].filter(Boolean) as string[];

            const resolvedPrice = price || fallbackPrice;

            return {
                packageName,
                price: resolvedPrice,
                durationDays,
                difficulty,
                location,
                batchSize: null,
                inclusions,
                exclusions,
                safetyGear,
                itinerary,
                importantDetails,
                fieldSources: {
                    packageName: packageName ? 'extracted' as const : 'not_found' as const,
                    price: price ? 'extracted' as const : fallbackPrice ? 'manual' as const : 'not_found' as const,
                    durationDays: durationDays ? 'extracted' as const : 'not_found' as const,
                    difficulty: difficulty ? 'extracted' as const : 'not_found' as const,
                    location: location ? 'extracted' as const : 'not_found' as const,
                    batchSize: 'not_found' as const,
                    inclusions: inclusions.length > 0 ? 'extracted' as const : 'not_found' as const,
                    exclusions: exclusions.length > 0 ? 'extracted' as const : 'not_found' as const,
                    safetyGear: safetyGear.length > 0 ? 'extracted' as const : 'not_found' as const,
                    itinerary: itinerary.length > 0 ? 'extracted' as const : 'not_found' as const,
                    importantDetails: importantDetails.length > 0 ? 'extracted' as const : 'not_found' as const,
                },
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

        return {
            providerName: 'Trek The Himalayas',
            sourceUrl: url,
            extractedAt: new Date().toISOString(),
            ...data,
        };
    },
};
