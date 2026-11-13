import React from 'react';
import { Check, Info, Minus, Shield } from 'lucide-react';
import type { FieldMetadata } from '@/lib/competitors/types';

type FeatureKind = 'inclusions' | 'exclusions' | 'safety';

interface PackageFeatureListProps {
    items: string[];
    metadata?: FieldMetadata;
    kind: FeatureKind;
    children?: React.ReactNode;
}

interface FeatureGroup {
    heading: string | null;
    items: { original: string; text: string; index: number }[];
}

function groupFeatures(items: string[]): FeatureGroup[] {
    const groups: FeatureGroup[] = [];
    items.forEach((original, index) => {
        // Group only explicit source prefixes; do not infer a service category.
        const match = original.match(/^(?:\d+[.)]\s*)?([A-Za-z][A-Za-z\s&/()+−-]{1,75}):\s+([\s\S]+)$/);
        const heading = match?.[1]?.trim() || null;
        const text = match?.[2]?.trim() || original;
        let group = groups[groups.length - 1];
        if (!group || group.heading !== heading) { group = { heading, items: [] }; groups.push(group); }
        group.items.push({ original, text, index });
    });
    return groups;
}

export default function PackageFeatureList({ items, metadata, kind, children }: PackageFeatureListProps) {
    const groups = groupFeatures(items);

    return (
        <div className="space-y-3">
            {groups.map((group, groupIndex) => (
                <div key={`${group.heading || 'general'}-${groupIndex}`} className="overflow-hidden border border-slate-700/70 bg-slate-950/20">
                    {group.heading && (
                        <h3 className="border-b border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-[10px] font-semibold leading-relaxed tracking-wide text-slate-200 sm:px-4">
                            {group.heading}
                        </h3>
                    )}
                    <ul className="divide-y divide-slate-700/40">
                        {group.items.map(({ original, text, index }) => {
                            const assertion = metadata?.items?.find((item) => item.text === original)?.assertion;
                            const conditional = assertion === 'conditional';
                            const excluded = assertion === 'excluded';
                            const sourceNote = excluded && kind !== 'exclusions';
                            const uncertainSafety = kind === 'safety' && (!assertion || assertion === 'mentioned' || assertion === 'unknown');
                            const Icon = conditional || uncertainSafety || sourceNote ? Info : kind === 'exclusions' ? Minus : kind === 'safety' ? Shield : Check;
                            const tone = conditional || uncertainSafety ? 'text-amber-300 bg-amber-400/10' : sourceNote ? 'text-slate-300 bg-slate-400/10' : kind === 'exclusions' ? 'text-rose-300 bg-rose-400/10' : kind === 'safety' ? 'text-sky-300 bg-sky-400/10' : 'text-emerald-300 bg-emerald-400/10';
                            const badge = conditional ? 'Conditional' : uncertainSafety ? 'Provision not confirmed' : sourceNote ? 'Provider note' : null;
                            return (
                                <li key={index} className="flex items-start gap-3 px-3 py-3.5 sm:px-4">
                                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${tone}`} aria-hidden="true"><Icon className="h-3 w-3" /></span>
                                    <div className="min-w-0 flex-1">
                                        <p className="whitespace-pre-line text-xs leading-relaxed text-slate-300 sm:leading-6">{text}</p>
                                        {badge && <span className={`mt-2 inline-flex border border-white/10 px-1.5 py-0.5 text-[9px] font-medium ${tone}`}>{badge}</span>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
            {children && <div className="pt-1">{children}</div>}
        </div>
    );
}
