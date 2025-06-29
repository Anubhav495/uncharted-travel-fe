import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
// Import your video file
import heroVideo from '../../assets/spiti.mp4'

interface HeroSectionProps {
    onJoinWaitlist: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onJoinWaitlist }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const handleLoadedData = () => {
            setIsVideoLoaded(true);
            video.play().catch(console.error);
        };
        const handleEnded = () => {
            video.currentTime = 0;
            video.play().catch(console.error);
        };
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('ended', handleEnded);
        return () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('ended', handleEnded);
        };
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
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover z-0"
                muted
                playsInline
                preload="metadata"
                poster="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop"
            >
                <source src={heroVideo} type="video/mp4" />
            </video>
            
            {/* Fallback background image (shown while video loads) */}
            {!isVideoLoaded && (
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop)'
                    }}
                />
            )}
            
            {/* --- The Controlling Property: Opacity reduced from /40 to /30 --- */}
            <div className="absolute inset-0 bg-black/30 z-10" />
            
            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 text-center text-white">
                <div className="max-w-4xl mx-auto">
                    {/* --- ADDED: Text shadow for guaranteed readability --- */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight [text-shadow:0_2px_4px_rgb(0_0_0_/_0.5)]">
                        Go <span className="text-yellow-400">Beyond</span> the Guidebook
                    </h1>
                    
                    <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed opacity-90 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]">
                        Discover authentic experiences led by passionate local experts. 
                        UnchartedTravel connects you with vetted guides for truly personal tours.
                    </p>
                    
                    <button 
                        onClick={onJoinWaitlist}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-lg hover:shadow-xl"
                    >
                        Join the Waitlist
                    </button>
                </div>
            </div>
            
            {/* Scroll Down Arrow */}
            <div className={`fixed bottom-4 left-0 right-0 z-20 flex justify-center transition-all duration-300 ${
                isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
                <button
                    onClick={scrollToNext}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 animate-bounce"
                    aria-label="Scroll to next section"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>
            </div>
            
            {/* Mobile-optimized gradient overlay at bottom, slightly lightened */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/15 to-transparent z-10" />
        </section>
    );
};

export default HeroSection;