import React from 'react';

const GuideSelectionSection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-px w-8 bg-yellow-400"></div>
                            <span className="text-yellow-400 uppercase tracking-widest text-sm font-medium">The Standard</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                                How We Choose <br />
                                <span className="text-gray-500">Our Experts</span>
                            </h2>
                            {/* Mobile Visual */}
                            <div className="md:hidden flex-shrink-0 relative w-24 h-32 rounded-xl overflow-hidden shadow-lg mt-2 group">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-600 opacity-20 group-hover:opacity-40 transition duration-300 z-10"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"
                                    alt="Guides in the mountains"
                                    className="w-full h-full object-cover transition-all duration-500 relative z-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                            <p>
                                Our guides are personally picked by our founding team after we've trekked with them.
                            </p>
                            <p>
                                When we appreciate their behavior, leadership, and knowledge on the trail, we offer them the opportunity to join our team. We also recruit based on trusted recommendations from our founding guides, ensuring our high standards are always maintained.
                            </p>
                        </div>
                    </div>

                    {/* Visual Side (Desktop Only) */}
                    <div className="hidden md:flex w-full md:w-1/2 justify-center md:justify-end">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img
                                src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"
                                alt="Guides in the mountains"
                                className="relative rounded-2xl shadow-2xl w-full max-w-md h-[500px] object-cover transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuideSelectionSection;
