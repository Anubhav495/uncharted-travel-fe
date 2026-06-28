import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminSupabase } from '@/lib/adminSupabase';
import { getLevelForXp } from '@/lib/levels';

type LeaderboardEntry = {
    user_id: string;
    display_name: string | null;
    avatar_url: string | null;
    xp_points: number;
    level: ReturnType<typeof getLevelForXp>;
};

const RANDOM_AVATAR_POOL = [
    'https://picsum.photos/seed/mountain-ibex/150/150',
    'https://picsum.photos/seed/snow-leopard/150/150',
    'https://picsum.photos/seed/himalayan-forest/150/150',
    'https://picsum.photos/seed/alpine-lake/150/150',
    'https://picsum.photos/seed/red-panda/150/150',
    'https://picsum.photos/seed/cedar-ridge/150/150',
    'https://picsum.photos/seed/golden-eagle/150/150',
    'https://picsum.photos/seed/glacier-stream/150/150',
];

function hashString(value: string) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash;
}

function assignLeaderboardAvatars(entries: LeaderboardEntry[]) {
    const avatarCount = Math.floor(entries.length * 0.4);
    const selectedUserIds = new Set(
        [...entries]
            .sort((left, right) => hashString(left.user_id) - hashString(right.user_id))
            .slice(0, avatarCount)
            .map((entry) => entry.user_id)
    );

    const usedAvatarIndexes = new Set<number>();

    return entries.map((entry) => {
        if (!selectedUserIds.has(entry.user_id)) {
            return {
                ...entry,
                avatar_url: null,
            };
        }

        let avatarIndex = hashString(`${entry.user_id}-avatar`) % RANDOM_AVATAR_POOL.length;
        while (usedAvatarIndexes.has(avatarIndex)) {
            avatarIndex = (avatarIndex + 1) % RANDOM_AVATAR_POOL.length;
        }
        usedAvatarIndexes.add(avatarIndex);

        return {
            ...entry,
            avatar_url: RANDOM_AVATAR_POOL[avatarIndex],
        };
    });
}

const SEEDED_LEADERBOARD: LeaderboardEntry[] = [
    { user_id: 'seed-arjun-mehta', display_name: 'Arjun Mehta', avatar_url: null, xp_points: 700, level: getLevelForXp(700) },
    { user_id: 'seed-sana-khan', display_name: 'Sana Khan', avatar_url: null, xp_points: 650, level: getLevelForXp(650) },
    { user_id: 'seed-raghav-sharma', display_name: 'Raghav Sharma', avatar_url: null, xp_points: 600, level: getLevelForXp(600) },
    { user_id: 'seed-aanya-joshi', display_name: 'Aanya Joshi', avatar_url: null, xp_points: 600, level: getLevelForXp(600) },
    { user_id: 'seed-vivek-verma', display_name: 'Vivek Verma', avatar_url: null, xp_points: 550, level: getLevelForXp(550) },
    { user_id: 'seed-pranjal-gupta', display_name: 'Pranjal Gupta', avatar_url: null, xp_points: 500, level: getLevelForXp(500) },
    { user_id: 'seed-nidhi-tripathi', display_name: 'Nidhi Tripathi', avatar_url: null, xp_points: 500, level: getLevelForXp(500) },
    { user_id: 'seed-isha-thakur', display_name: 'Isha Thakur', avatar_url: null, xp_points: 450, level: getLevelForXp(450) },
    { user_id: 'seed-karan-rawat', display_name: 'Karan Rawat', avatar_url: null, xp_points: 450, level: getLevelForXp(450) },
    { user_id: 'seed-mehul-agarwal', display_name: 'Mehul Agarwal', avatar_url: null, xp_points: 400, level: getLevelForXp(400) },
    { user_id: 'seed-riya-sen', display_name: 'Riya Sen', avatar_url: null, xp_points: 400, level: getLevelForXp(400) },
    { user_id: 'seed-aman-negi', display_name: 'Aman Negi', avatar_url: null, xp_points: 350, level: getLevelForXp(350) },
    { user_id: 'seed-kritika-bose', display_name: 'Kritika Bose', avatar_url: null, xp_points: 350, level: getLevelForXp(350) },
    { user_id: 'seed-dev-malhotra', display_name: 'Dev Malhotra', avatar_url: null, xp_points: 300, level: getLevelForXp(300) },
    { user_id: 'seed-shreya-nair', display_name: 'Shreya Nair', avatar_url: null, xp_points: 300, level: getLevelForXp(300) },
    { user_id: 'seed-pratyush-gupta', display_name: 'Pratyush Gupta', avatar_url: null, xp_points: 250, level: getLevelForXp(250) },
    { user_id: 'seed-aditya-rana', display_name: 'Aditya Rana', avatar_url: null, xp_points: 250, level: getLevelForXp(250) },
    { user_id: 'seed-tanvi-saxena', display_name: 'Tanvi Saxena', avatar_url: null, xp_points: 250, level: getLevelForXp(250) },
    { user_id: 'seed-rohan-kulkarni', display_name: 'Rohan Kulkarni', avatar_url: null, xp_points: 250, level: getLevelForXp(250) },
    { user_id: 'seed-neha-bisht', display_name: 'Neha Bisht', avatar_url: null, xp_points: 250, level: getLevelForXp(250) },
];

function normalizeEntry(user: {
    user_id: string;
    display_name: string | null;
    avatar_url: string | null;
    xp_points: number | null;
}): LeaderboardEntry {
    const points = user.xp_points && user.xp_points > 0 ? user.xp_points : 250;
    return {
        user_id: user.user_id,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        xp_points: points,
        level: getLevelForXp(points),
    };
}

function mergeLeaderboard(liveEntries: LeaderboardEntry[]) {
    const merged = new Map<string, LeaderboardEntry>();

    for (const entry of SEEDED_LEADERBOARD) {
        merged.set(entry.user_id, entry);
    }

    for (const entry of liveEntries) {
        if (entry.display_name === 'Pratyush Gupta') {
            merged.set(entry.user_id, {
                ...entry,
                xp_points: 250,
                level: getLevelForXp(250),
            });
            continue;
        }

        merged.set(entry.user_id, entry);
    }

    const hasPratyush = Array.from(merged.values()).some((entry) => entry.display_name === 'Pratyush Gupta');
    if (!hasPratyush) {
        merged.set('seed-pratyush-gupta', SEEDED_LEADERBOARD.find((entry) => entry.display_name === 'Pratyush Gupta')!);
    }

    return Array.from(merged.values())
        .sort((a, b) => b.xp_points - a.xp_points)
        .slice(0, 20)
        .map((entry) => ({
            ...entry,
            avatar_url: null,
        }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { data, error } = await getAdminSupabase()
            .from('user_profiles')
            .select('user_id, display_name, avatar_url, xp_points, level')
            .order('xp_points', { ascending: false })
            .limit(50);

        if (error) throw error;

        const leaderboard = mergeLeaderboard((data || []).map(normalizeEntry));

        return res.status(200).json({ leaderboard: assignLeaderboardAvatars(leaderboard) });
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        return res.status(200).json({ leaderboard: assignLeaderboardAvatars(SEEDED_LEADERBOARD) });
    }
}
