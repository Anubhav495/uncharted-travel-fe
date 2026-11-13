import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthenticatedUser } from '@/lib/apiAuth';
import { getAdminSupabase } from '@/lib/adminSupabase';
import { normalizeProviderName } from '@/lib/competitors/catalog';
import { providerRequestSchema } from '@/lib/competitors/providerRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const user = await getAuthenticatedUser(req, res);
        if (!user) return res.status(401).json({ message: 'Sign in to request a provider.' });
        const parsed = providerRequestSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Check your provider request.' });
        const { providerName, notes, trekSlug } = parsed.data;
        const { data, error } = await getAdminSupabase().from('provider_support_requests').insert({
            user_id: user.id,
            provider_name: providerName,
            provider_key: normalizeProviderName(providerName),
            trek_slug: trekSlug,
            notes: notes || null,
        }).select('id').single();
        if (error?.code === '23505') return res.status(409).json({ message: 'You have already requested this provider. Your request is saved for review.' });
        if (error || !data) return res.status(503).json({ message: 'We could not save your request. Please try again later.' });
        return res.status(201).json({ message: 'Provider request saved. Thank you for helping us choose who to add next.' });
    } catch {
        return res.status(503).json({ message: 'We could not save your request. Please try again later.' });
    }
}
