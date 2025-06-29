import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Star } from 'lucide-react';
import GuideStoriesSection from '../modal/GuidedStoriesSection.tsx';
import brandLogo from '../../assets/placeholder-app-mockup.png';
import { debounce } from '../../lib/utils.ts';

gsap.registerPlugin(ScrollTrigger);

const placeholderImageUrls = [
    'https://picsum.photos/seed/experts/800/600',
    'https://picsum.photos/seed/tours/800/600',
    'https://picsum.photos/seed/safety/800/600',
    'https://picsum.photos/seed/connect/800/600',
];

interface HomePageProps {
    onJoinWaitlist: () => void;
}

declare global {
    interface Window {
        YT?: any;
        onYouTubeIframeAPIReady?: () => void;
    }
}

const FeatureCard: React.FC<{ title: string; description: string; imageUrl: string; href: string }> = ({ title, description, imageUrl, href }) => {
    return (
        <a href={href} className="group relative block h-96 w-full rounded-lg overflow-hidden shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-75">
            <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
            <div className="relative flex flex-col h-full justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-base mb-4">{description}</p>
                <span className="font-semibold text-sky-300 group-hover:underline"> Learn More &rarr; </span>
            </div>
        </a>
    );
};

const ReviewCard: React.FC<{ name: string; avatarUrl: string; rating: number; tour: string; quote: string; }> = ({ name, avatarUrl, rating, tour, quote }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col text-left">
            <div className="flex items-center mb-4">
                <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                    <p className="font-bold text-gray-800">{name}</p>
                    <p className="text-sm text-gray-500">{tour}</p>
                </div>
            </div>
            <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
            </div>
            <p className="text-gray-600 italic">"{quote}"</p>
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({ onJoinWaitlist }) => {
    const videoId = "GPuIPUkZ0gM";
    const videoStartTime = 11; 
    const videoEndTime = 14;
    const playerRef = useRef<any>(null);
    const playerElementRef = useRef<HTMLDivElement | null>(null);
    const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isPlayerFading, setIsPlayerFading] = useState(false);
    const playerContainerId = "youtube-player-background";
    const fadeDuration = 500; 
    
    const isPlayerFadingRef = useRef(isPlayerFading);

    const featureGridRef = useRef<HTMLDivElement>(null);
    const waitlistButtonRef = useRef<HTMLButtonElement>(null);
    const [arrowPosition, setArrowPosition] = useState<{ left: number } | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const customerReviews = [
        { name: 'Emily Carter', avatarUrl: 'https://picsum.photos/seed/avatar1/100/100', rating: 5, tour: 'Tour with Marco in Rome', quote: 'Marco made the Colosseum come alive! It wasn’t just a tour; it was like stepping back in time. Absolutely unforgettable.' },
        { name: 'James O\'Connell', avatarUrl: 'https://picsum.photos/seed/avatar2/100/100', rating: 5, tour: 'Food tour with Amélie', quote: 'Amélie showed us the hidden food gems in Le Marais. The best croissant I have ever had in my life. A must-do in Paris!' },
        { name: 'Priya Sharma', avatarUrl: 'https://picsum.photos/seed/avatar3/100/100', rating: 5, tour: 'Kyoto Zen Gardens', quote: 'Kenji’s calm presence and deep knowledge of Zen philosophy provided a truly peaceful and enlightening experience. Highly recommended.' },
    ];

    useLayoutEffect(() => {
        const calculateArrowPosition = () => {
            if (waitlistButtonRef.current) {
                const buttonRect = waitlistButtonRef.current.getBoundingClientRect();
                const buttonCenter = buttonRect.left + buttonRect.width / 2;
                setArrowPosition({ left: buttonCenter });
            }
        };

        const debouncedCalculateArrowPosition = debounce(calculateArrowPosition, 100);

        debouncedCalculateArrowPosition();
        window.addEventListener('resize', debouncedCalculateArrowPosition);

        return () => {
            window.removeEventListener('resize', debouncedCalculateArrowPosition);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { setIsScrolled(true); } else { setIsScrolled(false); }
        };
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('scroll', handleScroll); };
    }, []);

    useEffect(() => {
        const grid = featureGridRef.current;
        if (grid) {
            const cards = gsap.utils.toArray(grid.children) as HTMLElement[];
            gsap.set(cards, { autoAlpha: 0, y: 50 }); 
            const tl = gsap.timeline({ scrollTrigger: { trigger: grid, start: "top 85%", toggleActions: "play none none none" } });
            tl.to(cards, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 });
            return () => { if (tl && tl.scrollTrigger) { tl.scrollTrigger.kill(); tl.kill(); } };
        }
    }, []);

    useEffect(() => {
        isPlayerFadingRef.current = isPlayerFading;
    }, [isPlayerFading]);

    useEffect(() => {
        const setupPlayer = () => {
            if (playerRef.current) return;
            try {
                playerRef.current = new window.YT.Player(playerContainerId, {
                    videoId: videoId,
                    playerVars: { autoplay: 1, controls: 0, mute: 1, modestbranding: 1, showinfo: 0, iv_load_policy: 3, rel: 0, playsinline: 1, start: videoStartTime },
                    events: {
                        onReady: (event: any) => { event.target.playVideo(); event.target.mute(); if (playerElementRef.current) playerElementRef.current.style.opacity = '1'; },
                        onStateChange: (event: any) => {
                            if (event.data === window.YT.PlayerState.PLAYING) {
                                if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
                                loopIntervalRef.current = setInterval(() => {
                                    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function' && !isPlayerFadingRef.current) {
                                        const currentTime = playerRef.current.getCurrentTime();
                                        if (currentTime >= videoEndTime - (fadeDuration / 1000)) {
                                            setIsPlayerFading(true);
                                            if (playerElementRef.current) playerElementRef.current.style.opacity = '0';
                                            setTimeout(() => {
                                                if (playerRef.current && typeof playerRef.current.seekTo === 'function') { playerRef.current.seekTo(videoStartTime, true); }
                                                if (playerElementRef.current) playerElementRef.current.style.opacity = '1';
                                                if (playerRef.current && typeof playerRef.current.playVideo === 'function') { playerRef.current.playVideo(); }
                                                setIsPlayerFading(false);
                                            }, fadeDuration);
                                        }
                                    }
                                }, 50);
                            } else {
                                if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
                            }
                        },
                    },
                });
            } catch (error) { console.error("Error creating YouTube player:", error); }
        };
        if (window.YT && window.YT.Player) { setupPlayer(); } else { window.onYouTubeIframeAPIReady = setupPlayer; }
        
        return () => {
            if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                try { playerRef.current.destroy(); } catch (e) { console.error("Error destroying YouTube player:", e); }
            }
            playerRef.current = null;
            window.onYouTubeIframeAPIReady = undefined;
        };
    }, [videoId, videoStartTime, videoEndTime]);

    const forestImageUrl = "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop";

    return (
        <>
            <section className="relative text-white py-20 overflow-hidden min-h-screen flex items-center justify-center" id="hero">
                <div className="absolute top-0 left-0 w-full h-full z-0">
                    <div id={playerContainerId} ref={playerElementRef} className={`absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full transform -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity ease-in-out`} style={{ opacity: 1, transitionDuration: `${fadeDuration}ms` }} />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>
                </div>
                <div className="container mx-auto text-center relative z-20 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Go <span className="text-yellow-400">Beyond</span> the Guidebook.</h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Discover authentic experiences led by passionate local experts. UnchartedTravel connects you with vetted guides for truly personal tours.</p>
                    <button ref={waitlistButtonRef} onClick={onJoinWaitlist} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-75">
                        Join the Waitlist
                    </button>
                </div>
                {arrowPosition && (
                    <a 
                        href="#why-us" 
                        aria-label="Scroll down to next section" 
                        role="button"
                        tabIndex={0}
                        className={`fixed bottom-4 z-20 animate-bounce p-2 rounded-full hover:bg-white/10 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'} focus:outline-none focus:ring-4 focus:ring-white/50`} 
                        style={{ left: `${arrowPosition.left}px`, transform: 'translateX(-50%)', visibility: 'visible' }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.querySelector('#why-us')?.scrollIntoView({ behavior: 'smooth' }); } }}
                    >
                        <ChevronDown className="w-8 h-8 text-white" aria-hidden="true" />
                    </a>
                )}
            </section>
            
            <div className="relative bg-cover bg-center md:bg-fixed" style={{ backgroundImage: `url(${forestImageUrl})` }}>
                <div className="absolute inset-0 bg-black/40"></div>
                
                <section className="relative py-20 px-4" id="why-us">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]"><span className="text-yellow-400">Why</span> Travel With Us?</h2>
                        <p className="text-base md:text-lg text-gray-200 mb-12 max-w-2xl mx-auto [text-shadow:0_1px_2px_rgb(0_0_0_/_0.5)]">We're building a community founded on trust, passion, and the magic of seeing a city through a local's eyes.</p>
                        <div ref={featureGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard title="Passionate Experts" description="Connect with locals who live and breathe your destination." imageUrl={placeholderImageUrls[0]} href="/guides" />
                            <FeatureCard title="Personal Tours" description="Craft a unique itinerary that perfectly matches your interests and pace." imageUrl={placeholderImageUrls[1]} href="/tours" />
                            <FeatureCard title="Trust & Safety" description="Every guide is vetted to ensure a safe, high-quality experience." imageUrl={placeholderImageUrls[2]} href="/trust-and-safety" />
                            <FeatureCard title="Direct Connection" description="Chat directly with your guide before you book to build a connection." imageUrl={placeholderImageUrls[3]} href="/how-it-works" />
                        </div>
                    </div>
                </section>
                
                <GuideStoriesSection />

                <section className="relative py-20 px-4" id="reviews">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]"><span className="text-yellow-400">Hear</span> From Our Travelers</h2>
                        <p className="text-base md:text-lg text-gray-200 mb-12 max-w-2xl mx-auto [text-shadow:0_1px_2px_rgb(0_0_0_/_0.5)]">Real stories from travelers who discovered the heart of a city with our guides.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {customerReviews.map((review, index) => (
                                <ReviewCard key={index} {...review} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <section className="py-20 px-4 bg-slate-900 text-white" id="how-it-works">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-yellow-400">Find</span> Your Perfect Guide</h2>
                    <p className="text-base md:text-lg text-gray-300 mb-12">Browse profiles, read reviews, and find the local expert who will make your trip unforgettable.</p>
                    <div className="inline-block bg-amber-400 p-8 rounded-lg shadow-xl">
                        <img src={brandLogo} alt="UnchartedTravel Stag Logo" className="h-24 w-auto" />
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
