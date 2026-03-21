import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('user_id, display_name, avatar_url, xp_points, level')
            .order('xp_points', { ascending: false })
            .limit(50);

        if (error) throw error;

        return res.status(200).json({ leaderboard: data || [] });
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
