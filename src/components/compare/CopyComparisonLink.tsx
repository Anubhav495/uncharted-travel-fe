import React, { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { buildComparisonPath, type ComparisonSelection } from '@/lib/competitors/comparisonLink';

export default function CopyComparisonLink({ trekSlug, providerIds }: ComparisonSelection) {
    const path = buildComparisonPath({ trekSlug, providerIds });
    const [feedback, setFeedback] = useState<{ path: string; status: 'copied' | 'manual'; url: string } | null>(null);
    const manualInput = useRef<HTMLInputElement>(null);
    const currentFeedback = feedback?.path === path ? feedback : null;

    const copy = async () => {
        const url = new URL(path, window.location.origin).href;
        try {
            if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(url);
            setFeedback({ path, status: 'copied', url });
        } catch {
            setFeedback({ path, status: 'manual', url });
        }
    };

    return (
        <div className="w-full sm:w-auto sm:max-w-sm">
            <button type="button" onClick={() => void copy()} disabled={!providerIds.length} className="inline-flex w-full items-center justify-center gap-2 border border-slate-600 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-yellow-400 transition-colors hover:border-yellow-400 hover:bg-yellow-400/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">
                {currentFeedback?.status === 'copied' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                Copy comparison link
            </button>
            {currentFeedback?.status === 'copied' && <p role="status" className="mt-2 text-xs text-emerald-300">Link copied.</p>}
            {currentFeedback?.status === 'manual' && (
                <div className="mt-3 space-y-2">
                    <p role="status" className="text-xs leading-relaxed text-slate-400">Select and copy the link below.</p>
                    <label htmlFor="comparison-share-link" className="sr-only">Comparison link</label>
                    <input id="comparison-share-link" ref={manualInput} readOnly value={currentFeedback.url} onFocus={(event) => event.target.select()} onClick={() => manualInput.current?.select()} className="w-full min-w-0 border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-white outline-none focus:border-yellow-400" />
                </div>
            )}
        </div>
    );
}
