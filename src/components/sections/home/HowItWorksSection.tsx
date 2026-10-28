import React from 'react';
import Link from 'next/link';
import { Compass, Users, Mountain, ArrowRight } from 'lucide-react';

const WORKFLOW_STEPS = [
    {
        step: "01",
        title: "Trail Architecture & Topo Intel",
        desc: "Examine high-altitude contours, seasonal conditions, and water sources across our curated Himalayan expedition database.",
        icon: Compass,
        label: "Ingestion & Planning",
    },
    {
        step: "02",
        title: "Direct Native Fellowship",
        desc: "Connect directly with generational mountain guides without agency middlemen. Establish mutual pacing, dietary preferences, and safety briefings.",
        icon: Users,
        label: "Guide Alliance",
    },
    {
        step: "03",
        title: "Alpine Immersion & Safety",
        desc: "Step onto untracked ridges supported by rigorous wilderness first-response protocols and leave-no-trace ethics.",
        icon: Mountain,
        label: "Wilderness Ascent",
    },
];

const HowItWorksSection: React.FC = () => {
    return (
        <section
            className="border-t border-white/[0.08] px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-black relative text-white"
            id="how-it-works"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="max-w-2xl mb-16">
                    <p className="text-xs uppercase tracking-widest text-white/45 mb-3 font-sans font-medium">
                        Expedition Protocol &middot; Architecture
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                        How Uncharted <span className="italic text-white/90">architects the journey.</span>
                    </h2>
                    <p className="text-sm text-white/55 mt-4 leading-relaxed font-sans">
                        From solitary map reading to standing atop 14,000-foot passes beside a trusted mountain guardian.
                    </p>
                </div>

                {/* Workflow Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    {WORKFLOW_STEPS.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.step}
                                className="border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col justify-between hover:border-white/20 hover:bg-white/[0.03] transition duration-200 group relative"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-xs tracking-wider text-white/40 uppercase font-mono">
                                            Phase {step.step}
                                        </span>
                                        <span className="text-[10px] px-2.5 py-0.5 border border-white/10 text-white/60 bg-white/[0.02] font-mono uppercase tracking-wider">
                                            {step.label}
                                        </span>
                                    </div>

                                    <div className="h-10 w-10 border border-white/15 bg-white/[0.03] flex items-center justify-center text-white mb-6 group-hover:border-white/35 transition duration-150">
                                        <Icon className="w-5 h-5 text-white/80" />
                                    </div>

                                    <h3 className="font-display text-2xl font-normal text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-white/55 leading-relaxed font-sans">
                                        {step.desc}
                                    </p>
                                </div>

                                <div className="pt-6 mt-8 border-t border-white/[0.06] text-[11px] font-mono text-white/40 uppercase tracking-wider">
                                    Frictionless &middot; Direct &middot; Pure
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Editorial Call to Action Banner (Atlas Revolution CTA Style) */}
                <div className="border border-white/15 bg-neutral-950 p-8 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-bl-full pointer-events-none" />

                    <div className="max-w-xl text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                            <img
                                src="/assets/brand-logo.png"
                                alt="Uncharted Stag"
                                className="h-5 w-auto invert opacity-80"
                            />
                            <span className="text-xs uppercase tracking-widest text-white/50 font-mono">
                                Uncharted Alpinism
                            </span>
                        </div>
                        <h3 className="font-display text-3xl sm:text-4xl font-normal text-white mb-3">
                            The ridges are calling. <span className="italic text-white/85">Will you heed them?</span>
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed font-sans font-normal">
                            Discover untouched valleys and book your next Himalayan journey directly with the leaders who call these mountains home.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Link
                            href="/destinations"
                            className="px-7 py-3.5 bg-white text-black hover:bg-white/90 font-medium text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 text-center"
                        >
                            <span>Browse Trails</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/become-a-guide"
                            className="px-7 py-3.5 border border-white/20 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/35 text-white font-medium text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center text-center"
                        >
                            <span>Join As Guide</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
