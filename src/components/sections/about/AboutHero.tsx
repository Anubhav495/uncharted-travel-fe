import React from 'react';
import { Compass } from 'lucide-react';

const AboutHero: React.FC = () => {
    return (
        <section className="relative min-h-[65vh] flex items-center justify-center bg-slate-900 text-white pt-36 pb-20 border-b border-slate-800">
            <div className="container mx-auto px-6 text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-700 bg-slate-800/70 backdrop-blur-md mb-8">
                    <Compass className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-xs font-sans uppercase tracking-widest text-yellow-400 font-semibold">
                        Our Philosophy
                    </span>
                </div>

                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.08] max-w-4xl mx-auto mb-8 text-white">
                    The mountains don't yield, they <span className="italic text-yellow-400">transform us</span> — if we know who to follow.
                </h1>

                <p className="font-sans text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                    We believe the best way to experience the Himalayas is by walking alongside the locals who know its every trail and legend.
                </p>
            </div>
        </section>
    );
};

export default AboutHero;
