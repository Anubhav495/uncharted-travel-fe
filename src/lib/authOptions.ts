import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getAdminSupabase } from './adminSupabase';

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

            try {
                const supabase = getAdminSupabase();
                const { data: userData, error } = await supabase
                    .from('users')
                    .upsert({
                        email: user.email,
                        full_name: user.name,
                        avatar_url: user.image,
                        last_login: new Date().toISOString(),
                    }, { onConflict: 'email' })
                    .select('id')
                    .single();

                if (error || !userData) {
                    console.error('Error syncing authenticated user:', error);
                    return false;
                }

                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .upsert({
                        user_id: userData.id,
                        display_name: user.name,
                        avatar_url: user.image ?? null,
                    }, { onConflict: 'user_id', ignoreDuplicates: false });

                if (profileError) {
                    console.error('Error syncing user profile:', profileError);
                    return false;
                }

                return true;
            } catch (error) {
                console.error('Authentication setup error:', error);
                return false;
            }
        },
        async session({ session }) {
            if (!session.user?.email) return session;

            try {
                const { data } = await getAdminSupabase()
                    .from('users')
                    .select('id')
                    .eq('email', session.user.email)
                    .single();

                if (data) {
                    session.user.id = data.id;
                }
            } catch (error) {
                console.error('Error resolving authenticated user:', error);
            }

            return session;
        },
    },
};
