import React from 'react';

const MobileDestinationsHero: React.FC = () => {
    return (
        <section className="relative overflow-hidden bg-slate-900 px-5 pb-10 pt-28 md:hidden">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop")',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/70 to-slate-900" />
            <div className="relative mx-auto max-w-md">
                <h1 className="max-w-sm text-4xl font-bold leading-[1.05] tracking-tight text-white">
                    Find Your Next <span className="text-yellow-400">Expedition</span>
                </h1>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-300">
                    Explore the uncharted territories of the Himalayas. Handpicked trails, expert local guides, and unforgettable stories.
                </p>
            </div>
        </section>
    );
};

export default MobileDestinationsHero;
