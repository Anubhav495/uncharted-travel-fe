import React, { useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';
import { MapPin, TrendingUp } from 'lucide-react';
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-[200]">
            <div
                ref={modalContentRef}
                className="bg-slate-900 border border-slate-700 w-full sm:w-full sm:max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex flex-shrink-0 items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-900">
                    <div>
                        <div className="text-[10px] font-sans uppercase tracking-widest text-slate-400 mb-1 font-semibold">
                            Operator Itinerary
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-normal text-white">
                            Itinerary & Meals
                        </h2>
                        <p className="text-xs font-sans text-yellow-400 mt-1 font-semibold">{title}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 overflow-y-auto w-full">
                    <div className="space-y-4">
                        {itinerary.map((day) => (
                            <div key={day.day} className="bg-slate-800/70 p-5 border border-slate-700 hover:border-slate-600 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[10px] font-sans uppercase tracking-wider text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-2 py-0.5 font-bold">
                                            Day {day.day}
                                        </span>
                                        <h3 className="font-display text-lg sm:text-xl font-normal text-white">
                                            {day.title}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans text-slate-400">
                                        {day.distance && (
                                            <span className="flex items-center gap-1 border border-slate-700 bg-slate-800 px-2 py-0.5 text-slate-300">
                                                <MapPin className="w-3 h-3 text-yellow-400" /> {day.distance}
                                            </span>
                                        )}
                                        {day.elevation && (
                                            <span className="flex items-center gap-1 border border-slate-700 bg-slate-800 px-2 py-0.5 text-slate-300">
                                                <TrendingUp className="w-3 h-3 text-emerald-400" /> {day.elevation}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed mb-3 font-normal">
                                    {day.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryModal;
