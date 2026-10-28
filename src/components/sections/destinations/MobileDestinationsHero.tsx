import React from 'react';

const MobileDestinationsHero: React.FC = () => {
    return (
        <section className="relative overflow-hidden bg-black px-6 pb-12 pt-28 md:hidden text-white border-b border-white/[0.08]">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop")',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
            <div className="relative mx-auto max-w-md">
                <h1 className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-white">
                    Find your next <span className="italic text-white/90">expedition.</span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-white/60 font-sans">
                    Explore the uncharted territories of the Himalayas. Handpicked trails and expert local guides.
                </p>
            </div>
        </section>
    );
};

export default MobileDestinationsHero;
