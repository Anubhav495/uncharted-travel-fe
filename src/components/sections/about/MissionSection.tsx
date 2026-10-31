import React from 'react';
import { MapPin } from 'lucide-react';

const MissionSection: React.FC = () => {
    return (
        <section className="py-24 md:py-32 bg-slate-900 text-white border-b border-slate-800">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row gap-16 items-center max-w-6xl mx-auto">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="text-xs uppercase tracking-widest text-yellow-400 font-sans font-semibold">Our Mission</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal leading-tight mb-8">
                            Bridging the <br />
                            <span className="italic text-yellow-400">Altitude</span>
                        </h2>
                        <p className="font-sans text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
                            We're moving beyond commercialized tour packages to offer authentic, unscripted, and deeply personal Himalayan expeditions.
                        </p>
                        <p className="font-sans text-sm text-slate-400 leading-relaxed font-normal">
                            We empower local mountain experts to share their lifetime of experience, pairing them with trekkers seeking a deeper connection to the peaks.
                        </p>
                    </div>

                    {/* Visual Side */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                        <div className="relative w-full max-w-md aspect-square border border-slate-700 bg-slate-800/80 flex flex-col justify-center items-center p-8 shadow-2xl text-center">
                            <MapPin className="w-16 h-16 text-yellow-400 mx-auto mb-4 stroke-1" />
                            <div className="font-display text-2xl text-white mb-2">Local Mountain Expertise</div>
                            <p className="text-xs text-slate-400 font-sans max-w-xs leading-relaxed">
                                Direct connection with generational Himalayan guides for unforgettable journeys.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
