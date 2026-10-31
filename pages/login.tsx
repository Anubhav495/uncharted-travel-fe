import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { NextSeo } from 'next-seo';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../src/context/ToastContext';

const LoginBackgroundMap = dynamic(
    () => import('../src/components/auth/LoginBackgroundMap'),
    { ssr: false }
);

export default function LoginPage() {
    const router = useRouter();
    const { loginWithGoogle, user } = useAuth();
    const { showToast } = useToast();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const returnUrl = (router.query.returnUrl as string) || (router.query.redirect as string) || (router.query.callbackUrl as string) || '/dashboard';

    // Redirect if already logged in
    useEffect(() => {
        if (user && router.isReady) {
            router.push(returnUrl);
        }
    }, [user, router.isReady, returnUrl, router]);

    const handleGoogleLogin = async () => {
        setError(null);
        setBusy(true);

        try {
            showToast('Signing in with Google...', 'info');
            await loginWithGoogle(returnUrl);
        } catch (err: any) {
            setError(err?.message || 'Google authentication failed. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <NextSeo
                title="Sign In | Uncharted Travel"
                description="Sign in to your Uncharted Travel explorer dashboard."
                canonical="https://unchartedtravel.in/login"
            />

            <div className="min-h-screen bg-slate-900 text-white flex flex-col relative overflow-hidden">
                {/* Gliding Cinematic Satellite Background Map (Atlas Style, SSR-safe) */}
                <LoginBackgroundMap />

                {/* Top Navigation */}
                <div className="max-w-6xl w-full mx-auto px-6 h-20 flex items-center relative z-10">
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-slate-400 hover:text-yellow-400 transition-colors duration-150 cursor-pointer font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to UnchartedTravel
                    </button>
                </div>

                {/* Main Card */}
                <div className="flex-1 flex items-center justify-center px-6 pb-20 relative z-10">
                    <div className="w-full max-w-md border border-slate-700/80 bg-slate-900/95 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl">
                        <div className="mb-2 flex items-center gap-3">
                            <img
                                src="/assets/brand-logo.png"
                                alt="UnchartedTravel Logo"
                                className="h-10 w-10 shrink-0 object-contain"
                            />
                            <span className="font-display text-3xl sm:text-4xl text-white tracking-tight">
                                Uncharted<span className="text-yellow-400">Travel</span>
                            </span>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-normal font-display text-white mt-4">
                            Explorer Sign In
                        </h1>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                            Sign in to access your booked treks, native guide chats, and personal itineraries across the Himalayas.
                        </p>

                        {/* Continue with Google Button */}
                        <div className="mt-8">
                            <button
                                type="button"
                                disabled={busy}
                                onClick={handleGoogleLogin}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 py-3.5 px-6 font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3 transition-all duration-150 cursor-pointer shadow-lg shadow-yellow-400/10 disabled:opacity-50 active:scale-95"
                            >
                                {busy ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                ) : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        />
                                    </svg>
                                )}
                                <span>{busy ? 'Connecting...' : 'Continue with Google'}</span>
                            </button>
                        </div>

                        {error && (
                            <p className="mt-4 text-xs text-rose-300 bg-rose-500/10 border border-rose-400/25 px-4 py-2.5 font-sans">
                                {error}
                            </p>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                100% verified native guide network. Your booking requests, notes, and itineraries are private and secure.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
