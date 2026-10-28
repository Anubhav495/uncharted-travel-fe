import React from 'react';

const MobileDestinationsHero: React.FC = () => {
    return (
        <section className="relative overflow-hidden bg-slate-900 px-6 pb-12 pt-28 md:hidden text-white border-b border-slate-800">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop")',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900" />
            <div className="relative mx-auto max-w-md">
                <h1 className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-white">
                    Find your next <span className="italic text-yellow-400">expedition.</span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 font-sans">
                    Explore the uncharted territories of the Himalayas. Handpicked trails and expert local guides.
                </p>
            </div>
        </section>
    );
};

export default MobileDestinationsHero;
