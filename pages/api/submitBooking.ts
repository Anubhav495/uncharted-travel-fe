import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import * as z from 'zod';

// Zod Schema for API Validation (Should alias strict Indian phone rule)
const bookingApiSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number format'),
    date: z.string().min(1),
    guests: z.number().min(1).max(20),
    trekTitle: z.string().min(1),
    user_id: z.string().optional().nullable()
});

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // 1. Validate Input using Zod
    const result = bookingApiSchema.safeParse(req.body);

    if (!result.success) {
        // Return 400 with first validation error
        console.error("Validation Error:", result.error.format());
        return res.status(400).json({
            message: 'Invalid input data',
            details: result.error.flatten().fieldErrors
        });
    }

    const { name, email, phone, date, guests, trekTitle, user_id: providedUserId } = result.data;

    try {
        let finalUserId = providedUserId;

        // If user_id wasn't provided directly (or is null), try to find the user by email
        if (!finalUserId && email) {
            const { data: userRecord, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (userRecord) {
                finalUserId = userRecord.id;
            } else {
                console.log("No user found for email:", email);
            }
        }

        // Validate constraint: user_id is now REQUIRED by schema
        if (!finalUserId) {
            return res.status(400).json({
                message: 'User authentication required. Please ensure you are logged in or that your account exists.'
            });
        }

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
                    user_id: finalUserId
                },
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        return res.status(200).json({ message: 'Success', id: data[0].id });
    } catch (error: any) {
        console.error('Booking submission error:', error);
        // Better error message for foreign key violation
        if (error.code === '23503') {
            return res.status(400).json({ message: 'Please try logging out and back in.' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
