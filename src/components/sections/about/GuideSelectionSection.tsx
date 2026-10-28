import React from 'react';

const GuideSelectionSection: React.FC = () => {
    return (
        <section className="py-24 md:py-32 bg-black text-white border-b border-white/[0.08]">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row gap-16 items-center max-w-6xl mx-auto">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="text-xs uppercase tracking-widest text-white/45 font-mono">03 / Rigorous Standard</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal leading-tight mb-8">
                            Vetting Our <br />
                            <span className="italic text-white/90">Native Leaders.</span>
                        </h2>
                        <div className="space-y-6 text-base sm:text-lg text-white/65 leading-relaxed font-sans font-normal">
                            <p>
                                Every guide on Uncharted is personally evaluated and joined in the field by our founding team before being invited to the platform.
                            </p>
                            <p className="text-sm text-white/50">
                                When we witness true poise in whiteouts, instinctive trail navigation, deep ethical humility, and alpine medical knowledge, we formalize our fellowship. No guide is onboarded through automated algorithms.
                            </p>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                        <div className="relative border border-white/15 bg-neutral-950 p-2 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"
                                alt="Alpine Expedition Guidance"
                                className="w-full max-w-md h-[450px] object-cover filter contrast-[1.05]"
                            />
                            <div className="p-4 border-t border-white/[0.08] flex justify-between items-center text-[11px] font-mono text-white/45">
                                <span>HUMAN-VETTED PROTOCOL</span>
                                <span>100% IN-PERSON</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuideSelectionSection;
