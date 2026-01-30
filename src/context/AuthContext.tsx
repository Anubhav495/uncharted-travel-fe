import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useToast } from './ToastContext';

// Define a User type that matches what the app expects
// (Adding metadata fields that Supabase had, mapping them from NextAuth session)
export interface User {
    id?: string;
    email?: string | null;
    user_metadata: {
        full_name?: string | null;
        avatar_url?: string | null;
        [key: string]: any;
    };
}

interface AuthContextType {
    user: User | null;
    session: any; // Using 'any' or importing Session from next-auth
    loading: boolean;
    loginWithGoogle: (returnUrl?: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    loginWithGoogle: async () => { },
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const router = useRouter();
    const { showToast } = useToast();

    // Derive user directly from session to avoid useEffect race conditions
    const user = React.useMemo<User | null>(() => {
        if (session?.user) {
            return {
                id: (session.user as any).id,
                email: session.user.email,
                user_metadata: {
                    full_name: session.user.name,
                    avatar_url: session.user.image,
                }
            };
        }
        return null;
    }, [session]);

    const loginWithGoogle = async (returnUrl?: string) => {
        try {
            await signIn('google', {
                callbackUrl: returnUrl || '/dashboard', // NextAuth uses callbackUrl
            }, {
                prompt: "select_account"
            });
        } catch (error) {
            console.error('Error logging in with Google:', error);
            showToast('Something went wrong. Please try again.', 'error');
        }
    };

    const signOut = async () => {
        await nextAuthSignOut({ callbackUrl: '/' });
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, loginWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

