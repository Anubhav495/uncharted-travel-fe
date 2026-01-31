import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import * as z from 'zod';

// Zod Schema for Review Submission
const reviewSchema = z.object({
    booking_id: z.string().uuid('Invalid booking ID'),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    user_id: z.string().uuid('Invalid user ID')
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

    // 1. Validate Input
    const result = reviewSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid input data',
            details: result.error.flatten().fieldErrors
        });
    }

    const { booking_id, rating, comment, user_id } = result.data;

    try {
        // 2. Verify Booking Eligibility
        // Check if:
        // - Booking exists
        // - Belong to this user
        // - Status is 'completed'
        // - Has a guide assigned
        const { data: booking, error: bookingError } = await supabase
            .from('booking_requests')
            .select('id, guide_id, status')
            .eq('id', booking_id)
            .eq('user_id', user_id)
            .single();

        if (bookingError || !booking) {
            return res.status(404).json({ message: 'Booking not found or access denied.' });
        }

        if (booking.status !== 'completed') {
            return res.status(400).json({ message: 'You can only review completed treks.' });
        }

        if (!booking.guide_id) {
            return res.status(400).json({ message: 'No guide was assigned to this trek.' });
        }

        // 3. Upsert Review
        // We use upsert based on the unique constraint (booking_id) 
        // OR explicit conflict on booking_id if configured.
        // Since we have a unique constraint on booking_id in migration,
        // we can upsert or check for existence.
        // Let's use upsert for simplicity to allow editing.

        const { data: reviewData, error: reviewError } = await supabase
            .from('reviews')
            .upsert(
                {
                    user_id,
                    guide_id: booking.guide_id,
                    booking_id,
                    rating,
                    comment,
                    updated_at: new Date().toISOString() // Assuming updated_at column exists or just let trigger handle it
                },
                { onConflict: 'booking_id' }
            )
            .select()
            .single();

        if (reviewError) {
            throw reviewError;
        }

        return res.status(200).json({ message: 'Review submitted successfully', review: reviewData });

    } catch (error: any) {
        console.error('Review submission error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
