import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './authOptions';
import { getAdminSupabase } from './adminSupabase';

export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
}

export async function getAuthenticatedUser(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<AuthenticatedUser | null> {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) return null;

    const { data, error } = await getAdminSupabase()
        .from('users')
        .select('id, email, full_name')
        .eq('email', session.user.email)
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        email: data.email,
        name: data.full_name || session.user.name || '',
    };
}
