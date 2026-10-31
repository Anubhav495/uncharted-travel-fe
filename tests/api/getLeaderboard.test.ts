import type { NextApiRequest, NextApiResponse } from 'next';
import handler, { buildLeaderboard, LeaderboardEntry, SEEDED_LEADERBOARD } from '../../pages/api/getLeaderboard';
import { getAuthenticatedUser } from '@/lib/apiAuth';
import { getAdminSupabase } from '@/lib/adminSupabase';
import { getLevelForXp } from '@/lib/levels';

jest.mock('@/lib/apiAuth', () => ({ getAuthenticatedUser: jest.fn() }));
jest.mock('@/lib/adminSupabase', () => ({ getAdminSupabase: jest.fn() }));

const makeEntry = (user_id: string, display_name: string, xp_points: number): LeaderboardEntry => ({
    user_id,
    display_name,
    avatar_url: null,
    xp_points,
    level: getLevelForXp(xp_points),
});

const mockOrder = jest.fn();
const mockedGetAuthenticatedUser = jest.mocked(getAuthenticatedUser);
const mockedGetAdminSupabase = jest.mocked(getAdminSupabase);

beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAuthenticatedUser.mockResolvedValue(null);
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockedGetAdminSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ order: mockOrder }) }),
    } as unknown as ReturnType<typeof getAdminSupabase>);
});

afterEach(() => jest.restoreAllMocks());

const getResponse = async (method = 'GET') => {
    const response = { status: jest.fn(), json: jest.fn() };
    response.status.mockReturnValue(response);
    await handler({ method } as NextApiRequest, response as unknown as NextApiResponse);
    return response;
};

describe('production leaderboard calculation', () => {
    it('retains all 28 mock profiles with their production scores and tiers', () => {
        const leaderboard = buildLeaderboard([]);
        expect(leaderboard).toHaveLength(28);
        expect(leaderboard[0]).toMatchObject({ user_id: 'seed-arjun-mehta', xp_points: 700, level: 'silver' });
        expect(leaderboard[1]).toMatchObject({ user_id: 'seed-sana-khan', xp_points: 650, level: 'silver' });
        expect(leaderboard.find(entry => entry.user_id === 'seed-pratyush-gupta')).toMatchObject({ xp_points: 250, level: 'silver' });
    });

    it('merges positive-XP live profiles with the production mock profiles', () => {
        const leaderboard = buildLeaderboard([makeEntry('live-explorer', 'Live Explorer', 900)]);
        expect(leaderboard).toHaveLength(29);
        expect(leaderboard[0]).toMatchObject({ user_id: 'live-explorer', xp_points: 900, level: 'gold' });
        expect(leaderboard.some(entry => entry.user_id === 'seed-arjun-mehta')).toBe(true);
    });

    it('lets live data replace a mock profile with the same user ID', () => {
        const leaderboard = buildLeaderboard([makeEntry('seed-arjun-mehta', 'Arjun Mehta', 1000)]);
        expect(leaderboard.filter(entry => entry.user_id === 'seed-arjun-mehta')).toHaveLength(1);
        expect(leaderboard[0]).toMatchObject({ user_id: 'seed-arjun-mehta', xp_points: 1000 });
    });

    it.each([0, -10])('excludes live profiles with %i XP', points => {
        expect(buildLeaderboard([makeEntry('unranked', 'Unranked Explorer', points)]).some(entry => entry.user_id === 'unranked')).toBe(false);
    });

    it('preserves the production 250-XP rule for Pratyush Gupta', () => {
        const leaderboard = buildLeaderboard([makeEntry('live-pratyush', 'Pratyush Gupta', 1600)]);
        expect(leaderboard.find(entry => entry.user_id === 'live-pratyush')).toMatchObject({ xp_points: 250, level: 'silver' });
    });

    it('sorts equal scores by name, then user ID', () => {
        const leaderboard = buildLeaderboard([
            makeEntry('bob', 'Bob', 900),
            makeEntry('alice-z', 'Alice', 900),
            makeEntry('alice-a', 'Alice', 900),
        ]);
        expect(leaderboard.slice(0, 3).map(entry => entry.user_id)).toEqual(['alice-a', 'alice-z', 'bob']);
    });

    it('keeps profiles outside the public top 20 when calculating global ranks', () => {
        const leaderboard = buildLeaderboard([makeEntry('outside-top-twenty', 'Outside Top Twenty', 100)]);
        expect(leaderboard.findIndex(entry => entry.user_id === 'outside-top-twenty') + 1).toBe(29);
    });
});

