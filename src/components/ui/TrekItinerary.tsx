import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, TrendingUp } from 'lucide-react';
import { ItineraryDay } from '@/types/trek';

interface TrekItineraryProps {
    itinerary: ItineraryDay[];
}

const TrekItinerary: React.FC<TrekItineraryProps> = ({ itinerary }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section>
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="border-l-4 border-yellow-400 pl-4 text-2xl font-bold text-white">
                    Itinerary
                </h2>
                <button
                    type="button"
                    onClick={() => setIsExpanded((expanded) => !expanded)}
                    className="flex min-h-11 items-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 text-sm font-bold text-yellow-400 transition-colors hover:bg-yellow-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 md:hidden"
                    aria-expanded={isExpanded}
                    aria-controls="trek-itinerary-days"
                >
                    {isExpanded ? 'Collapse all' : 'Expand all'}
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    )}
                </button>
            </div>
            <div
                id="trek-itinerary-days"
                className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent md:space-y-8 md:before:mx-auto md:before:translate-x-0"
            >
                {itinerary.map((day) => (
                    <div
                        key={day.day}
                        className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                    >
                        <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-bold text-yellow-400 shadow md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            {day.day}
                        </div>
                        <div className="w-[calc(100%-4rem)] rounded-2xl border border-slate-700 bg-slate-800/50 p-4 shadow-lg transition-colors hover:border-yellow-400/30 md:w-[calc(50%-2.5rem)] md:p-6">
                            <h3 className="text-lg font-bold leading-snug text-white">{day.title}</h3>
                            <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
                                {(day.distance || day.elevation) && (
                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                        {day.distance && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" aria-hidden="true" />
                                                {day.distance}
                                            </span>
                                        )}
                                        {day.elevation && (
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                                                {day.elevation}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                    {day.description}
                                </p>
                                {day.meals && (
                                    <div className="mt-4 flex items-center gap-2 border-t border-slate-700/50 pt-3 text-xs text-yellow-400">
                                        <span className="font-bold">Meals:</span>
                                        <span className="text-slate-300">{day.meals}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrekItinerary;
