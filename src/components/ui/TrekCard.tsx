import React from 'react';
import Image from 'next/image';
import { MapPin, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Trek } from '@/types/trek';

interface TrekCardProps {
    trek: Trek;
    isActive?: boolean;
    onBook: (slug: string) => void;
}

const TrekCard: React.FC<TrekCardProps> = ({ trek, isActive = false, onBook }) => {
    return (
        <div className={`group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-yellow-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/10 ${isActive ? 'is-active border-yellow-400/50 shadow-2xl shadow-yellow-400/10' : ''}`}>
            {/* Image Container */}
            <div className="relative h-[60vh] md:h-[400px] overflow-hidden">
                <Image
                    src={trek.image}
                    alt={trek.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-[.is-active]:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 group-[.is-active]:opacity-90 transition-opacity duration-500" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {trek.badges.map((badge, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 bg-yellow-400 rounded-full shadow-lg"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 group-[.is-active]:translate-y-0 transition-transform duration-500">
                <div className="space-y-3">
                    {/* Title & Location */}
                    <div>
                        <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mb-1">
                            <MapPin className="w-4 h-4" />
                            <span>{trek.location}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-yellow-400 group-[.is-active]:text-yellow-400 transition-colors duration-300">
                            {trek.title}
                        </h3>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{trek.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                            <TrendingUp className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{trek.difficulty}</span>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-2 opacity-0 group-hover:opacity-100 group-[.is-active]:opacity-100 transform translate-y-4 group-hover:translate-y-0 group-[.is-active]:translate-y-0 transition-all duration-500 delay-100">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Starting from</p>
                            <p className="text-xl font-bold text-white">{trek.price}</p>
                        </div>
                        <button
                            onClick={() => onBook(trek.slug)}
                            className="flex items-center gap-2 bg-yellow-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors"
                        >
                            View Info
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrekCard;
