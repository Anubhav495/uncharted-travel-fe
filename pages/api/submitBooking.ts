import type { NextApiRequest, NextApiResponse } from 'next';
import * as z from 'zod';
import { getAuthenticatedUser } from '@/lib/apiAuth';
import { getAdminSupabase } from '@/lib/adminSupabase';
import { sendBookingNotification } from '@/lib/telegram';
import { treks } from '@/data/treks';

const bookingSchema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number format'),
    date: z.string().min(1).max(50),
    guests: z.number().int().min(1).max(20),
    trekTitle: z.string().trim().min(1).max(150),
    bookingPreference: z.object({
        type: z.enum(['guide', 'company', 'general']),
        name: z.string().max(150).optional(),
        id: z.string().max(100).optional(),
    }).optional(),
}).strict();

const statusQuerySchema = z.object({ trekTitle: z.string().trim().min(1).max(150) });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await getAuthenticatedUser(req, res);
    if (!user) return res.status(401).json({ message: 'Authentication required' });

    const supabase = getAdminSupabase();

    if (req.method === 'GET') {
        const query = statusQuerySchema.safeParse(req.query);
        if (!query.success) return res.status(400).json({ message: 'Invalid trek title' });

        const { data, error } = await supabase
            .from('booking_requests')
            .select('id')
            .eq('user_id', user.id)
            .eq('trek_title', query.data.trekTitle)
            .eq('status', 'pending')
            .limit(1)
            .maybeSingle();

        if (error) return res.status(500).json({ message: 'Unable to check enquiry' });
        return res.status(200).json({ hasEnquired: Boolean(data) });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const result = bookingSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid input data',
            details: result.error.flatten().fieldErrors,
        });
    }

    const { phone, date, guests, trekTitle, bookingPreference } = result.data;
    const trek = treks.find((item) => item.title === trekTitle);
    if (!trek) return res.status(400).json({ message: 'Unknown trek' });

    if (bookingPreference?.type === 'guide' && !trek.guides?.some((guide) => guide.id === bookingPreference.id)) {
        return res.status(400).json({ message: 'Guide is not available for this trek' });
    }
    if (bookingPreference?.type === 'company' && !trek.companies?.some((company) => company.id === bookingPreference.id)) {
        return res.status(400).json({ message: 'Company is not available for this trek' });
    }

    const { data: existing } = await supabase
        .from('booking_requests')
        .select('id')
        .eq('user_id', user.id)
        .eq('trek_title', trekTitle)
        .eq('status', 'pending')
        .limit(1)
        .maybeSingle();

    if (existing) {
        return res.status(409).json({ message: 'An active enquiry already exists for this trek.' });
    }

    const { data, error } = await supabase
        .from('booking_requests')
        .insert({
            full_name: user.name || result.data.name,
            email: user.email,
            phone,
            approx_date: date,
            guests,
            trek_title: trekTitle,
            status: 'pending',
            user_id: user.id,
            provider_id: bookingPreference?.type !== 'general' ? bookingPreference?.id || null : null,
            provider_type: bookingPreference?.type !== 'general' ? bookingPreference?.type : null,
        })
        .select('id')
        .single();

    if (error || !data) {
        console.error('Booking submission error:', error);
        return res.status(500).json({ message: 'Unable to submit enquiry' });
    }

    void sendBookingNotification({
        name: user.name || result.data.name,
        email: user.email,
        phone,
        date,
        guests,
        trekTitle,
        bookingId: data.id,
    });

    return res.status(201).json({ message: 'Success', id: data.id });
}
