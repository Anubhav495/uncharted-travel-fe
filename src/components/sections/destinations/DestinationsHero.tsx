import React from 'react';


const DestinationsHero: React.FC = () => {
    return (
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Image with CSS Mask for smooth fade */}
            <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop")',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight [text-shadow:0_4px_8px_rgb(0_0_0_/_0.5)]">
                    Find Your Next <span className="text-yellow-400">Expedition</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                    Explore the uncharted territories of the Himalayas. Handpicked trails, expert local guides, and unforgettable stories.
                </p>


            </div>
        </section>
    );
};

export default DestinationsHero;
