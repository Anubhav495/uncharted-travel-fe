import type { NextApiRequest, NextApiResponse } from 'next';
import * as z from 'zod';
import { getAdminSupabase } from '@/lib/adminSupabase';

const querySchema = z.object({
    id: z.string().min(1).max(100),
    type: z.enum(['guide', 'company']),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
    const query = querySchema.safeParse(req.query);
    if (!query.success) return res.status(400).json({ message: 'Invalid provider' });

    const { data, error } = await getAdminSupabase()
        .from('reviews')
        .select('rating')
        .eq('provider_id', query.data.id)
        .eq('provider_type', query.data.type);

    if (error) return res.status(500).json({ message: 'Unable to load rating' });
    const ratings = data || [];
    const average = ratings.length
        ? ratings.reduce((total, item) => total + item.rating, 0) / ratings.length
        : null;
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ average, count: ratings.length });
}
