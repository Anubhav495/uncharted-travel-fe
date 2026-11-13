import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ComparisonItineraryDay } from '@/lib/competitors/types';

interface ComparisonItineraryProps {
    days: ComparisonItineraryDay[];
    children?: React.ReactNode;
}

function DayMetric({ label, value }: { label: string; value: string }) {
    const labelled = value.match(/^((?:Trek|Drive) Distance|Altitude Gain|Altitude|Elevation|Meals):\s*(.+)$/i);
    return (
        <div className="min-w-0 border border-slate-700/70 bg-slate-950/30 px-3 py-2.5">
            <dt className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{labelled?.[1] || label}</dt>
            <dd className="mt-1 break-words text-xs leading-relaxed text-slate-300">{labelled?.[2] || value}</dd>
        </div>
    );
}

export default function ComparisonItinerary({ days, children }: ComparisonItineraryProps) {
    const id = useId();
    const [expandedDays, setExpandedDays] = useState<Set<number>>(() => new Set());
    const allExpanded = days.length > 0 && expandedDays.size === days.length;

    const toggleDay = (index: number) => {
        setExpandedDays((current) => {
            const next = new Set(current);
            if (next.has(index)) next.delete(index); else next.add(index);
            return next;
        });
    };

    return (
        <details className="group/itinerary">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:text-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 [&::-webkit-details-marker]:hidden">
                <span>View itinerary · {days.length} {days.length === 1 ? 'day' : 'days'} listed</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open/itinerary:rotate-180" aria-hidden="true" />
            </summary>
            <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/70 pb-3">
                    <p className="text-[10px] text-slate-500">Open a day to explore the details.</p>
                    <button
                        type="button"
                        aria-controls={`${id}-days`}
                        aria-expanded={allExpanded}
                        onClick={() => setExpandedDays(allExpanded ? new Set() : new Set(days.map((_, index) => index)))}
                        className="min-h-[36px] border border-yellow-400/25 bg-yellow-400/5 px-3 py-2 text-[10px] font-semibold text-yellow-400 transition-colors hover:border-yellow-400/60 hover:bg-yellow-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                    >
                        {allExpanded ? 'Collapse all' : 'Expand all'}
                    </button>
                </div>
                <ol id={`${id}-days`} className="divide-y divide-slate-700/60 border border-slate-700/70">
                    {days.map((day, index) => {
                        const expanded = expandedDays.has(index);
                        const dayLabel = day.day === null ? 'Day not stated' : `Day ${day.day}`;
                        const hasMetrics = day.distance || day.elevation || day.meals;
                        return (
                            <li key={`${day.day ?? index}-${day.title}`}>
                                <button
                                    type="button"
                                    id={`${id}-heading-${index}`}
                                    aria-controls={`${id}-day-${index}`}
                                    aria-expanded={expanded}
                                    onClick={() => toggleDay(index)}
                                    className={`grid w-full grid-cols-[1fr_auto] items-start gap-x-3 gap-y-1.5 px-3 py-3 text-left transition-colors hover:bg-slate-800/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-yellow-400 sm:grid-cols-[42px_1fr_auto] sm:px-4 sm:py-4 ${expanded ? 'bg-slate-800/60' : 'bg-slate-950/20'}`}
                                >
                                    <span className="col-start-1 row-start-1 pt-0.5 text-[9px] font-semibold uppercase tracking-wider text-yellow-400">{dayLabel}</span>
                                    <span className="col-span-2 col-start-1 row-start-2 min-w-0 text-xs font-medium leading-relaxed text-slate-200 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:text-sm">{day.title}</span>
                                    <ChevronDown className={`col-start-2 row-start-1 mt-0.5 h-3.5 w-3.5 text-slate-500 transition-transform sm:col-start-3 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                                </button>
                                <div id={`${id}-day-${index}`} aria-labelledby={`${id}-heading-${index}`} hidden={!expanded} className="space-y-4 px-3 pb-4 pt-1 sm:px-4">
                                    {day.description && <p className="whitespace-pre-line text-xs leading-7 text-slate-400">{day.description}</p>}
                                    {hasMetrics && (
                                        <dl className="grid gap-2 sm:grid-cols-2">
                                            {day.distance && <DayMetric label="Distance" value={day.distance} />}
                                            {day.elevation && <DayMetric label="Altitude" value={day.elevation} />}
                                            {day.meals && <DayMetric label="Meals" value={day.meals} />}
                                        </dl>
                                    )}
                                    {!day.description && !hasMetrics && <p className="text-xs leading-relaxed text-slate-500">No additional details stated for this day.</p>}
                                </div>
                            </li>
                        );
                    })}
                </ol>
                {children}
            </div>
        </details>
    );
}
