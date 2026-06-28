import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminSupabase } from '@/lib/adminSupabase';
import { getLevelForXp } from '@/lib/levels';

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

        const leaderboard = (data || []).map((user) => {
            const points = user.xp_points || 0;
            return {
                ...user,
                xp_points: points,
                level: getLevelForXp(points),
            };
        });

        return res.status(200).json({ leaderboard: leaderboard.slice(0, 20) });
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
