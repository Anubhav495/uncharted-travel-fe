import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Add user_id to destructuring (it might be undefined if guest)
    const { name, email, phone, date, guests, trekTitle, user_id } = req.body;

    if (!name || !email || !phone || !trekTitle) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const { data, error } = await supabase
            .from('booking_requests')
            .insert([
                {
                    full_name: name,
                    email,
                    phone,
                    approx_date: date,
                    guests,
                    trek_title: trekTitle,
                    status: 'pending',
                    user_id: user_id || null
                },
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        return res.status(200).json({ message: 'Success', id: data[0].id });
    } catch (error) {
        console.error('Booking submission error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
