import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { providerRequestSchema } from '@/lib/competitors/providerRequest';
import { buildComparisonPath } from '@/lib/competitors/comparisonLink';
import type { SupportedProviderId } from '@/lib/competitors/catalog';

export default function ProviderSupportRequest({ trekSlug, providerIds = [] }: { trekSlug: string; providerIds?: SupportedProviderId[] }) {
    const { user, loading } = useAuth();
    const disclosure = useRef<HTMLDetailsElement>(null);
    const [providerName, setProviderName] = useState('');
    const [notes, setNotes] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState('');
    const [needsSignIn, setNeedsSignIn] = useState(false);
    const signInHref = `/login?returnUrl=${encodeURIComponent(`${buildComparisonPath({ trekSlug, providerIds })}#provider-request`)}`;

    useEffect(() => {
        if (window.location.hash === '#provider-request' && disclosure.current) disclosure.current.open = true;
    }, []);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (busy) return;
        setError(''); setNeedsSignIn(false);
        const parsed = providerRequestSchema.safeParse({ providerName, notes, trekSlug });
        if (!parsed.success) { setError(parsed.error.issues[0]?.message || 'Check your provider request.'); return; }
        setBusy(true);
        try {
            const response = await fetch('/api/requestProvider', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data),
            });
            const data = await response.json().catch(() => ({}));
            if (response.status === 409) { setSaved('You have already requested this provider. Your request is saved for review.'); return; }
            if (!response.ok) {
                if (response.status === 401) setNeedsSignIn(true);
                throw new Error(typeof data.message === 'string' ? data.message : 'We could not save your request. Please try again.');
            }
            setSaved('Request saved. Thank you for helping us choose which providers to add next.');
            setProviderName(''); setNotes('');
        } catch (failure) {
            setError(failure instanceof Error ? failure.message : 'We could not save your request. Please try again.');
        } finally { setBusy(false); }
    };

    return (
        <details id="provider-request" ref={disclosure} className="group/provider-request mt-5 scroll-mt-24 border border-dashed border-slate-700 bg-slate-900/60">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-3 text-xs text-slate-300 transition-colors hover:text-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 sm:p-4 [&::-webkit-details-marker]:hidden">
                <Plus className="h-4 w-4 shrink-0 text-yellow-400" aria-hidden="true" />
                <span className="min-w-0 flex-1">Missing a provider? <span className="font-medium text-yellow-400">Request provider support</span></span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open/provider-request:rotate-180" aria-hidden="true" />
            </summary>
            <div className="border-t border-slate-700 p-4">
                <p className="max-w-xl text-xs leading-relaxed text-slate-400">Tell us which trekking provider you’d like to compare. We’ll review your suggestion for future support.</p>
                {loading ? <p className="mt-4 text-xs text-slate-400" role="status">Checking sign-in…</p> : !user ? (
                    <Link href={signInHref} className="mt-5 inline-flex bg-yellow-400 px-5 py-3 text-xs font-semibold text-slate-950 hover:bg-yellow-300">Sign in to request a provider</Link>
                ) : saved ? (
                    <div className="mt-5 space-y-3">
                        <p role="status" className="text-sm text-emerald-300">{saved}</p>
                        <button type="button" onClick={() => { setSaved(''); setProviderName(''); setNotes(''); }} className="text-xs text-yellow-400 underline">Request another provider</button>
                    </div>
                ) : (
                    <form onSubmit={submit} aria-label="Request provider support" className="mt-5 max-w-xl space-y-4">
                        <div>
                            <label htmlFor="requested-provider-name" className="mb-2 block text-xs text-slate-300">Provider name</label>
                            <input id="requested-provider-name" required minLength={2} maxLength={100} value={providerName} onChange={(event) => setProviderName(event.target.value)} disabled={busy} placeholder="Provider or company name" className="w-full border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white outline-none focus:border-yellow-400 disabled:opacity-60" />
                        </div>
                        <div>
                            <label htmlFor="requested-provider-notes" className="mb-2 block text-xs text-slate-300">Anything we should know? <span className="text-slate-500">(optional)</span></label>
                            <textarea id="requested-provider-notes" rows={3} maxLength={1000} value={notes} onChange={(event) => setNotes(event.target.value)} disabled={busy} placeholder="What would you like to compare with this provider?" className="w-full resize-y border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white outline-none focus:border-yellow-400 disabled:opacity-60" />
                        </div>
                        {error && <p role="alert" className="text-xs leading-relaxed text-amber-300">{error}</p>}
                        {needsSignIn && <Link href={signInHref} className="inline-block text-xs text-yellow-400 underline">Sign in again to send your request</Link>}
                        <button type="submit" disabled={busy} aria-busy={busy} className="inline-flex items-center gap-2 bg-yellow-400 px-5 py-3 text-xs font-semibold text-slate-950 hover:bg-yellow-300 disabled:opacity-60">{busy && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}{busy ? 'Sending request…' : 'Send provider request'}</button>
                    </form>
                )}
            </div>
        </details>
    );
}
