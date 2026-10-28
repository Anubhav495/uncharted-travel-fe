import React from 'react';
import Image from 'next/image';
import { Compass } from 'lucide-react';

const DestinationsHero: React.FC = () => {
    return (
        <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-black text-white pt-20">
            {/* Background Image with Cinematic Dark Mask */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
                <div className="w-full h-full relative opacity-40">
                    <Image
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
                        alt="Himalayan Mountain Passes"
                        fill
                        className="object-cover object-center"
                        priority={true}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-6 text-center max-w-4xl py-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/15 bg-white/[0.03] backdrop-blur-md mb-6">
                    <Compass className="w-3.5 h-3.5 text-white/70" />
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/75">
                        High Himalayas &middot; Trail Catalogue
                    </span>
                </div>

                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white mb-6">
                    Find your next <span className="italic text-white/90">expedition.</span>
                </h1>

                <p className="font-sans text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                    Explore the high-altitude trails of Himachal and Uttarakhand. Handpicked trajectories, native mountain masters, and enduring memories.
                </p>
            </div>
        </section>
    );
};

export default DestinationsHero;
