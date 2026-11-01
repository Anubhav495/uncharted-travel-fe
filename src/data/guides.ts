import { Guide } from '@/types/trek';
import { treks } from '@/data/treks';

export interface GuideProfile extends Guide {
    /** URL-safe ID used for /guides/[id] route. Matches guide.id from trek data. */
    profileId: string;
    /** All trek slugs this guide leads. */
    trekSlugs: string[];
}

/**
 * Deduplicates guides across all treks by their id field.
 * Only guides with a name, avatar, and description are included.
 * Generated from src/data/treks/ — do NOT hand-edit.
 */
function buildGuideProfiles(): GuideProfile[] {
    const seen = new Map<string, GuideProfile>();

    for (const trek of treks) {
        for (const guide of trek.guides ?? []) {
            if (!guide.id || !guide.name || !guide.avatar || !guide.description) {
                continue; // skip incomplete guides — listed as TODOs in SEO report
            }
            if (seen.has(guide.id)) {
                // Already have this guide — just add the trek slug
                if (!seen.get(guide.id)!.trekSlugs.includes(trek.slug)) {
                    seen.get(guide.id)!.trekSlugs.push(trek.slug);
                }
            } else {
                seen.set(guide.id, {
                    ...guide,
                    profileId: guide.id,
                    trekSlugs: [trek.slug],
                });
            }
        }
    }

    return Array.from(seen.values());
}

export const guideProfiles: GuideProfile[] = buildGuideProfiles();

/** Helper: find a guide profile by profileId */
export function getGuideById(id: string): GuideProfile | undefined {
    return guideProfiles.find((g) => g.profileId === id);
}

/** Helper: find a guide profile by exact name */
export function getGuideByName(name: string): GuideProfile | undefined {
    return guideProfiles.find((g) => g.name.toLowerCase() === name.toLowerCase());
}

/** Helper: get trek data for a guide's trek slugs */
export function getTreksForGuide(profileId: string) {
    const guide = getGuideById(profileId);
    if (!guide) return [];
    return treks.filter((t) => guide.trekSlugs.includes(t.slug));
}
