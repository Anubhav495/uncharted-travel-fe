import React from 'react';

const StorySection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-px w-8 bg-yellow-400"></div>
                            <span className="text-yellow-400 uppercase tracking-widest text-sm font-medium">The Story</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                                Born from <br />
                                <span className="text-gray-500">Experience</span>
                            </h2>
                            {/* Mobile Visual */}
                            <div className="md:hidden flex-shrink-0 relative w-24 h-32 rounded-xl overflow-hidden shadow-lg mt-2 group">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-600 opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2070&auto=format&fit=crop"
                                    alt="Hikers on a trail"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                            <p>
                                Uncharted Travel was born from a simple realization: the safest and most memorable treks aren't led by corporate agencies, but by the local shepherds, villagers, and guides who call the mountains home.
                            </p>
                            <p>
                                We wanted to build a platform that directly connects adventure seekers with these unsung heroes of the Himalayas, ensuring fair pay for locals and unforgettable journeys for trekkers.
                            </p>
                        </div>
                    </div>

                    {/* Visual Side (Desktop Only) */}
                    <div className="hidden md:flex w-full md:w-1/2 justify-center md:justify-start">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img
                                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2070&auto=format&fit=crop"
                                alt="Hikers on a trail"
                                className="relative rounded-2xl shadow-2xl w-full max-w-md h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
