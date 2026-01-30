import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseServiceKey) {
    console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is missing. Operations requiring RLS bypass (like User Sync) may fail.");
}

// Helper to get a Supabase client with the Service Role key (bypasses RLS)
const getServiceSupabase = () => createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            // Sync user to Supabase using Service Role (admin access)
            const supabase = getServiceSupabase();

            const { error } = await supabase
                .from('users')
                .upsert({
                    email: user.email,
                    full_name: user.name,
                    avatar_url: user.image,
                    last_login: new Date().toISOString(),
                }, { onConflict: 'email' });

            if (error) {
                console.error("Error syncing user to Supabase:", error);
                // Return true anyway to allow login, but log the error (or false to deny)
                // For now, allow login even if sync fails (avoids blocking users if DB hiccups)
                return true;
            }

            return true;
        },
        async session({ session }) {
            // Retrieve the user ID from Supabase to add to session
            // Optimization: We could store this in the JWT token during 'jwt' callback to avoid DB call on every session check
            // But for now, let's keep it simple or rely on email which is unique.

            // WE MUST USE SERVICE ROLE HERE TOO if RLS policies are strict (e.g. only 'me' can read 'me')
            // Because 'session' callback runs on server, we can use service role safe.
            const supabase = getServiceSupabase();
            const { data } = await supabase.from('users').select('id').eq('email', session?.user?.email).single();

            if (data && session.user) {
                // Extend session with user ID
                (session.user as any).id = data.id;
            }

            return session;
        }
    }
};

export default NextAuth(authOptions);
