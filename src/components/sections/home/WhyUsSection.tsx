import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        title: 'Local Mountain Experts',
        description: 'Connect with seasoned guides who know every hidden trail and peak.',
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    },
    {
        title: 'Curated Expeditions',
        description: 'Choose from hand-picked Himalayan treks designed for every endurance level.',
        imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&auto=format&fit=crop',
    },
    {
        title: 'Trust & Safety First',
        description: 'Every local guide is vetted for high-altitude emergency response training.',
        imageUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop',
    },
    {
        title: 'Direct Connections',
        description: 'Chat openly with your trekking company and guide before you head out.',
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop',
    }
];

const WhyUsSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const getScrollPositions = (rail: HTMLDivElement) => {
        const cards = Array.from(rail.querySelectorAll<HTMLElement>('.why-us-card'));
        const firstOffset = cards[0]?.offsetLeft ?? 0;
        const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
        return cards.map(card => Math.min(card.offsetLeft - firstOffset, maxScroll));
    };

    const scrollToCard = (index: number) => {
        const rail = gridRef.current;
        if (!rail) return;
        const nextIndex = Math.max(0, Math.min(index, features.length - 1));
        rail.scrollTo({
            left: getScrollPositions(rail)[nextIndex],
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
    };

    const updateActiveCard = (event: React.UIEvent<HTMLDivElement>) => {
        const rail = event.currentTarget;
        const positions = getScrollPositions(rail);
        const nearestIndex = positions.reduce((nearest, position, index) => (
            Math.abs(position - rail.scrollLeft) < Math.abs(positions[nearest] - rail.scrollLeft) ? index : nearest
        ), 0);
        setActiveIndex(nearestIndex);
    };

    useEffect(() => {
        const section = sectionRef.current;
        const grid = gridRef.current;
        if (!section || !grid) return;

        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const cards = grid.querySelectorAll('.why-us-card');
            gsap.fromTo(cards, { opacity: 0, y: 30 }, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.12,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });
        }, section);

        return () => media.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="forest-background px-6 md:px-12 lg:px-20 py-24 md:py-32 relative text-white border-b border-slate-800"
            id="why-us"
        >
            <div
                aria-hidden="true"
                className="hero-forest-fade absolute inset-x-0 top-0 h-24 sm:h-40 pointer-events-none"
            />
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight mb-4">
                        Why Travel <span className="italic text-yellow-400">With Us?</span>
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                        We're building a community founded on trust, passion, and the magic of experiencing the Himalayas through a local's eyes.
                    </p>
                </div>

                <div className="sm:hidden flex items-center gap-2 mb-4 text-[11px] font-sans uppercase tracking-widest text-slate-300">
                    Swipe to explore
                    <MoveRight className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                </div>
                <div
                    ref={gridRef}
                    role="region"
                    aria-label="Why travel with us benefits"
                    tabIndex={0}
                    onScroll={updateActiveCard}
                    onKeyDown={event => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                            event.preventDefault();
                            scrollToCard(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
                        } else if (event.key === 'Home' || event.key === 'End') {
                            event.preventDefault();
                            scrollToCard(event.key === 'Home' ? 0 : features.length - 1);
                        }
                    }}
                    className="relative z-10 -mx-6 px-6 pb-4 flex gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-px-6 scrollbar-hide sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:snap-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
                >
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="why-us-card min-w-0 basis-[86%] shrink-0 snap-start border border-slate-700 bg-slate-800/95 sm:bg-slate-800/70 flex flex-col justify-between overflow-hidden group hover:border-yellow-400/40 transition-colors duration-300 shadow-xl relative"
                        >
                            {/* Card Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={feature.imageUrl}
                                    alt={feature.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            <div className="p-6 flex flex-col justify-between flex-grow">
                                <div>
                                    <h3 className="font-display text-2xl font-normal text-white mb-3 leading-tight group-hover:text-yellow-400 transition-colors">
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
                <div className="sm:hidden flex items-center justify-between gap-4 mt-3">
                    <div className="flex items-center gap-1" aria-label="Choose a travel benefit">
                        {features.map((feature, index) => (
                            <button
                                key={feature.title}
                                type="button"
                                onClick={() => scrollToCard(index)}
                                aria-label={`View ${feature.title}`}
                                aria-current={activeIndex === index ? 'true' : undefined}
                                className="w-9 h-11 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
                            >
                                <span className={`h-1 transition-all duration-200 ${activeIndex === index ? 'w-8 bg-yellow-400' : 'w-4 bg-slate-500'}`} />
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => scrollToCard(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            aria-label="Previous benefit"
                            className="w-11 h-11 flex items-center justify-center border border-slate-700 bg-slate-800/90 text-yellow-400 transition-colors hover:border-yellow-400 disabled:opacity-30 disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollToCard(activeIndex + 1)}
                            disabled={activeIndex === features.length - 1}
                            aria-label="Next benefit"
                            className="w-11 h-11 flex items-center justify-center border border-slate-700 bg-slate-800/90 text-yellow-400 transition-colors hover:border-yellow-400 disabled:opacity-30 disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUsSection;
