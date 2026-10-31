import React from 'react';

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
                        <div className="relative w-full max-w-md border border-slate-700 bg-slate-800/90 p-2 shadow-2xl">
                            <img
                                src="/assets/become-a-guide-main-page.jpg"
                                alt="A trekking group making their way through snowy mountain terrain"
                                loading="lazy"
                                className="w-full h-[450px] object-cover object-bottom filter contrast-[1.05]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
