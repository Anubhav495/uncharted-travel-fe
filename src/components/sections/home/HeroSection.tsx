import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';

interface HeroSectionProps { }

const HeroSection: React.FC<HeroSectionProps> = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();

    const handleExplore = () => {
        router.push('/destinations');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToNext = () => {
        const nextSection = document.querySelector('#why-us');
        nextSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-black text-white"
            id="hero"
        >
            {/* Cinematic Video & Poster Background */}
            <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
                <div className="block md:hidden relative w-full h-full">
                    <Image
                        src="/assets/spiti-poster-mobile.png"
                        alt="Spiti Valley High Altitude"
                        fill
                        className="object-cover opacity-60"
                        priority={true}
                    />
                </div>
                <div className="hidden md:block relative w-full h-full">
                    <Image
                        src="/assets/spiti-poster-desktop.png"
                        alt="Spiti Valley High Altitude"
                        fill
                        className="object-cover opacity-60"
                        priority={true}
                    />
                </div>
            </div>

            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-55"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            >
                <source src="/assets/spiti-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/assets/spiti.mp4" type="video/mp4" />
            </video>

            {/* Atlas-Style Edge Gradient Fades & Vignettes */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black/90 z-10 pointer-events-none" />

            {/* Ambient Vector Topo Grid Lines (Atlas Style) */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
                <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            {/* Hero Main Content */}
            <div className="relative z-20 container mx-auto px-6 md:px-12 text-center pt-24 pb-16 max-w-5xl">
                {/* Geographic Ingestion Tag / Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/15 bg-white/[0.03] backdrop-blur-md mb-8 animate-fade-rise">
                    <Compass className="w-3.5 h-3.5 text-white/70" />
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/75">
                        32.2461° N, 78.0349° E &middot; High Himalayas
                    </span>
                </div>

                {/* Editorial Display Heading (Instrument Serif) */}
                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.05] mb-6 drop-shadow-sm animate-fade-rise">
                    Go beyond <span className="italic text-white/90">the guidebook.</span>
                </h1>

                {/* Editorial Subtext */}
                <p className="font-sans text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 font-normal animate-fade-rise-delay">
                    High-altitude Himalayan expeditions and offbeat trails guided by native mountain masters. Direct connections, verified safety, zero mass tourism.
                </p>

                {/* Atlas-Style Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto animate-fade-rise-delay-2">
                    <button
                        onClick={handleExplore}
                        className="w-full sm:w-auto px-8 py-3.5 bg-white text-black hover:bg-white/90 font-sans font-medium text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.15)] group cursor-pointer"
                    >
                        <span>Explore Expeditions</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link
                        href="/become-a-guide"
                        className="w-full sm:w-auto px-8 py-3.5 border border-white/20 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/40 text-white font-sans font-medium text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center backdrop-blur-md text-center"
                    >
                        Become a Guide
                    </Link>
                </div>

                {/* Sub-hero Editorial Chapter Markers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-white/[0.08] max-w-3xl mx-auto text-left">
                    <div className="border-l border-white/15 pl-4 py-1">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">Chapter 01</div>
                        <div className="text-xs uppercase tracking-wider text-white/80 font-medium mt-1">14,000+ FT Alpine Archive</div>
                    </div>
                    <div className="border-l border-white/15 pl-4 py-1">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">Chapter 02</div>
                        <div className="text-xs uppercase tracking-wider text-white/80 font-medium mt-1">Vetted Native Masters</div>
                    </div>
                    <div className="border-l border-white/15 pl-4 py-1">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">Chapter 03</div>
                        <div className="text-xs uppercase tracking-wider text-white/80 font-medium mt-1">Zero Commercial Noise</div>
                    </div>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div
                className={`fixed bottom-6 left-0 right-0 z-20 flex justify-center transition-all duration-300 ${
                    isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            >
                <button
                    onClick={scrollToNext}
                    className="w-9 h-9 flex items-center justify-center border border-white/20 bg-black/60 backdrop-blur-md text-white/70 hover:text-white hover:border-white/40 transition-all duration-200"
                    aria-label="Scroll to next section"
                >
                    <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
            </div>
        </section>
    );
};

export default HeroSection;