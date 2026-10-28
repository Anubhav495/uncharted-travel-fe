import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface GuideStory {
    name: string;
    location: string;
    specialty: string;
    quote: string;
    tags: string[];
    imageUrl: string;
}

const foundingGuides: GuideStory[] = [
    {
        name: 'Aatish',
        location: 'Dharamshala, Himachal',
        specialty: 'Alpine Glacial Terrains',
        quote: 'I grew up in the shadow of the Dhauladhar. Guiding is not commerce; it is an initiation into ancient glacial lakes and silence.',
        tags: ['Glacial Traverse', 'Alpine Lakes', 'High Passes'],
        imageUrl: '/assets/aatish-photo.jpeg',
    },
    {
        name: 'Pritam Negi',
        location: 'Parvati Valley, Himachal',
        specialty: 'Sacred Forest Trails & Lore',
        quote: 'Every ridge in Parvati Valley holds a myth. I guide wanderers toward sacred hot springs while sharing the oral histories of Lord Shiva.',
        tags: ['Cultural History', 'Forest Expeditions', 'Mountain Lore'],
        imageUrl: '/assets/pritam-photo-edited.png',
    },
    {
        name: 'Kapil Rawat',
        location: 'Sankri, Uttarakhand',
        specialty: 'High-Altitude Winter Alpinism',
        quote: 'The peaks do not yield to human pride; we adapt to their rhythm. I teach mountaineers to navigate snowfields with reverence and resolve.',
        tags: ['Mountaineering', 'Snow Treks', 'First Response'],
        imageUrl: '/assets/kapil-rawat.jpeg',
    }
];

const GuideStoriesSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const goToPrevious = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? foundingGuides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === foundingGuides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            goToNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused, currentIndex, goToNext]);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) {
            goToNext();
        } else if (distance < -minSwipeDistance) {
            goToPrevious();
        }
    };

    const currentGuide = foundingGuides[currentIndex];

    return (
        <section
            className="border-t border-white/[0.08] px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-black relative text-white overflow-hidden"
            id="stories"
        >
            {/* Ambient topo background pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-15">
                <div className="h-full w-full bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-white/45 mb-3 font-sans font-medium">
                            Field Masters &middot; Native Archive
                        </p>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                            Chronicles from our <span className="italic text-white/90">Native Guides.</span>
                        </h2>
                    </div>
                    <p className="text-sm text-white/55 max-w-sm font-sans leading-relaxed">
                        Born on the ridgelines. Built for deep winter crossings. These are not commercial tour operators — they are custodians of the trails.
                    </p>
                </div>

                {/* Editorial Master Feature Card */}
                <div
                    className="border border-white/15 bg-neutral-950/80 backdrop-blur-md shadow-2xl relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="grid md:grid-cols-12 min-h-[500px]">
                        {/* Guide Image with Editorial Filter */}
                        <div className="md:col-span-5 relative min-h-[350px] md:min-h-full border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
                            <img
                                src={currentGuide.imageUrl}
                                alt={currentGuide.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                style={{
                                    objectPosition:
                                        currentGuide.name === 'Kapil Rawat'
                                            ? '50% 30%'
                                            : currentGuide.name === 'Pritam Negi'
                                            ? '50% 10%'
                                            : '50% 60%',
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent md:hidden" />
                            <div className="absolute top-4 left-4 z-10">
                                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-black/75 border border-white/20 text-white/90 font-mono backdrop-blur-md">
                                    Native Master 0{currentIndex + 1}
                                </span>
                            </div>
                        </div>

                        {/* Guide Bio & Quote */}
                        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                                    <div className="flex items-center gap-2 text-white/60 text-xs font-mono uppercase tracking-wider">
                                        <MapPin className="w-3.5 h-3.5 text-white/40" />
                                        <span>{currentGuide.location}</span>
                                    </div>
                                    <span className="text-xs px-2.5 py-1 border border-white/15 text-white/70 bg-white/[0.03] font-sans">
                                        {currentGuide.specialty}
                                    </span>
                                </div>

                                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-6">
                                    {currentGuide.name}
                                </h3>

                                <div className="border-l border-white/20 pl-6 py-2 my-6">
                                    <p className="font-display text-xl sm:text-2xl italic text-white/85 leading-relaxed">
                                        "{currentGuide.quote}"
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-6">
                                    {currentGuide.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs px-2.5 py-1 border border-white/[0.08] text-white/50 bg-black/40 font-mono uppercase tracking-wider"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Control Bar */}
                            <div className="mt-12 pt-6 border-t border-white/[0.08] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {foundingGuides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`h-1.5 transition-all duration-300 ${
                                                currentIndex === idx
                                                    ? 'w-8 bg-white'
                                                    : 'w-2 bg-white/30 hover:bg-white/50'
                                            }`}
                                            aria-label={`Guide ${idx + 1}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goToPrevious}
                                        className="h-10 w-10 border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition duration-150"
                                        aria-label="Previous guide"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="h-10 w-10 border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition duration-150"
                                        aria-label="Next guide"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
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
