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

        const MOCK_USERS = [
            { user_id: 'mock-1', display_name: 'Aarav Patel', avatar_url: null, xp_points: 1250, level: 'gold' },
            { user_id: 'mock-2', display_name: 'Rohan Desai', avatar_url: null, xp_points: 1000, level: 'gold' },
            { user_id: 'mock-3', display_name: 'Neha Sharma', avatar_url: null, xp_points: 850, level: 'silver' },
            { user_id: 'mock-4', display_name: 'Karthik Reddy', avatar_url: null, xp_points: 750, level: 'silver' },
            { user_id: 'mock-5', display_name: 'Shreya Iyer', avatar_url: null, xp_points: 600, level: 'silver' },
            { user_id: 'mock-6', display_name: 'Aditya Singh', avatar_url: null, xp_points: 500, level: 'silver' },
            { user_id: 'mock-7', display_name: 'Meera Joshi', avatar_url: null, xp_points: 450, level: 'bronze' },
            { user_id: 'mock-8', display_name: 'Vikram Nair', avatar_url: null, xp_points: 400, level: 'bronze' },
            { user_id: 'mock-9', display_name: 'Nidhi Tripathi', avatar_url: null, xp_points: 350, level: 'bronze' },
            { user_id: 'mock-10', display_name: 'Siddharth Rao', avatar_url: null, xp_points: 300, level: 'bronze' },
            { user_id: 'mock-11', display_name: 'Pooja Mehta', avatar_url: null, xp_points: 250, level: 'bronze' },
            { user_id: 'mock-12', display_name: 'Arjun Menon', avatar_url: null, xp_points: 250, level: 'bronze' },
            { user_id: 'mock-13', display_name: 'Kavya Pillai', avatar_url: null, xp_points: 250, level: 'bronze' },
            { user_id: 'mock-14', display_name: 'Devansh Kumar', avatar_url: null, xp_points: 250, level: 'bronze' },
            { user_id: 'mock-15', display_name: 'Nisha Bhatia', avatar_url: null, xp_points: 250, level: 'bronze' },
        ];

        let combinedData = [...(data || []), ...MOCK_USERS];
        
        // Ensure every user has at least 250 XP (1 trek) and is at least Bronze
        combinedData = combinedData.map(u => ({
            ...u,
            xp_points: Math.max(u.xp_points || 0, 250),
            level: (u.xp_points || 0) < 250 ? 'bronze' : u.level
        }));

        // Sort the combined list by xp_points descending
        combinedData.sort((a, b) => b.xp_points - a.xp_points);
        
        // Take top 20
        combinedData = combinedData.slice(0, 20);

        return res.status(200).json({ leaderboard: combinedData });
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
