import React, { useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';
import { MapPin, TrendingUp, Utensils } from 'lucide-react';
import { ItineraryDay } from '@/types/trek';

interface ItineraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    itinerary: ItineraryDay[];
}

const ItineraryModal: React.FC<ItineraryModalProps> = ({
    isOpen,
    onClose,
    title,
    itinerary,
}) => {
    const modalContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-[200]">
            <div
                ref={modalContentRef}
                className="bg-neutral-950 border border-white/15 w-full sm:w-full sm:max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex flex-shrink-0 items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-neutral-950">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">
                            Operator Itinerary
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-normal text-white">
                            Itinerary & Meals
                        </h2>
                        <p className="text-xs font-sans text-amber-400 mt-1">{title}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 overflow-y-auto w-full">
                    <div className="space-y-4">
                        {itinerary.map((day) => (
                            <div key={day.day} className="bg-white/[0.02] p-5 border border-white/10 hover:border-white/20 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 border border-amber-400/25 bg-amber-400/10 px-2 py-0.5">
                                            Day {day.day}
                                        </span>
                                        <h3 className="font-display text-lg sm:text-xl font-normal text-white">
                                            {day.title}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans text-white/50">
                                        {day.distance && (
                                            <span className="flex items-center gap-1 border border-white/10 bg-white/[0.03] px-2 py-0.5">
                                                <MapPin className="w-3 h-3 text-amber-400" /> {day.distance}
                                            </span>
                                        )}
                                        {day.elevation && (
                                            <span className="flex items-center gap-1 border border-white/10 bg-white/[0.03] px-2 py-0.5">
                                                <TrendingUp className="w-3 h-3 text-emerald-400" /> {day.elevation}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-white/60 text-xs sm:text-sm font-sans leading-relaxed mb-3 font-normal">
                                    {day.description}
                                </p>
                                {day.meals && (
                                    <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs font-sans text-white/50">
                                        <Utensils className="w-3.5 h-3.5 text-amber-400/80" />
                                        <span className="uppercase tracking-wider text-white/40 font-medium">Meals:</span> 
                                        <span className="text-white/80">{day.meals}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryModal;
