import React from 'react';
import TrekImage from './TrekImage';
import { MapPin, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Trek } from '@/types/trek';

interface TrekCardProps {
    trek: Trek;
    isActive?: boolean;
    onBook: (slug: string) => void;
}

const TrekCard: React.FC<TrekCardProps> = ({ trek, isActive = false, onBook }) => {
    return (
        <div
            className={`group relative bg-slate-800/90 overflow-hidden border border-slate-700 hover:border-yellow-400/60 transition-all duration-300 shadow-xl flex flex-col justify-between ${
                isActive ? 'is-active border-yellow-400' : ''
            }`}
        >
            {/* Image Container */}
            <div className="relative h-[280px] sm:h-[320px] md:h-[340px] overflow-hidden">
                <TrekImage
                    src={trek.image}
                    alt={trek.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 group-[.is-active]:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    {trek.badges.map((badge, index) => (
                        <span
                            key={index}
                            className="text-xs font-sans uppercase tracking-wider px-2.5 py-0.5 border border-yellow-400/30 bg-slate-900/90 text-yellow-400 backdrop-blur-md font-semibold"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 bg-slate-900 flex flex-col justify-between flex-grow -mt-8 relative z-10 border-t border-slate-800">
                <div>
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-sans mb-2">
                        <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                        <span>{trek.location}</span>
                    </div>

                    {/* Title in Instrument Serif */}
                    <h3 className="font-display text-2xl sm:text-3xl font-normal text-white leading-tight mb-4 group-hover:text-yellow-400 transition-colors">
                        {trek.title}
                    </h3>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800 text-xs font-sans text-slate-300 mb-5">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{trek.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                            <span>{trek.difficulty}</span>
                        </div>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-1">
                    <div>
                        <p className="text-xs text-slate-400 font-sans">Starting from</p>
                        <p className="text-base sm:text-lg font-sans font-medium text-white">{trek.price}</p>
                    </div>
                    <button
                        onClick={() => onBook(trek.slug)}
                        className="flex items-center gap-2 bg-yellow-400 text-slate-950 hover:bg-yellow-300 px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-yellow-400/10"
                    >
                        <span>View Trek</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrekCard;
