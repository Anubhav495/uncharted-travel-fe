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
            className={`group relative bg-neutral-950 overflow-hidden border border-white/10 hover:border-white/35 transition-all duration-300 shadow-2xl flex flex-col justify-between ${
                isActive ? 'is-active border-white/40' : ''
            }`}
        >
            {/* Image Container with Editorial Dark Fade */}
            <div className="relative h-[280px] sm:h-[320px] md:h-[340px] overflow-hidden">
                <TrekImage
                    src={trek.image}
                    alt={trek.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 group-[.is-active]:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    {trek.badges.map((badge, index) => (
                        <span
                            key={index}
                            className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 border border-white/20 bg-black/75 text-white/90 backdrop-blur-md"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 bg-neutral-950 flex flex-col justify-between flex-grow -mt-8 relative z-10">
                <div>
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
                        <MapPin className="w-3.5 h-3.5 text-white/40" />
                        <span>{trek.location}</span>
                    </div>

                    {/* Title in Instrument Serif */}
                    <h3 className="font-display text-2xl sm:text-3xl font-normal text-white leading-tight mb-4 group-hover:text-white/90 transition-colors">
                        {trek.title}
                    </h3>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/[0.08] text-xs font-mono text-white/60 mb-5">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-white/40" />
                            <span>{trek.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-white/40" />
                            <span>{trek.difficulty}</span>
                        </div>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-1">
                    <div>
                        <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Pass Tariffs</p>
                        <p className="text-base sm:text-lg font-mono font-medium text-white">{trek.price}</p>
                    </div>
                    <button
                        onClick={() => onBook(trek.slug)}
                        className="flex items-center gap-2 bg-white text-black hover:bg-white/90 px-4 py-2.5 text-xs font-sans font-medium uppercase tracking-widest transition-all cursor-pointer"
                    >
                        <span>Examine</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrekCard;
