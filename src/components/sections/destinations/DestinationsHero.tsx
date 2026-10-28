import React from 'react';
import Image from 'next/image';

const DestinationsHero: React.FC = () => {
    return (
        <section className="relative min-h-[50vh] md:min-h-[55vh] flex items-center justify-center overflow-hidden bg-black text-white pt-20">
            {/* Background Image with Dark Fade */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
                <div className="w-full h-full relative opacity-40">
                    <Image
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
                        alt="Himalayan Mountains"
                        fill
                        className="object-cover object-center"
                        priority={true}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-6 text-center max-w-4xl py-16">
                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white mb-6">
                    Find Your Next <span className="italic text-white/90">Expedition</span>
                </h1>

                <p className="font-sans text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                    Explore the uncharted territories of the Himalayas. Handpicked trails, expert local guides, and unforgettable stories.
                </p>
            </div>
        </section>
    );
};

export default DestinationsHero;
