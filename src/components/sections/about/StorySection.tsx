import React from 'react';

const StorySection: React.FC = () => {
    return (
        <section className="py-24 md:py-32 bg-black text-white border-b border-white/[0.08]">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row-reverse gap-16 items-center max-w-6xl mx-auto">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="text-xs uppercase tracking-widest text-white/45 font-mono">02 / Origin Chronicle</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal leading-tight mb-8">
                            Born from <br />
                            <span className="italic text-white/90">Firsthand Solitude.</span>
                        </h2>
                        <div className="space-y-6 text-base sm:text-lg text-white/65 leading-relaxed font-sans font-normal">
                            <p>
                                Uncharted Travel was born from a simple realization: the safest, quietest, and most memorable treks aren't led by corporate ticketing companies, but by the generational shepherds, villagers, and mountaineers who know every stone by name.
                            </p>
                            <p className="text-sm text-white/50">
                                We constructed this spatial platform to connect wanderers directly with these custodians of the Himalayas, ensuring fair livelihood for native families and profound experiences for travellers.
                            </p>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                        <div className="relative border border-white/15 bg-neutral-950 p-2 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2070&auto=format&fit=crop"
                                alt="Himalayan Trekkers on Ridge"
                                className="w-full max-w-md h-[450px] object-cover filter contrast-[1.05]"
                            />
                            <div className="p-4 border-t border-white/[0.08] flex justify-between items-center text-[11px] font-mono text-white/45">
                                <span>UNTOUCHED TRAILWAYS</span>
                                <span>EST. 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
