import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        title: 'Local Mountain Experts',
        description: 'Connect with seasoned guides who know every hidden trail and peak.',
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        href: '/guides'
    },
    {
        title: 'Curated Expeditions',
        description: 'Choose from hand-picked Himalayan treks designed for every endurance level.',
        imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&auto=format&fit=crop',
        href: '/tours'
    },
    {
        title: 'Trust & Safety First',
        description: 'Every local guide is vetted for high-altitude emergency response training.',
        imageUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop',
        href: '/trust-and-safety'
    },
    {
        title: 'Direct Connections',
        description: 'Chat openly with your trekking company and guide before you head out.',
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop',
        href: '/how-it-works'
    }
];

const FeatureCard: React.FC<{
    title: string;
    description: string;
    imageUrl: string;
    href?: string;
}> = ({ title, description, imageUrl }) => {
    return (
        <div
            className="group block relative h-48 sm:h-64 md:h-80 rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
        >
            <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-3 sm:p-6 text-white">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{title}</h3>
                <p className="text-xs sm:text-base opacity-90 mb-2 sm:mb-3">{description}</p>
            </div>
        </div>
    );
};

const WhyUsSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const grid = gridRef.current;

        if (!section || !grid) return;

        const cards = gsap.utils.toArray(grid.children) as HTMLElement[];

        gsap.set(cards, { opacity: 0, y: 50 });

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
            stagger: 0.15,
            ease: "power2.out"
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-16 sm:py-20 md:py-24 bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop)'
            }}
            id="why-us"
        >
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative container mx-auto px-4 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
                    <span className="text-yellow-400">Why</span> Travel With Us?
                </h2>

                <p className="text-base sm:text-lg text-gray-200 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                    We're building a community founded on trust, passion, and the magic of experiencing the Himalayas through a local's eyes.
                </p>

                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
                >
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUsSection;