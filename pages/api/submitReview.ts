import type { NextApiRequest, NextApiResponse } from 'next';
import * as z from 'zod';
import { getAuthenticatedUser } from '@/lib/apiAuth';
import { getAdminSupabase } from '@/lib/adminSupabase';

const reviewSchema = z.object({
    booking_id: z.string().uuid('Invalid booking ID'),
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().max(2000).optional(),
}).strict();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const user = await getAuthenticatedUser(req, res);
    if (!user) return res.status(401).json({ message: 'Authentication required' });

    const result = reviewSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid input data',
            details: result.error.flatten().fieldErrors,
        });
    }

    const { booking_id, rating, comment } = result.data;
    const supabase = getAdminSupabase();
    const { data: booking, error: bookingError } = await supabase
        .from('booking_requests')
        .select('id, provider_id, provider_type, status')
        .eq('id', booking_id)
        .eq('user_id', user.id)
        .single();

    if (bookingError || !booking) {
        return res.status(404).json({ message: 'Booking not found or access denied.' });
    }
    if (booking.status !== 'completed') {
        return res.status(400).json({ message: 'You can only review completed treks.' });
    }
    if (!booking.provider_id || !booking.provider_type) {
        return res.status(400).json({ message: 'No provider was assigned to this trek.' });
    }

    const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .upsert({
            user_id: user.id,
            provider_id: booking.provider_id,
            provider_type: booking.provider_type,
            booking_id,
            rating,
            comment: comment || null,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'booking_id' })
        .select()
        .single();

    if (reviewError || !review) {
        console.error('Review submission error:', reviewError);
        return res.status(500).json({ message: 'Unable to submit review' });
    }

    const { error: xpError } = await supabase.rpc('award_review_xp', {
        p_user_id: user.id,
        p_review_id: review.id,
    });
    if (xpError) console.error('Unable to award review XP:', xpError);

    return res.status(200).json({ message: 'Review submitted successfully', review });
}
