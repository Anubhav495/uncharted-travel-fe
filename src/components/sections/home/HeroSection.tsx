import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDown } from 'lucide-react';

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
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            id="hero"
        >
            {/* Video Background */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: 'url(/assets/spiti-poster-mobile.png)',
                }}
            >
                <div className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/assets/spiti-poster-desktop.png)' }} />
            </div>
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover z-0"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            >
                <source src="/assets/spiti-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/assets/spiti.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/30 z-10" />

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 text-center text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight [text-shadow:0_2px_4px_rgb(0_0_0_/_0.5)]">
                        Go <span className="text-yellow-400">Beyond</span> the Guidebook
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed opacity-90 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]">
                        Discover authentic experiences led by passionate local experts.
                        UnchartedTravel connects you with vetted guides for truly personal tours.
                    </p>

                    <div className="flex flex-row gap-3 justify-center items-center w-full px-2 sm:px-0">
                        <button
                            onClick={handleExplore}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 sm:py-4 px-3 sm:px-6 rounded-lg text-sm sm:text-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-lg hover:shadow-xl whitespace-nowrap min-w-[160px] sm:min-w-[200px] flex justify-center items-center"
                        >
                            Explore Adventures
                        </button>
                        <Link
                            href="/become-a-guide"
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 sm:py-4 px-3 sm:px-6 rounded-lg text-sm sm:text-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-lg hover:shadow-xl whitespace-nowrap min-w-[160px] sm:min-w-[200px] flex justify-center items-center"
                        >
                            Become a Guide
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll Down Arrow */}
            <div className={`fixed bottom-4 left-0 right-0 z-20 flex justify-center transition-all duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                <button
                    onClick={scrollToNext}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 animate-bounce"
                    aria-label="Scroll to next section"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/15 to-transparent z-10" />
        </section>
    );
};

export default HeroSection;