import React from 'react';
import { Search } from 'lucide-react';

const DestinationsHero: React.FC = () => {
    return (
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
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

                {/* Search Bar Mockup */}
                <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 flex items-center shadow-2xl">
                    <div className="flex-1 px-6 border-r border-white/10">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Location</p>
                        <p className="text-white font-medium">Anywhere</p>
                    </div>
                    <div className="flex-1 px-6 border-r border-white/10 hidden sm:block">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Date</p>
                        <p className="text-white font-medium">Anytime</p>
                    </div>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 p-4 rounded-full transition-colors shadow-lg hover:shadow-yellow-400/20">
                        <Search className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-10" />
        </section>
    );
};

export default DestinationsHero;
