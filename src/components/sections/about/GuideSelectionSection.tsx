import React from 'react';

const GuideSelectionSection: React.FC = () => {
    return (
        <section className="py-24 md:py-32 bg-slate-900 text-white border-b border-slate-800">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row gap-16 items-center max-w-6xl mx-auto">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="text-xs uppercase tracking-widest text-yellow-400 font-sans font-semibold">The Standard</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal leading-tight mb-8">
                            How We Choose <br />
                            <span className="italic text-yellow-400">Our Experts</span>
                        </h2>
                        <div className="space-y-6 text-base sm:text-lg text-slate-300 leading-relaxed font-sans font-normal">
                            <p>
                                Our guides are personally picked by our founding team after we've trekked with them.
                            </p>
                            <p className="text-sm text-slate-400">
                                When we appreciate their behavior, leadership, and knowledge on the trail, we offer them the opportunity to join our team. We also recruit based on trusted recommendations from our founding guides, ensuring our high standards are always maintained.
                            </p>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                        <div className="relative border border-slate-700 bg-slate-800/80 p-2 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"
                                alt="Guides in the mountains"
                                className="w-full max-w-md h-[450px] object-cover filter contrast-[1.05]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuideSelectionSection;
