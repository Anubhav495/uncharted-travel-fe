import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, TrendingUp, Utensils } from 'lucide-react';
import { ItineraryDay } from '@/types/trek';

interface TrekItineraryProps {
    itinerary: ItineraryDay[];
}

const TrekItinerary: React.FC<TrekItineraryProps> = ({ itinerary }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section>
            <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                    <h2 className="font-display text-3xl font-normal text-white border-l-4 border-yellow-400 pl-4">
                        Trail Itinerary
                    </h2>
                    <p className="text-slate-400 text-xs font-sans mt-1 pl-4">
                        Day-by-day route architecture and elevation gains.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsExpanded((expanded) => !expanded)}
                    className="flex items-center gap-2 border border-yellow-400/30 bg-yellow-400/10 hover:bg-yellow-400/20 px-4 py-2 text-xs font-sans uppercase tracking-widest text-yellow-400 font-bold transition-all cursor-pointer shadow-md"
                    aria-expanded={isExpanded}
                    aria-controls="trek-itinerary-days"
                >
                    <span>{isExpanded ? 'Collapse all' : 'Expand all'}</span>
                    {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                </button>
            </div>

            <div
                id="trek-itinerary-days"
                className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-px before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent md:space-y-8 md:before:mx-auto md:before:translate-x-0"
            >
                {itinerary.map((day) => (
                    <div
                        key={day.day}
                        className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                    >
                        {/* Day Marker */}
                        <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center border border-slate-700 bg-slate-800 font-display text-base text-yellow-400 shadow-xl md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold">
                            {day.day}
                        </div>

                        {/* Day Card */}
                        <div className="w-[calc(100%-3.5rem)] border border-slate-700 bg-slate-800/50 p-5 md:p-6 shadow-xl transition-all hover:border-yellow-400/40 md:w-[calc(50%-2.5rem)]">
                            <div className="flex items-baseline justify-between gap-2 mb-2">
                                <span className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-semibold">
                                    Stage {day.day < 10 ? `0${day.day}` : day.day}
                                </span>
                            </div>

                            <h3 className="font-display text-xl sm:text-2xl font-normal text-white leading-snug group-hover:text-yellow-400 transition-colors">
                                {day.title}
                            </h3>

                            {/* Collapsible / expandable body */}
                            <div className={`${isExpanded ? 'block' : 'hidden'} md:block mt-3`}>
                                {(day.distance || day.elevation) && (
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {day.distance && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-slate-700 bg-slate-800 text-[11px] font-sans text-slate-300">
                                                <MapPin className="h-3 w-3 text-yellow-400" aria-hidden="true" />
                                                {day.distance}
                                            </span>
                                        )}
                                        {day.elevation && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-slate-700 bg-slate-800 text-[11px] font-sans text-slate-300">
                                                <TrendingUp className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                                                {day.elevation}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <p className="text-sm leading-relaxed text-slate-300 font-sans font-normal">
                                    {day.description}
                                </p>

                                {day.meals && (
                                    <div className="mt-4 flex items-center gap-2 border-t border-slate-700/60 pt-3 text-xs font-sans text-slate-400">
                                        <Utensils className="w-3.5 h-3.5 text-yellow-400" />
                                        <span className="uppercase tracking-wider text-slate-400 font-semibold">Meals:</span>
                                        <span className="text-slate-200">{day.meals}</span>
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
