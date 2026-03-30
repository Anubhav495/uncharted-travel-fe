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
            { user_id: 'mock-16', display_name: 'Ananya Verma', avatar_url: null, xp_points: 200, level: 'newcomer' },
            { user_id: 'mock-17', display_name: 'Rahul Kapoor', avatar_url: null, xp_points: 150, level: 'newcomer' },
            { user_id: 'mock-18', display_name: 'Tanya Mittal', avatar_url: null, xp_points: 100, level: 'newcomer' },
            { user_id: 'mock-19', display_name: 'Ishaan Gupta', avatar_url: null, xp_points: 50, level: 'newcomer' },
            { user_id: 'mock-20', display_name: 'Sanya Malhotra', avatar_url: null, xp_points: 25, level: 'newcomer' },
        ];

        // Combine real and mock users
        let combinedData = [...(data || []), ...MOCK_USERS];
        
        // Ensure every user has points and a consistent level based on actual XP
        combinedData = combinedData.map(u => {
            const points = u.xp_points || 0;
            return {
                ...u,
                xp_points: points,
                // Simple level logic for consistency
                level: points >= 1500 ? 'platinum' :
                       points >= 1000 ? 'gold' :
                       points >= 500  ? 'silver' :
                       points >= 250  ? 'bronze' : 'newcomer'
            };
        });

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
