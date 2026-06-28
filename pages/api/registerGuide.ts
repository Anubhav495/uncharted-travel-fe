import type { NextApiRequest, NextApiResponse } from 'next';
import * as z from 'zod';
import { getAuthenticatedUser } from '@/lib/apiAuth';
import { getAdminSupabase } from '@/lib/adminSupabase';

const guideSchema = z.object({
    fullName: z.string().trim().min(1).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    city: z.string().trim().min(1).max(100),
    state: z.string().trim().min(1).max(100),
    yearsExperience: z.string().min(1).max(20),
    languages: z.string().trim().min(1).max(250),
    treks: z.array(z.string().trim().min(1).max(150)).max(30),
}).strict();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const user = await getAuthenticatedUser(req, res);
    if (!user) return res.status(401).json({ message: 'Sign in before registering as a guide.' });

    const result = guideSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: 'Invalid registration data' });
    if (result.data.email.toLowerCase() !== user.email.toLowerCase()) {
        return res.status(403).json({ message: 'Registration email must match your signed-in account.' });
    }

    const supabase = getAdminSupabase();
    const [{ data: emailMatch }, { data: phoneMatch }] = await Promise.all([
        supabase.from('guides').select('id').eq('email', result.data.email).limit(1).maybeSingle(),
        supabase.from('guides').select('id').eq('phone', result.data.phone).limit(1).maybeSingle(),
    ]);

    if (emailMatch || phoneMatch) {
        return res.status(409).json({ message: 'A guide application already uses this email or phone.' });
    }

    const { data: guide, error: guideError } = await supabase
        .from('guides')
        .insert({
            nextauth_user_id: user.id,
            full_name: result.data.fullName,
            email: user.email,
            phone: result.data.phone,
            country_code: '+91',
            city: result.data.city,
            state: result.data.state,
            years_experience: result.data.yearsExperience,
            languages: result.data.languages,
        })
        .select('id')
        .single();

    if (guideError || !guide) {
        console.error('Guide registration error:', guideError);
        return res.status(500).json({ message: 'Unable to submit guide application.' });
    }

    if (result.data.treks.length) {
        const { error: trekError } = await supabase
            .from('guide_treks')
            .insert(result.data.treks.map((trek) => ({ guide_id: guide.id, trek_name: trek })));
        if (trekError) {
            await supabase.from('guides').delete().eq('id', guide.id);
            console.error('Guide trek registration error:', trekError);
            return res.status(500).json({ message: 'Unable to submit guide application.' });
        }
    }

    return res.status(201).json({ message: 'Guide application submitted.' });
}
