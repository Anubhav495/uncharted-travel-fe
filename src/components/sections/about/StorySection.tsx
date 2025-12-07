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
                                <span className="text-gray-500">Realization</span>
                            </h2>
                            {/* Mobile Visual */}
                            <div className="md:hidden flex-shrink-0 relative w-24 h-32 rounded-xl overflow-hidden shadow-lg mt-2 group">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-600 opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
                                    alt="Friends sharing a meal"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                            <p>
                                Uncharted Travel was born from a simple realization: the most memorable travel moments aren't found at crowded landmarks, but in quiet cafes, hidden art galleries, and family kitchens.
                            </p>
                            <p>
                                We wanted to build a platform that makes these serendipitous connections accessible to everyone.
                            </p>
                        </div>
                    </div>

                    {/* Visual Side (Desktop Only) */}
                    <div className="hidden md:flex w-full md:w-1/2 justify-center md:justify-start">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img
                                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
                                alt="Friends sharing a meal"
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
