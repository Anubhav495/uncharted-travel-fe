export type UserLevel = 'newcomer' | 'bronze' | 'silver' | 'gold' | 'platinum';

export function getLevelForXp(xp: number): UserLevel {
    if (xp >= 1500) return 'platinum';
    if (xp >= 750) return 'gold';
    if (xp >= 250) return 'silver';
    if (xp >= 1) return 'bronze';
    return 'newcomer';
}
