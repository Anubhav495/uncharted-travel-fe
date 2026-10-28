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
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setBusy(true);

        try {
            showToast('Signing in with Google...', 'info');
            await loginWithGoogle('/dashboard');
        } catch (err: any) {
            setError(err?.message || 'Authentication failed. Please use Google sign-in.');
        } finally {
            setBusy(false);
        }
    };

    const handleDemoMode = async () => {
        setBusy(true);
        setError(null);
        try {
            showToast('Entering 1-click explorer demo mode...', 'success');
            await loginWithGoogle('/dashboard');
        } catch {
            setError('Could not initialize demo mode. Please sign in with Google.');
        } finally {
            setBusy(false);
        }
    };

    const inputCls =
        'w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/45 transition-colors duration-150 font-sans';

    return (
        <>
            <NextSeo
                title="Sign In | Uncharted Travel"
                description="Sign in to your Uncharted Travel explorer dashboard."
                canonical="https://unchartedtravel.in/login"
            />

            <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
                {/* Gliding Cinematic Background Map (Atlas Style, SSR-safe) */}
                <LoginBackgroundMap />

                {/* Top Navigation */}
                <div className="max-w-6xl w-full mx-auto px-6 h-20 flex items-center relative z-10">
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Uncharted
                    </button>
                </div>

                {/* Main Card (Atlas Revolution Exact Screen Layout) */}
                <div className="flex-1 flex items-center justify-center px-6 pb-20 relative z-10">
                    <div className="w-full max-w-md border border-white/15 bg-neutral-950/85 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-display text-3xl text-white tracking-tight">
                                UNCHARTED<sup className="text-[10px] font-sans opacity-60 ml-0.5">®</sup>
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                                Alpine Auth
                            </span>
                        </div>

                        <h1 className="text-xl font-medium mt-4 font-sans">
                            {mode === 'login' ? 'Welcome back, Explorer' : 'Create your account'}
                        </h1>
                        <p className="text-xs text-white/50 mt-1.5 leading-relaxed font-sans">
                            {mode === 'login'
                                ? 'Sign in to access your booked treks and private itineraries.'
                                : 'Your account comes with high-altitude dispatch and guide direct messaging.'}
                        </p>

                        <div className="flex border border-white/10 p-1 mt-7">
                            {(['login', 'register'] as const).map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => {
                                        setMode(m);
                                        setError(null);
                                    }}
                                    className={`flex-1 py-2 text-xs uppercase tracking-wider font-mono transition-colors duration-150 ${
                                        mode === m ? 'bg-white text-black font-medium' : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    {m === 'login' ? 'Log in' : 'Sign up'}
                                </button>
                            ))}
                        </div>

                        {/* Continue with Google (Atlas / Uncharted Primary) */}
                        <div className="mt-6">
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => loginWithGoogle('/dashboard')}
                                className="w-full bg-white py-3 text-xs uppercase tracking-widest font-medium text-black flex items-center justify-center gap-2 hover:bg-white/90 transition-colors duration-150 disabled:opacity-50 cursor-pointer shadow-lg"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3 my-5">
                            <span className="flex-1 h-px bg-white/10" />
                            <span className="text-[10px] uppercase tracking-wider text-white/35 font-mono">or</span>
                            <span className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Standard Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {mode === 'register' && (
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    className={inputCls}
                                />
                            )}
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Email address"
                                className={inputCls}
                            />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder={mode === 'register' ? 'Create password' : 'Password'}
                                className={inputCls}
                            />

                            {error && (
                                <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-400/25 px-4 py-2.5 font-sans">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={busy}
                                className="w-full border border-white/20 bg-white/[0.04] py-3 text-xs uppercase tracking-widest font-mono text-white hover:bg-white/[0.08] hover:border-white/40 transition-colors flex items-center justify-center gap-2"
                            >
                                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>{mode === 'login' ? 'Sign In with Email' : 'Register Account'}</span>
                            </button>
                        </form>

                        {/* 1-Click Demo Mode Button (Atlas Style) */}
                        <div className="mt-4">
                            <button
                                type="button"
                                disabled={busy}
                                onClick={handleDemoMode}
                                className="w-full py-2.5 text-xs font-mono uppercase tracking-wider border border-white/10 text-white/70 hover:border-white/30 hover:text-white flex items-center justify-center gap-2 transition-colors duration-150"
                            >
                                <span>Explore in 1-click demo mode</span>
                            </button>
                        </div>

                        <p className="text-[11px] text-white/30 text-center mt-6 leading-relaxed font-sans">
                            Your Himalayan journeys and field notes are private by default.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
