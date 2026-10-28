import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        index: '01',
        title: 'Local Mountain Experts',
        description: 'Connect with seasoned guides who know every hidden trail and peak.',
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    },
    {
        index: '02',
        title: 'Curated Expeditions',
        description: 'Choose from hand-picked Himalayan treks designed for every endurance level.',
        imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&auto=format&fit=crop',
    },
    {
        index: '03',
        title: 'Trust & Safety First',
        description: 'Every local guide is vetted for high-altitude emergency response training.',
        imageUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop',
    },
    {
        index: '04',
        title: 'Direct Connections',
        description: 'Chat openly with your trekking company and guide before you head out.',
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

        const cards = gsap.utils.toArray(grid.querySelectorAll('.why-us-card')) as HTMLElement[];
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
            duration: 0.6,
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
            className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-slate-900 relative text-white border-b border-slate-800"
            id="why-us"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header with EXACT original text */}
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight mb-4">
                        Why Travel <span className="italic text-yellow-400">With Us?</span>
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                        We're building a community founded on trust, passion, and the magic of experiencing the Himalayas through a local's eyes.
                    </p>
                </div>

                {/* Cards Grid with EXACT original text & images */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
                >
                    {features.map((feature) => (
                        <div
                            key={feature.index}
                            className="why-us-card border border-slate-700 bg-slate-800/50 flex flex-col justify-between overflow-hidden group hover:border-yellow-400/40 transition-all duration-300 shadow-xl relative"
                        >
                            {/* Card Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={feature.imageUrl}
                                    alt={feature.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="font-display text-xl text-yellow-400 bg-slate-900/80 px-2 py-0.5 border border-slate-700 backdrop-blur-md font-semibold">
                                        {feature.index}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content with Exact Original Title and Description */}
                            <div className="p-6 flex flex-col justify-between flex-grow">
                                <div>
                                    <h3 className="font-display text-2xl font-normal text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="font-sans text-sm text-slate-300 leading-relaxed font-normal">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUsSection;