import type { NextApiRequest, NextApiResponse } from 'next';
import { timingSafeEqual } from 'crypto';
import { sendBookingCompletedEmail, sendBookingCancelledEmail } from '@/lib/email';
import { getAdminSupabase } from '@/lib/adminSupabase';

/**
 * Webhook handler for Supabase Database Webhooks.
 * 
 * Supabase sends a POST request when the `booking_requests` table is updated.
 * Payload shape: { type: 'UPDATE', table: 'booking_requests', record: {...}, old_record: {...} }
 * 
 * This handler checks if the status transitioned to a terminal state
 * ('completed' or 'cancelled') and sends the appropriate email.
 */

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

function hasValidSecret(value: string | string[] | undefined): boolean {
    if (!WEBHOOK_SECRET || typeof value !== 'string') return false;
    const expected = Buffer.from(WEBHOOK_SECRET);
    const received = Buffer.from(value);
    return expected.length === received.length && timingSafeEqual(expected, received);
}

// Terminal states that trigger emails
const TERMINAL_STATES = ['completed', 'cancelled'] as const;
type TerminalState = typeof TERMINAL_STATES[number];

interface SupabaseWebhookPayload {
    type: 'INSERT' | 'UPDATE' | 'DELETE';
    table: string;
    schema: string;
    record: {
        id: string;
        full_name: string;
        email: string;
        trek_title: string;
        status: string;
        guests: number;
        approx_date: string;
        user_id: string;
        [key: string]: unknown;
    };
    old_record: {
        id: string;
        status: string;
        [key: string]: unknown;
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    if (!WEBHOOK_SECRET) {
        console.error('Webhook disabled: WEBHOOK_SECRET is not configured');
        return res.status(503).json({ message: 'Webhook is not configured' });
    }
    if (!hasValidSecret(req.headers['x-webhook-secret'])) {
        console.error('Webhook auth failed: invalid secret');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const payload = req.body as SupabaseWebhookPayload;

        // Only process UPDATE events on booking_requests
        if (payload.type !== 'UPDATE' || payload.table !== 'booking_requests') {
            return res.status(200).json({ message: 'Ignored: not a booking update' });
        }

        const newStatus = payload.record?.status;
        const oldStatus = payload.old_record?.status;

        // Only act if the status actually changed to a terminal state
        if (oldStatus === newStatus || !TERMINAL_STATES.includes(newStatus as TerminalState)) {
            return res.status(200).json({ message: 'Ignored: not a terminal status change' });
        }

        const { email, full_name, trek_title } = payload.record;

        if (!email || !full_name || !trek_title) {
            console.error('Webhook payload missing required fields:', { email, full_name, trek_title });
            return res.status(400).json({ message: 'Missing required booking fields' });
        }

        console.log(`Booking ${payload.record.id} moved to ${newStatus}. Sending email to ${email}...`);

        // Send the appropriate email
        if (newStatus === 'completed') {
            const { error: xpError } = await getAdminSupabase().rpc('award_completion_xp', {
                p_user_id: payload.record.user_id,
                p_booking_id: payload.record.id,
            });
            if (xpError) throw xpError;
            await sendBookingCompletedEmail(email, full_name, trek_title, 250);
        } else if (newStatus === 'cancelled') {
            await sendBookingCancelledEmail(email, full_name, trek_title);
        }

        return res.status(200).json({
            message: `Email sent for ${newStatus} booking`,
            bookingId: payload.record.id,
        });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
