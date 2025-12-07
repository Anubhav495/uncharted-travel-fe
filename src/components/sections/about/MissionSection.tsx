import React from 'react';
import { MapPin } from 'lucide-react';

const MissionSection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-px w-8 bg-yellow-400"></div>
                            <span className="text-yellow-400 uppercase tracking-widest text-sm font-medium">Our Mission</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                                Bridging the <br />
                                <span className="text-gray-500">Gap</span>
                            </h2>
                            {/* Mobile Visual */}
                            <div className="md:hidden flex-shrink-0 relative w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-lg shadow-yellow-400/10 mt-2">
                                <div className="absolute inset-0 rounded-full bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                                <MapPin className="w-10 h-10 text-yellow-400 relative z-10 drop-shadow-lg" />
                            </div>
                        </div>
                        <p className="text-xl text-gray-400 leading-relaxed mb-8">
                            We're moving beyond the guidebook to offer authentic, unscripted, and deeply personal travel experiences.
                        </p>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            We empower local experts to share their passion and travelers to discover the hidden soul of a destination.
                        </p>
                    </div>

                    {/* Visual Side (Desktop Only) */}
                    <div className="hidden md:flex w-full md:w-1/2 justify-center md:justify-end">
                        <div className="relative w-full max-w-md aspect-square rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-2xl shadow-yellow-400/10">
                            <div className="absolute inset-0 rounded-full bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                            <MapPin className="w-32 h-32 text-yellow-400 relative z-10 drop-shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
