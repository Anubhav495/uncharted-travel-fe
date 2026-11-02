import type { Trek } from '@/types/trek';

export function buildTrekFaqs(trek: Trek): { q: string; a: string }[] {
    const price = /(?:per\s+person|\/\s*person)\b/i.test(trek.price)
        ? trek.price
        : `${trek.price} per person`;
    const items = [
        {
            q: `How much does the ${trek.title} cost?`,
            a: `The ${trek.title} starts at ${price}. Contact your selected guide or operator for group pricing and exact inclusions.`,
        },
        {
            q: `How many days is the ${trek.title}?`,
            a: `The ${trek.title} is ${trek.duration}.${trek.itinerary?.length ? ` The route covers ${trek.itinerary.length} stages from ${trek.itinerary[0].title} to ${trek.itinerary[trek.itinerary.length - 1].title}.` : ''}`,
        },
        {
            q: `How difficult is the ${trek.title}?`,
            a: `The ${trek.title} is rated ${trek.difficulty}. Ask your guide about fitness requirements, preparation, and current trail conditions before booking.`,
        },
    ];

    if (trek.maxAltitude) {
        items.push({
            q: `What is the maximum altitude of the ${trek.title}?`,
            a: `The highest point of the ${trek.title} is ${trek.maxAltitude}.`,
        });
    }

    if (trek.bestTimeToVisit) {
        items.push({
            q: `When is the best time to do the ${trek.title}?`,
            a: `The best time to do the ${trek.title} is ${trek.bestTimeToVisit}. Conditions and trail accessibility can vary — your guide will confirm before departure.`,
        });
    }

    items.push({
        q: `Where does the ${trek.title} start?`,
        a: trek.basecamp
            ? `The ${trek.title} starts from ${trek.basecamp}, located in ${trek.location}.`
            : `The ${trek.title} is located in ${trek.location}. Contact us for the exact trailhead details and how to reach the starting point.`,
    });

    return items;
}