describe('leaderboard API', () => {
    it('returns the public top 20 while preserving the current user’s global rank', async () => {
        mockedGetAuthenticatedUser.mockResolvedValue({ id: 'outside-top-twenty', email: 'trekker@example.com', name: 'Outside Top Twenty' });
        mockOrder.mockResolvedValue({ data: [makeEntry('outside-top-twenty', 'Outside Top Twenty', 100)], error: null });
        const response = await getResponse();
        const result = response.json.mock.calls[0][0];
        expect(response.status).toHaveBeenCalledWith(200);
        expect(result.leaderboard).toHaveLength(20);
        expect(result.currentUserRank).toBe(29);
        expect(result.leaderboard.some((entry: LeaderboardEntry) => entry.user_id === 'outside-top-twenty')).toBe(false);
    });

    it('derives tiers from XP instead of trusting a stale stored level', async () => {
        mockOrder.mockResolvedValue({ data: [{ ...makeEntry('live', 'Live Explorer', 800), level: 'newcomer' }], error: null });
        const response = await getResponse();
        expect(response.json.mock.calls[0][0].leaderboard[0]).toMatchObject({ user_id: 'live', xp_points: 800, level: 'gold' });
    });

    it('returns no current-user rank for a profile with zero XP', async () => {
        mockedGetAuthenticatedUser.mockResolvedValue({ id: 'new-user', email: 'new@example.com', name: 'New User' });
        mockOrder.mockResolvedValue({ data: [makeEntry('new-user', 'New User', 0)], error: null });
        const response = await getResponse();
        expect(response.json.mock.calls[0][0].currentUserRank).toBeNull();
    });

    it('keeps deterministic production avatars on 40 percent of the public top 20', async () => {
        const first = (await getResponse()).json.mock.calls[0][0];
        const second = (await getResponse()).json.mock.calls[0][0];
        expect(first).toEqual(second);
        const avatars = first.leaderboard.map((entry: LeaderboardEntry) => entry.avatar_url).filter(Boolean);
        expect(avatars).toHaveLength(8);
        expect(new Set(avatars).size).toBe(8);
        expect(first.currentUserRank).toBeNull();
    });

    it('returns the production mock fallback if the database is unavailable', async () => {
        const error = new Error('Database unavailable');
        jest.spyOn(console, 'error').mockImplementation(() => {});
        mockOrder.mockResolvedValue({ data: null, error });
        const response = await getResponse();
        const result = response.json.mock.calls[0][0];
        expect(response.status).toHaveBeenCalledWith(200);
        expect(result.currentUserRank).toBeNull();
        expect(result.leaderboard.map(({ user_id, xp_points, level }: LeaderboardEntry) => ({ user_id, xp_points, level }))).toEqual(
            SEEDED_LEADERBOARD.map(({ user_id, xp_points, level }) => ({ user_id, xp_points, level })),
        );
        expect(result.leaderboard.filter((entry: LeaderboardEntry) => entry.avatar_url)).toHaveLength(11);
    });

    it('rejects non-GET requests without querying the database', async () => {
        const response = await getResponse('POST');
        expect(response.status).toHaveBeenCalledWith(405);
        expect(mockedGetAdminSupabase).not.toHaveBeenCalled();
        expect(mockedGetAuthenticatedUser).not.toHaveBeenCalled();
    });
});
