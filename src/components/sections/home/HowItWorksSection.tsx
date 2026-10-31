import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
    return (
        <div
            className="pb-8 md:pb-10 relative text-white"
            id="how-it-works"
        >
            <div className="max-w-4xl mx-auto relative z-10 text-center">
                {/* Brand Stag Logo Emblem */}
                <div className="inline-flex items-center justify-center p-2 border border-slate-700 bg-slate-800/80 backdrop-blur-md mb-4 rounded-none shadow-xl">
                    <img
                        src="/assets/brand-logo.png"
                        alt="UnchartedTravel Stag Logo"
                        className="h-8 md:h-10 w-auto object-contain"
                    />
                </div>

                {/* Section Title */}
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-tight mb-3">
                    Find Your Perfect <span className="italic text-yellow-400">Guide</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-sans leading-relaxed mb-6">
                    Browse profiles, read reviews, and find the local expert who will make your trip unforgettable.
                </p>

                {/* Direct Action Buttons */}
                <div className="flex items-stretch justify-center gap-2 sm:gap-3">
                    <Link
                        href="/destinations"
                        className="flex-[1.2] min-w-0 sm:flex-none min-h-[44px] px-3 sm:px-9 py-3 sm:py-3.5 bg-yellow-400 text-slate-950 hover:bg-yellow-300 font-bold text-[11px] sm:text-xs uppercase tracking-wide sm:tracking-widest transition-all duration-200 flex items-center justify-center gap-2 font-sans rounded-none shadow-lg active:scale-95"
                    >
                        <span>Browse Destinations</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>
                    <Link
                        href="/become-a-guide"
                        className="flex-1 min-w-0 sm:flex-none min-h-[44px] px-3 sm:px-8 py-3 sm:py-3.5 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-500 text-white font-medium text-[11px] sm:text-xs uppercase tracking-wide sm:tracking-widest transition-all duration-200 flex items-center justify-center font-sans rounded-none shadow-md active:scale-95"
                    >
                        <span>Become a Guide</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksSection;
