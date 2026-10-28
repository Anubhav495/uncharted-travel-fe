import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import WaveBackdrop from '@/components/ui/WaveBackdrop';

const HowItWorksSection: React.FC = () => {
    return (
        <section
            className="border-t border-slate-800 px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-slate-900 relative text-white overflow-hidden"
            id="how-it-works"
        >
            {/* Liquid Glowing Wave Video and Ambient Waves Backdrop from Atlas Revolution */}
            <WaveBackdrop opacity="opacity-75" />

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                {/* Brand Stag Logo Emblem */}
                <div className="inline-flex items-center justify-center p-4 border border-slate-700 bg-slate-800/80 backdrop-blur-md mb-8 rounded-none shadow-xl">
                    <img
                        src="/assets/brand-logo.png"
                        alt="UnchartedTravel Stag Logo"
                        className="h-10 md:h-14 w-auto invert opacity-95"
                    />
                </div>

                {/* Section Title */}
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight mb-4">
                    Find Your Perfect <span className="italic text-yellow-400">Guide</span>
                </h2>

                <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-sans leading-relaxed mb-10">
                    Browse profiles, read reviews, and find the local expert who will make your trip unforgettable.
                </p>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/destinations"
                        className="w-full sm:w-auto px-8 py-3.5 bg-yellow-400 text-slate-950 hover:bg-yellow-300 font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 font-sans rounded-none shadow-lg active:scale-95"
                    >
                        <span>Browse Destinations</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/become-a-guide"
                        className="w-full sm:w-auto px-8 py-3.5 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-500 text-white font-medium text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center font-sans rounded-none shadow-md active:scale-95"
                    >
                        <span>Become a Guide</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
