import type { NextApiRequest, NextApiResponse } from 'next';
import * as z from 'zod';
import { getAuthenticatedUser } from '@/lib/apiAuth';
import { getAdminSupabase } from '@/lib/adminSupabase';
import { treks } from '@/data/treks';

const updateSchema = z.object({
    action: z.enum(['update', 'cancel']).optional().default('update'),
    bookingId: z.string().uuid(),
    date: z.string().min(1).max(50).optional(),
    guests: z.number().int().min(1).max(20).optional(),
});

function providerName(providerId?: string | null, providerType?: string | null) {
    if (!providerId || !providerType) return null;
    for (const trek of treks) {
        if (providerType === 'guide') {
            const guide = trek.guides?.find((item) => item.id === providerId);
            if (guide) return guide.name;
        } else if (providerType === 'company') {
            const company = trek.companies?.find((item) => item.id === providerId);
            if (company) return company.name;
        }
    }
    return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await getAuthenticatedUser(req, res);
    if (!user) return res.status(401).json({ message: 'Authentication required' });
    const supabase = getAdminSupabase();

    if (req.method === 'GET') {
        const [{ data: bookings, error: bookingError }, { data: reviews, error: reviewError }] = await Promise.all([
            supabase.from('booking_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('reviews').select('id, booking_id, rating, comment').eq('user_id', user.id),
        ]);

        if (bookingError || reviewError) {
            console.error('Dashboard fetch error:', bookingError || reviewError);
            return res.status(500).json({ message: 'Unable to load dashboard' });
        }

        return res.status(200).json({
            bookings: (bookings || []).map((booking) => ({
                ...booking,
                provider_name: providerName(booking.provider_id, booking.provider_type),
            })),
            reviews: reviews || [],
        });
    }

    if (req.method === 'PATCH') {
        const result = updateSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json({ message: 'Invalid request' });

        if (result.data.action === 'cancel') {
            const { data, error } = await supabase
                .from('booking_requests')
                .update({ status: 'cancelled' })
                .eq('id', result.data.bookingId)
                .eq('user_id', user.id)
                .eq('status', 'pending')
                .select('id')
                .maybeSingle();

            if (error) return res.status(500).json({ message: 'Unable to cancel enquiry' });
            if (!data) return res.status(404).json({ message: 'Enquiry not found or cannot be cancelled' });
            return res.status(200).json({ message: 'Enquiry cancelled' });
        }

        if (!result.data.date || !result.data.guests) {
            return res.status(400).json({ message: 'Date and guests are required to update' });
        }

        const { data, error } = await supabase
            .from('booking_requests')
            .update({ approx_date: result.data.date, guests: result.data.guests })
            .eq('id', result.data.bookingId)
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .select('id')
            .maybeSingle();

        if (error) return res.status(500).json({ message: 'Unable to update enquiry' });
        if (!data) return res.status(404).json({ message: 'Editable enquiry not found' });
        return res.status(200).json({ message: 'Enquiry updated' });
    }

    res.setHeader('Allow', ['GET', 'PATCH']);
    return res.status(405).json({ message: 'Method not allowed' });
}
