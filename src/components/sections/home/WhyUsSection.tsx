import React, { useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
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
            className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-black relative text-white"
            id="why-us"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header with EXACT original text */}
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight mb-4">
                        Why Travel <span className="italic text-white/90">With Us?</span>
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-white/60 leading-relaxed font-normal">
                        We're building a community founded on trust, passion, and the magic of experiencing the Himalayas through a local's eyes.
                    </p>
                </div>

                {/* Cards Container with Horizontal Static Arrow Line behind on Laptop */}
                <div className="relative">
                    {/* Background horizontal static arrow line on laptop */}
                    <div 
                        className="hidden lg:flex absolute top-1/2 left-4 right-4 -translate-y-1/2 items-center pointer-events-none z-0 opacity-40"
                        aria-hidden="true"
                    >
                        <div className="w-full h-px border-t border-dashed border-white/20" />
                    </div>

                    {/* Cards Grid with EXACT original text & images, Atlas design */}
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
                    >
                        {features.map((feature, idx) => (
                            <React.Fragment key={feature.index}>
                                <div
                                    className="why-us-card border border-white/10 bg-neutral-950 flex flex-col justify-between overflow-hidden group hover:border-white/30 transition-all duration-300 shadow-xl relative"
                                >
                                    {/* Card Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={feature.imageUrl}
                                            alt={feature.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                                        <div className="absolute top-3 left-3">
                                            <span className="font-display text-xl text-white/80 bg-black/60 px-2 py-0.5 border border-white/15 backdrop-blur-md">
                                                {feature.index}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content with Exact Original Title and Description */}
                                    <div className="p-6 flex flex-col justify-between flex-grow">
                                        <div>
                                            <h3 className="font-display text-2xl font-normal text-white mb-2 leading-tight">
                                                {feature.title}
                                            </h3>
                                            <p className="font-sans text-sm text-white/60 leading-relaxed font-normal">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Laptop Horizontal Static Arrow (between 01->02, 02->03, 03->04) */}
                                    {idx < features.length - 1 && (
                                        <div 
                                            className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full items-center justify-center border border-white/25 bg-neutral-950 text-white/80 shadow-2xl pointer-events-none group-hover:border-white/50 group-hover:text-white transition-colors"
                                            aria-hidden="true"
                                        >
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Downward Arrow: As the explorer scrolls down through the cards */}
                                {idx < features.length - 1 && (
                                    <div 
                                        className="sm:hidden flex flex-col items-center justify-center -my-2 py-1 text-white/50 z-20 pointer-events-none"
                                        aria-hidden="true"
                                    >
                                        <div className="w-px h-3 bg-gradient-to-b from-white/20 to-white/10" />
                                        <div className="w-7 h-7 rounded-full border border-white/20 bg-neutral-950 flex items-center justify-center my-0.5 text-white/70 shadow-lg">
                                            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                                        </div>
                                        <div className="w-px h-3 bg-gradient-to-b from-white/10 to-transparent" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUsSection;