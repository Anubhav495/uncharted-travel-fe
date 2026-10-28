import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface GuideStory {
    name: string;
    location: string;
    quote: string;
    tags: string[];
    imageUrl: string;
}

const foundingGuides: GuideStory[] = [
    {
        name: 'Kapil Rawat',
        location: 'Garhwal Himalayas (Kedarkantha, Har Ki Dun)',
        quote: "The mountains don't care about your schedule. Respect them, and they'll show you wonders you never imagined.",
        tags: ['High-Altitude Specialist', 'First Aid Certified', '10+ Years Experience'],
        imageUrl: '/assets/kapil-rawat.jpeg',
    },
    {
        name: 'Pritam Negi',
        location: 'Parvati Valley & Spiti',
        quote: "Every trail here has a story my grandfather told me. I don't just guide people; I share our home with them.",
        tags: ['Local Folklore', 'Offbeat Routes', 'Photography Guide'],
        imageUrl: '/assets/pritam-photo-edited.png',
    },
    {
        name: 'Aatish',
        location: 'Dhauladhar Range',
        quote: "I've walked these passes since I was eight. When you trek with me, you walk as a friend, not a client.",
        tags: ['Snow Trek Expert', 'Wildlife Tracker', 'Wilderness Responder'],
        imageUrl: '/assets/aatish-photo.jpeg',
    }
];

const CYCLE_MS = 6000;

const GuideStoriesSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isFading, setIsFading] = useState(false);

    // Mobile touch swipe states
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);

    const startTimeRef = useRef<number>(Date.now());
    const animFrameRef = useRef<number | null>(null);

    const switchSlide = useCallback((newIndex: number) => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setProgress(0);
            startTimeRef.current = Date.now();
            setIsFading(false);
        }, 180);
    }, []);

    const goToPrevious = useCallback(() => {
        const isFirst = currentIndex === 0;
        const newIndex = isFirst ? foundingGuides.length - 1 : currentIndex - 1;
        switchSlide(newIndex);
    }, [currentIndex, switchSlide]);

    const goToNext = useCallback(() => {
        const isLast = currentIndex === foundingGuides.length - 1;
        const newIndex = isLast ? 0 : currentIndex + 1;
        switchSlide(newIndex);
    }, [currentIndex, switchSlide]);

    // Live continuous timer progress — does NOT pause on hover
    useEffect(() => {
        if (isPaused) {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            return;
        }

        startTimeRef.current = Date.now() - (progress / 100) * CYCLE_MS;

        const updateProgress = () => {
            const elapsed = Date.now() - startTimeRef.current;
            const currentProgress = Math.min((elapsed / CYCLE_MS) * 100, 100);
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                goToNext();
            } else {
                animFrameRef.current = requestAnimationFrame(updateProgress);
            }
        };

        animFrameRef.current = requestAnimationFrame(updateProgress);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isPaused, goToNext, currentIndex]);

    // Touch events for mobile swiping
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX);
        setDragOffset(0);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const currentX = e.targetTouches[0].clientX;
        const diff = currentX - touchStartX;
        setDragOffset(diff * 0.7);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (Math.abs(dragOffset) > 40) {
            if (dragOffset < 0) {
                goToNext();
            } else {
                goToPrevious();
            }
        }
        setDragOffset(0);
        setTouchStartX(null);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const currentGuide = foundingGuides[currentIndex];

    return (
        <section
            className="border-t border-slate-800 px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-20 md:py-28 bg-slate-900 relative text-white overflow-hidden"
            id="stories"
        >
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
                    <div>
                        <div className="inline-block border border-slate-700 px-2.5 py-0.5 bg-slate-800 text-[11px] font-sans uppercase tracking-wider text-yellow-400 font-semibold mb-2 sm:mb-3">
                            Real Local Experts
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
                            Stories From Our Founding <span className="italic text-yellow-400">Guides</span>
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-sm font-sans leading-relaxed">
                        They don't just guide treks — they grew up on these trails. Born in the mountains, built for adventure.
                    </p>
                </div>

                {/* Guide Feature Card Container with Laptop Side Arrows */}
                <div className="relative group/card-wrapper">
                    {/* Laptop Left Floating Arrow */}
                    <button
                        onClick={goToPrevious}
                        className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center bg-slate-800/90 hover:bg-yellow-400 text-white hover:text-slate-950 border border-slate-700 hover:border-yellow-400 shadow-xl transition-all duration-200 cursor-pointer active:scale-95 group/btn rounded-none"
                        aria-label="Previous Guide"
                        title="Previous Guide"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
                    </button>

                    {/* Laptop Right Floating Arrow */}
                    <button
                        onClick={goToNext}
                        className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center bg-slate-800/90 hover:bg-yellow-400 text-white hover:text-slate-950 border border-slate-700 hover:border-yellow-400 shadow-xl transition-all duration-200 cursor-pointer active:scale-95 group/btn rounded-none"
                        aria-label="Next Guide"
                        title="Next Guide"
                    >
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Main Interactive Card */}
                    <div
                        className="border border-slate-700 bg-slate-800/80 backdrop-blur-md shadow-2xl relative select-none touch-pan-y overflow-hidden rounded-none"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Slide Content with Mobile Drag Translation & Fading */}
                        <div
                            className="grid md:grid-cols-12 min-h-0 md:min-h-[440px]"
                            style={{
                                transform: `translateX(${dragOffset}px)`,
                                opacity: isFading ? 0.35 : 1,
                                transition: isDragging
                                    ? 'none'
                                    : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease',
                            }}
                        >
                            {/* Guide Image */}
                            <div className="md:col-span-5 relative h-64 sm:h-72 md:h-auto md:min-h-full border-b md:border-b-0 md:border-r border-slate-700 overflow-hidden">
                                <img
                                    src={currentGuide.imageUrl}
                                    alt={currentGuide.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    style={{
                                        objectPosition:
                                            currentGuide.name === 'Kapil Rawat'
                                                ? '50% 20%'
                                                : currentGuide.name === 'Pritam Negi'
                                                ? '50% 12%'
                                                : '50% 20%',
                                    }}
                                />
                                <div className="absolute bottom-2.5 left-3 md:hidden">
                                    <span className="text-[10px] uppercase font-sans tracking-widest text-yellow-400 bg-slate-900/90 px-2.5 py-1 backdrop-blur-sm border border-slate-700 rounded-none font-semibold">
                                        {currentGuide.location.split('(')[0]}
                                    </span>
                                </div>
                            </div>

                            {/* Guide Info */}
                            <div className="md:col-span-7 p-4 sm:p-6 md:p-10 flex flex-col justify-between">
                                <div>
                                    <div className="hidden md:flex items-center gap-2 text-slate-300 text-xs font-sans mb-3">
                                        <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                                        <span>{currentGuide.location}</span>
                                    </div>

                                    <div className="flex items-baseline justify-between gap-2 mb-2 sm:mb-4">
                                        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-white">
                                            {currentGuide.name}
                                        </h3>
                                        <span className="text-[10px] font-sans text-yellow-400 uppercase tracking-widest md:hidden font-semibold">
                                            0{currentIndex + 1}/0{foundingGuides.length}
                                        </span>
                                    </div>

                                    <div className="border-l-2 border-yellow-400 pl-3.5 sm:pl-5 py-1 my-2 sm:my-4">
                                        <p className="font-display text-base sm:text-lg md:text-xl italic text-slate-100 leading-snug">
                                            "{currentGuide.quote}"
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mt-2.5 sm:mt-4">
                                        {currentGuide.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] sm:text-xs px-2.5 py-0.5 border border-slate-700 text-slate-300 bg-slate-900/50 font-sans rounded-none"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Carousel Controls with filling progress bars */}
                                <div className="pt-3.5 sm:pt-6 mt-3 sm:mt-6 border-t border-slate-700/80 flex items-center justify-between gap-3">
                                    {/* Progress bars + Click to Pause */}
                                    <div className="flex items-center gap-2">
                                        {foundingGuides.map((guide, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => switchSlide(idx)}
                                                className="group/track relative h-1.5 rounded-none bg-slate-700 cursor-pointer overflow-hidden transition-all"
                                                style={{
                                                    width: currentIndex === idx ? '40px' : '18px',
                                                }}
                                                aria-label={`View ${guide.name}`}
                                                title={`Switch to ${guide.name}`}
                                            >
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-yellow-400 transition-all rounded-none"
                                                    style={{
                                                        width:
                                                            currentIndex === idx
                                                                ? `${progress}%`
                                                                : idx < currentIndex
                                                                ? '100%'
                                                                : '0%',
                                                    }}
                                                />
                                            </button>
                                        ))}

                                        {/* Click to Pause / Play toggle */}
                                        <button
                                            type="button"
                                            onClick={togglePause}
                                            className="ml-2 text-[10px] font-sans uppercase tracking-wider text-slate-400 hover:text-yellow-400 transition-colors cursor-pointer"
                                            title={isPaused ? "Resume auto-cycle" : "Pause auto-cycle"}
                                        >
                                            {isPaused ? '▶ Resume' : '❚❚ Pause'}
                                        </button>
                                    </div>

                                    {/* Mobile/Tablet Navigation Arrows */}
                                    <div className="flex items-center gap-1.5 lg:hidden">
                                        <button
                                            type="button"
                                            onClick={goToPrevious}
                                            className="p-2 border border-slate-700 bg-slate-800 text-white hover:bg-yellow-400 hover:text-slate-950 hover:border-yellow-400 transition duration-150 cursor-pointer active:scale-95 rounded-none"
                                            aria-label="Previous Guide"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goToNext}
                                            className="p-2 border border-slate-700 bg-slate-800 text-white hover:bg-yellow-400 hover:text-slate-950 hover:border-yellow-400 transition duration-150 cursor-pointer active:scale-95 rounded-none"
                                            aria-label="Next Guide"
                                        >
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuideStoriesSection;
