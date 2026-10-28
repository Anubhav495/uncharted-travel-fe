import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight, ChevronDown } from 'lucide-react';

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
            className="relative h-screen min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black text-white"
            id="hero"
        >
            {/* Clean Background Video with standard HTML5 poster to prevent photo overlap ghosting */}
            <video
                ref={videoRef}
                poster="/assets/spiti-poster-desktop.png"
                className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            >
                <source src="/assets/spiti-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/assets/spiti.mp4" type="video/mp4" />
            </video>

            {/* Seamless, uniform cinematic tint across the whole video — no cards, no borders, no shapes */}
            <div className="absolute inset-0 bg-black/35 pointer-events-none z-10" />

            {/* Ambient Vector Topo Grid Lines (Atlas Style) */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-15">
                <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            {/* Hero Main Content — Clean editorial typography directly on video with zero card/box */}
            <div className="relative z-20 container mx-auto px-5 sm:px-8 md:px-12 text-center pt-24 pb-16 max-w-4xl">
                {/* Editorial Display Heading (Instrument Serif) */}
                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.05] mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] animate-fade-rise">
                    Go beyond <span className="italic text-yellow-400">the guidebook.</span>
                </h1>

                {/* Exact Requested Subtext with Atlas Typography */}
                <p className="font-sans text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed mb-10 font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] animate-fade-rise-delay">
                    Discover authentic experiences led by passionate local experts. UnchartedTravel connects you with vetted guides for truly personal tours.
                </p>

                {/* Atlas-Style Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto animate-fade-rise-delay-2">
                    <button
                        onClick={handleExplore}
                        className="w-full sm:w-auto px-8 py-3.5 bg-yellow-400 text-slate-950 hover:bg-yellow-300 font-sans font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.5)] group cursor-pointer active:scale-95 rounded-none"
                    >
                        <span>Explore Expeditions</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link
                        href="/become-a-guide"
                        className="w-full sm:w-auto px-8 py-3.5 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-500 text-white font-sans font-medium text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center backdrop-blur-sm text-center shadow-lg active:scale-95 rounded-none"
                    >
                        Become a Guide
                    </Link>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div
                className={`absolute bottom-6 left-0 right-0 z-20 flex justify-center transition-all duration-300 ${
                    isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            >
                <button
                    onClick={scrollToNext}
                    className="w-9 h-9 flex items-center justify-center border border-slate-700 bg-slate-900/80 backdrop-blur-md text-yellow-400 hover:text-yellow-300 hover:border-yellow-400/50 transition-all duration-200 rounded-none cursor-pointer"
                    aria-label="Scroll to next section"
                >
                    <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
            </div>
        </section>
    );
};

export default HeroSection;