// Level calculation utilities for the community feature

import { UserLevel, XPAction } from '@/types/community';

// Level thresholds
export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
    newcomer: 0,
    bronze: 1,
    silver: 250,
    gold: 750,
    platinum: 1500,
};

// XP rewards for different actions
export const XP_REWARDS: Record<XPAction, number> = {
    first_booking: 100,
    booking_complete: 50,
    group_join: 30,
    group_create: 75,
    review_given: 15,
    review_received: 25,
    referral: 50,
    report_validated: 10,
};

// Level badge colors (Tailwind classes)
export const LEVEL_COLORS: Record<UserLevel, { bg: string; text: string; border: string }> = {
    newcomer: {
        bg: 'bg-slate-600',
        text: 'text-slate-300',
        border: 'border-slate-500',
    },
    bronze: {
        bg: 'bg-amber-700',
        text: 'text-amber-100',
        border: 'border-amber-600',
    },
    silver: {
        bg: 'bg-slate-400',
        text: 'text-slate-900',
        border: 'border-slate-300',
    },
    gold: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-900',
        border: 'border-yellow-400',
    },
    platinum: {
        bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
        text: 'text-white',
        border: 'border-purple-400',
    },
};

// Level display names
export const LEVEL_NAMES: Record<UserLevel, string> = {
    newcomer: 'Newcomer',
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
};

/**
 * Calculate user level based on XP points
 */
export function calculateLevel(xp: number): UserLevel {
    if (xp >= LEVEL_THRESHOLDS.platinum) return 'platinum';
    if (xp >= LEVEL_THRESHOLDS.gold) return 'gold';
    if (xp >= LEVEL_THRESHOLDS.silver) return 'silver';
    if (xp >= LEVEL_THRESHOLDS.bronze) return 'bronze';
    return 'newcomer';
}

/**
 * Get XP needed for the next level
 */
export function getNextLevelXP(currentLevel: UserLevel): number | null {
    switch (currentLevel) {
        case 'newcomer':
            return LEVEL_THRESHOLDS.bronze;
        case 'bronze':
            return LEVEL_THRESHOLDS.silver;
        case 'silver':
            return LEVEL_THRESHOLDS.gold;
        case 'gold':
            return LEVEL_THRESHOLDS.platinum;
        case 'platinum':
            return null; // Max level
    }
}

/**
 * Get the next level name
 */
export function getNextLevel(currentLevel: UserLevel): UserLevel | null {
    switch (currentLevel) {
        case 'newcomer':
            return 'bronze';
        case 'bronze':
            return 'silver';
        case 'silver':
            return 'gold';
        case 'gold':
            return 'platinum';
        case 'platinum':
            return null;
    }
}

/**
 * Calculate progress percentage to next level
 */
export function getLevelProgress(xp: number, currentLevel: UserLevel): number {
    const nextLevelXP = getNextLevelXP(currentLevel);
    if (nextLevelXP === null) return 100; // Max level

    const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
    const xpInCurrentLevel = xp - currentThreshold;
    const xpNeededForNext = nextLevelXP - currentThreshold;

    return Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));
}

/**
 * Check if user can access community features (browse/join groups)
 * Requires Silver level (250+ XP)
 */
export function canAccessCommunity(level: UserLevel): boolean {
    return ['silver', 'gold', 'platinum'].includes(level);
}

/**
 * Check if user can join groups
 * Requires Silver level (250+ XP)
 */
export function canJoinGroups(level: UserLevel): boolean {
    return ['silver', 'gold', 'platinum'].includes(level);
}

/**
 * Check if user can create groups
 * Requires Gold level (750+ XP)
 */
export function canCreateGroups(level: UserLevel): boolean {
    return ['gold', 'platinum'].includes(level);
}

/**
 * Check if user can create private groups
 * Requires Platinum level (1500+ XP)
 */
export function canCreatePrivateGroups(level: UserLevel): boolean {
    return level === 'platinum';
}

/**
 * Get maximum group size for a level
 */
export function getMaxGroupSize(level: UserLevel): number {
    switch (level) {
        case 'platinum':
            return 20;
        case 'gold':
            return 10;
        default:
            return 0; // Cannot create groups
    }
}

/**
 * Get level badge styling
 */
export function getLevelBadge(level: UserLevel) {
    return {
        name: LEVEL_NAMES[level],
        colors: LEVEL_COLORS[level],
    };
}

/**
 * Format XP with thousands separator
 */
export function formatXP(xp: number): string {
    return xp.toLocaleString();
}

/**
 * Get XP reward for an action
 */
export function getXPReward(action: XPAction): number {
    return XP_REWARDS[action];
}
