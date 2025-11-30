import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Guide } from '../../../types';

const foundingGuides: Guide[] = [
    {
        name: 'Marco Rossi',
        location: 'Rome, Italy',
        specialty: 'Ancient Roman History',
        quote: 'I don\'t just show you ruins; I help you see the bustling city that once stood here. To me, every stone tells a story.',
        tags: ['History', 'Architecture', 'Storytelling'],
        imageUrl: 'https://picsum.photos/seed/guide1/800/600',
    },
    {
        name: 'Amélie Dubois',
        location: 'Paris, France',
        specialty: 'Le Marais Culinary Scene',
        quote: 'The best way to understand Paris is through its food. I love revealing the hidden bakeries and markets only locals know.',
        tags: ['Foodie', 'Culture', 'Local Life'],
        imageUrl: 'https://picsum.photos/seed/guide2/800/600',
    },
    {
        name: 'Kenji Tanaka',
        location: 'Kyoto, Japan',
        specialty: 'Zen Gardens & Philosophy',
        quote: 'Guiding is my meditation. I help travelers find the quiet beauty and deep philosophy hidden in Kyoto\'s incredible gardens.',
        tags: ['Zen', 'Nature', 'Photography'],
        imageUrl: 'https://picsum.photos/seed/guide3/800/600',
    },
    {
        name: 'Sofia Reyes',
        location: 'Mexico City, Mexico',
        specialty: 'Street Art & Murals',
        quote: 'Every mural has a voice and a history. I help you listen to the vibrant, colorful stories painted on the walls of my city.',
        tags: ['Art', 'Street Art', 'Urban'],
        imageUrl: 'https://picsum.photos/seed/guide4/800/600',
    },
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

    // Auto-advance slides
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            goToNext();
        }, 4000);
        return () => {
            clearInterval(timer);
        };
    }, [isPaused, currentIndex, goToNext]);

    // Touch handlers for mobile swipe
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
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    const getCardStyle = (index: number) => {
        const total = foundingGuides.length;
        const prevIndex = (currentIndex - 1 + total) % total;
        const nextIndex = (currentIndex + 1) % total;

        let styles = 'absolute top-0 w-full max-w-xs sm:max-w-md transform transition-all duration-500 ease-out';

        if (index === currentIndex) {
            // Active card - centered and full scale
            styles += ' scale-100 opacity-100 z-20 left-1/2 -translate-x-1/2';
        } else if (index === prevIndex) {
            // Previous card - left side, smaller and faded
            styles += ' scale-90 opacity-60 z-10 left-1/2 -translate-x-[120%] sm:-translate-x-[140%]';
        } else if (index === nextIndex) {
            // Next card - right side, smaller and faded
            styles += ' scale-90 opacity-60 z-10 left-1/2 translate-x-[20%] sm:translate-x-[40%]';
        } else {
            // Hidden cards
            styles += ' scale-75 opacity-0 z-0 left-1/2 -translate-x-1/2';
        }

        return styles;
    };

    return (
        <section
            className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop)'
            }}
            id="stories"
        >
            {/* Background overlay to match other sections */}
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative container mx-auto text-center px-4 mb-8 sm:mb-12">
                <span className="inline-block bg-sky-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                    Real Local Experts
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
                    Stories From Our Founding <span className="text-yellow-400">Guides</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                    Meet some of the passionate storytellers, historians, and artists ready to make your next trip unforgettable.
                </p>
            </div>

            <div
                className="relative h-[500px] sm:h-[530px]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    {foundingGuides.map((guide, index) => (
                        <div key={index} className={getCardStyle(index)}>
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[450px] flex flex-col mx-4">
                                <div className="relative h-56">
                                    <img
                                        src={guide.imageUrl}
                                        alt={guide.name}
                                        className="absolute h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                                        <h3 className="text-white text-lg sm:text-xl font-bold">{guide.specialty}</h3>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                                    <p className="text-sm font-semibold text-blue-600">{guide.name} - {guide.location}</p>
                                    <p className="text-gray-600 my-4 italic text-sm leading-relaxed">"{guide.quote}"</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {guide.tags.map(tag => (
                                            <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                    <button className="font-semibold text-blue-700 hover:underline text-sm mt-auto text-left">
                                        View Profile &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons - Hidden on mobile, visible on larger screens */}
                <button
                    onClick={goToPrevious}
                    className="hidden sm:flex absolute left-4 md:left-16 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition items-center justify-center"
                    aria-label="Previous Guide"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>
                <button
                    onClick={goToNext}
                    className="hidden sm:flex absolute right-4 md:right-16 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition items-center justify-center"
                    aria-label="Next Guide"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>
            </div>

            {/* Much Smaller Dots for Mobile */}
            <div className="relative flex justify-center items-center space-x-1 sm:space-x-1.5 mt-6">
                {foundingGuides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{ minWidth: 0, minHeight: 0 }}
                        className={`rounded-full transition-all duration-300 flex-shrink-0 p-0 !min-w-0 !min-h-0 ${currentIndex === index
                            ? 'bg-yellow-400 !w-[10px] !h-[10px] sm:!w-[12px] sm:!h-[12px] md:!w-[14px] md:!h-[14px]'
                            : 'bg-white/50 !w-[8px] !h-[8px] sm:!w-[10px] sm:!h-[10px] md:!w-[12px] md:!h-[12px] hover:bg-white/70'
                            }`}
                        aria-label={`Go to guide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default GuideStoriesSection;