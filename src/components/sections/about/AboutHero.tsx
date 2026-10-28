import React from 'react';
import { Compass } from 'lucide-react';

const AboutHero: React.FC = () => {
    return (
        <section className="relative min-h-[65vh] flex items-center justify-center bg-black text-white pt-36 pb-20 border-b border-white/[0.08]">
            <div className="container mx-auto px-6 text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/15 bg-white/[0.03] backdrop-blur-md mb-8">
                    <Compass className="w-3.5 h-3.5 text-white/70" />
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/75">
                        Our Guiding Philosophy
                    </span>
                </div>

                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.08] max-w-4xl mx-auto mb-8 text-white">
                    The mountains don't yield — they <span className="italic text-white/90">transform us</span>, if we know who to follow.
                </h1>

                <p className="font-sans text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed font-normal">
                    We believe the most profound way to experience the Himalayas is by walking alongside native guardians who know every glacial moraine, sacred spring, and unwritten legend.
                </p>
            </div>
        </section>
    );
};

export default AboutHero;
