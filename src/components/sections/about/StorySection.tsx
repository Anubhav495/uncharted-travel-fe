import React from 'react';

const StorySection: React.FC = () => {
    return (
        <section className="py-24 md:py-32 bg-slate-900 text-white border-b border-slate-800">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row-reverse gap-16 items-center max-w-6xl mx-auto">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="text-xs uppercase tracking-widest text-yellow-400 font-sans font-semibold">The Story</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal leading-tight mb-8">
                            Born from <br />
                            <span className="italic text-yellow-400">Experience</span>
                        </h2>
                        <div className="space-y-6 text-base sm:text-lg text-slate-300 leading-relaxed font-sans font-normal">
                            <p>
                                Uncharted Travel was born from a simple realization: the safest and most memorable treks aren't led by corporate agencies, but by the local shepherds, villagers, and guides who call the mountains home.
                            </p>
                            <p className="text-sm text-slate-400">
                                We wanted to build a platform that directly connects adventure seekers with these unsung heroes of the Himalayas, ensuring fair pay for locals and unforgettable journeys for trekkers.
                            </p>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                        <div className="relative border border-slate-700 bg-slate-800/80 p-2 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2070&auto=format&fit=crop"
                                alt="Hikers on a trail"
                                className="w-full max-w-md h-[450px] object-cover filter contrast-[1.05]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
