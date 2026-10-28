import React from 'react';
import { Compass } from 'lucide-react';

const MissionSection: React.FC = () => {
    return (
        <section className="py-24 md:py-32 bg-black text-white border-b border-white/[0.08]">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row gap-16 items-center max-w-6xl mx-auto">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="text-xs uppercase tracking-widest text-white/45 font-mono">01 / Intent & Doctrine</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal leading-tight mb-8">
                            Bridging the <br />
                            <span className="italic text-white/90">Altitude Gap.</span>
                        </h2>
                        <p className="font-sans text-base sm:text-lg text-white/65 leading-relaxed mb-6 font-normal">
                            We dismantle commercialized tour conglomerates to offer authentic, unscripted, and deeply personal Himalayan expeditions.
                        </p>
                        <p className="font-sans text-sm text-white/50 leading-relaxed font-normal">
                            We empower local mountain experts to share their lifetime of experience directly, pairing them with explorers seeking reverence over checkboxes.
                        </p>
                    </div>

                    {/* Visual Side */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                        <div className="relative w-full max-w-md aspect-square border border-white/15 bg-neutral-950 flex flex-col justify-between p-8 shadow-2xl">
                            <div className="flex justify-between items-center text-xs font-mono text-white/40">
                                <span>PARVATI &middot; DHAULADHAR</span>
                                <span>EST. 2026</span>
                            </div>
                            <div className="text-center py-8">
                                <Compass className="w-16 h-16 text-white/80 mx-auto mb-4 stroke-1" />
                                <div className="font-display text-2xl text-white">Direct Guide Brotherhood</div>
                                <div className="text-xs font-mono uppercase tracking-widest text-white/50 mt-1">
                                    Zero Commercial Intermediaries
                                </div>
                            </div>
                            <div className="border-t border-white/[0.08] pt-4 flex justify-between text-[11px] font-mono text-white/50">
                                <span>ELEVATION: 14,000+ FT</span>
                                <span>VETTED LINEAGE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
