import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, ShieldCheck, Mountain, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FeaturePillar {
    index: string;
    title: string;
    subtitle: string;
    description: string;
    icon: typeof Mountain;
    tag: string;
    status: string;
    imageUrl: string;
}

const pillars: FeaturePillar[] = [
    {
        index: '01',
        title: 'Native Mountain Lineage',
        subtitle: 'Living Heritage',
        description: 'Guided by generational Himalayan natives who grew up navigating remote glacial passes, hidden ridge trails, and sacred river gorges.',
        icon: Mountain,
        tag: 'Heritage & Instinct',
        status: 'Authentic Lineage',
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    },
    {
        index: '02',
        title: 'Curated Alpine Expeditions',
        subtitle: 'Offbeat Solitude',
        description: 'Hand-picked routes designed to circumvent mass tourism choke points. Experience the raw silence and grandeur of untamed peaks.',
        icon: Compass,
        tag: 'Curated Trajectories',
        status: 'Zero Mass Noise',
        imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&auto=format&fit=crop',
    },
    {
        index: '03',
        title: 'Wilderness Safety Doctrine',
        subtitle: 'Uncompromising Protocol',
        description: 'Every local guide is rigorously certified in high-altitude medicine, rapid hypothermia triage, and technical terrain ropework.',
        icon: ShieldCheck,
        tag: 'Altitude Protocol',
        status: 'Vetted First-Response',
        imageUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop',
    },
    {
        index: '04',
        title: 'Direct Guide Fellowship',
        subtitle: 'Zero Middlemen',
        description: 'Consult directly with your expedition leader before tying your bootlaces. Form genuine bonds and tailor your ascent pace.',
        icon: MessageSquare,
        tag: 'Direct Connection',
        status: 'Unfiltered Access',
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop',
    }
];

const WhyUsSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const grid = gridRef.current;
        if (!section || !grid) return;

        const cards = gsap.utils.toArray(grid.children) as HTMLElement[];
        gsap.set(cards, { opacity: 0, y: 30 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        tl.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out"
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="border-t border-white/[0.08] px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-black relative text-white"
            id="why-us"
        >
            <div className="max-w-6xl mx-auto">
                {/* Editorial Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-white/45 mb-3 font-sans font-medium">
                            Philosophy &middot; Architectural Pillars
                        </p>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                            Why traverse <span className="italic text-white/90">with Uncharted?</span>
                        </h2>
                    </div>
                    <p className="text-sm text-white/55 max-w-md font-sans leading-relaxed">
                        We dismantle the commercial tourist industry and replace it with direct fellowship, uncompromising alpine safety, and living mountain lore.
                    </p>
                </div>

                {/* Editorial Pillars Grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={pillar.index}
                                className="border border-white/[0.08] bg-white/[0.02] p-7 flex flex-col justify-between hover:border-white/25 hover:bg-white/[0.04] transition duration-200 group relative"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="font-display text-2xl text-white/30 font-normal group-hover:text-white/60 transition-colors">
                                            {pillar.index}
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 border border-white/10 text-white/60 font-mono uppercase tracking-wider bg-black/40">
                                            {pillar.tag}
                                        </span>
                                    </div>

                                    <div className="h-9 w-9 border border-white/15 bg-white/[0.03] flex items-center justify-center text-white mb-6 group-hover:border-white/35 transition duration-150">
                                        <Icon className="w-4 h-4 text-white/80" />
                                    </div>

                                    <h3 className="font-display text-2xl font-normal text-white mb-2 group-hover:text-white transition-colors">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-xs text-white/45 font-mono uppercase tracking-wider mb-3">
                                        {pillar.subtitle}
                                    </p>
                                    <p className="text-sm text-white/55 leading-relaxed font-sans font-normal">
                                        {pillar.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-white/[0.06] text-[11px] font-sans text-white/50 uppercase tracking-wider flex items-center justify-between">
                                    <span>Standard</span>
                                    <span className="text-white/90 font-medium">{pillar.status}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyUsSection;