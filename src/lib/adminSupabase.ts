import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getAdminSupabase(): SupabaseClient {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        throw new Error('Supabase server credentials are not configured');
    }

    if (!client) {
        client = createClient(url, serviceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }

    return client;
}
