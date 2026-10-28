jest.mock('@/lib/apiAuth', () => ({
    getAuthenticatedUser: jest.fn(),
}));

import { buildLeaderboard, LeaderboardEntry } from '../../pages/api/getLeaderboard';
import { getLevelForXp } from '@/lib/levels';

describe('buildLeaderboard', () => {
    it('does not add profiles with zero XP to the leaderboard input', () => {
        const zeroXpEntry: LeaderboardEntry = {
            user_id: 'new-user',
            display_name: 'New User',
            avatar_url: null,
            xp_points: 0,
            level: getLevelForXp(0),
        };

        const leaderboard = buildLeaderboard([zeroXpEntry]);

        expect(leaderboard.some((entry) => entry.user_id === zeroXpEntry.user_id)).toBe(false);
    });

    it('keeps profiles outside the public top 20 so their global rank can be calculated', () => {
        const topTwentyEntries: LeaderboardEntry[] = Array.from({ length: 22 }, (_, idx) => ({
            user_id: `user-${idx}`,
            display_name: `Explorer ${idx}`,
            avatar_url: null,
            xp_points: 500 - idx * 10,
            level: getLevelForXp(500 - idx * 10),
        }));

        const liveEntries: LeaderboardEntry[] = [
            ...topTwentyEntries,
            {
                user_id: 'outside-top-twenty',
                display_name: 'Outside Top Twenty',
                avatar_url: null,
                xp_points: 10,
                level: getLevelForXp(10),
            },
        ];

        const leaderboard = buildLeaderboard(liveEntries);

        expect(leaderboard.findIndex((entry) => entry.user_id === 'outside-top-twenty') + 1).toBeGreaterThan(20);
    });
});
