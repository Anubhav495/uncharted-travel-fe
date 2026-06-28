import { getLevelForXp } from './levels';

describe('getLevelForXp', () => {
    it.each([
        [0, 'newcomer'],
        [1, 'bronze'],
        [249, 'bronze'],
        [250, 'silver'],
        [749, 'silver'],
        [750, 'gold'],
        [1499, 'gold'],
        [1500, 'platinum'],
    ])('maps %i XP to %s', (xp, expected) => {
        expect(getLevelForXp(xp)).toBe(expected);
    });
});
