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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[200]">
            <div
                ref={modalContentRef}
                className="bg-slate-900 border border-slate-700 w-full sm:w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 ease-out relative overflow-hidden flex flex-col max-h-[90vh]"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex flex-shrink-0 items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Itinerary & Meals
                        </h2>
                        <p className="text-sm text-yellow-400 mt-1">{title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
                        <HiX className="w-6 h-6 text-slate-400 hover:text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 overflow-y-auto w-full">
                    <div className="space-y-6">
                        {itinerary.map((day) => (
                            <div key={day.day} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                                    <h3 className="font-bold text-white text-lg">Day {day.day}: {day.title}</h3>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 sm:mt-0">
                                        {day.distance && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-yellow-500" /> {day.distance}</span>}
                                        {day.elevation && <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-yellow-500" /> {day.elevation}</span>}
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    {day.description}
                                </p>
                                {day.meals && (
                                    <div className="pt-3 border-t border-slate-700/50 flex items-center gap-2 text-xs text-yellow-400">
                                        <span className="font-bold">Meals:</span> 
                                        <span className="text-slate-300">{day.meals}</span>
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
