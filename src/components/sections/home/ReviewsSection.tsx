import React, { useState, useCallback, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Review } from '../../../types';

const customerReviews: Review[] = [
    {
        name: 'Emily Carter',
        avatarUrl: 'https://picsum.photos/seed/avatar1/100/100',
        rating: 5,
        tour: 'Tour with Marco in Rome',
        quote: 'Marco made the Colosseum come alive! It wasn\'t just a tour; it was like stepping back in time. Absolutely unforgettable.'
    },
    {
        name: 'James O\'Connell',
        avatarUrl: 'https://picsum.photos/seed/avatar2/100/100',
        rating: 5,
        tour: 'Food tour with Amélie',
        quote: 'Amélie showed us the hidden food gems in Le Marais. The best croissant I have ever had in my life. A must-do in Paris!'
    },
    {
        name: 'Priya Sharma',
        avatarUrl: 'https://picsum.photos/seed/avatar3/100/100',
        rating: 5,
        tour: 'Kyoto Zen Gardens',
        quote: 'Kenji\'s calm presence and deep knowledge of Zen philosophy provided a truly peaceful and enlightening experience. Highly recommended.'
    },
    {
        name: 'Sarah Johnson',
        avatarUrl: 'https://picsum.photos/seed/avatar4/100/100',
        rating: 5,
        tour: 'Barcelona Architecture Walk',
        quote: 'The hidden architectural gems we discovered were incredible. Our guide\'s passion for Gaudí\'s work was infectious and inspiring.'
    },
    {
        name: 'Michael Chen',
        avatarUrl: 'https://picsum.photos/seed/avatar5/100/100',
        rating: 5,
        tour: 'Tokyo Street Food Adventure',
        quote: 'From tiny ramen shops to bustling markets, every bite told a story. This was the authentic Tokyo experience I was hoping for.'
    }
];

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg h-[280px] sm:h-[300px] flex flex-col">
        <div className="flex items-center mb-4">
            <img
                src={review.avatarUrl}
                alt={review.name}
                className="w-12 h-12 rounded-full mr-4 object-cover"
                loading="lazy"
            />
            <div>
                <p className="font-bold text-gray-800 text-sm sm:text-base">{review.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">{review.tour}</p>
            </div>
        </div>

        <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                />
            ))}
        </div>

        <p className="text-gray-600 italic text-sm sm:text-base leading-relaxed flex-grow">
            "{review.quote}"
        </p>
    </div>
);

const ReviewsSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const goToPrevious = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? customerReviews.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === customerReviews.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    // Auto-advance slides (slower than guides section)
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            goToNext();
        }, 5000); // 5 seconds for reviews
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
        const total = customerReviews.length;
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
            className="relative py-16 sm:py-20 md:py-24 bg-cover bg-center bg-fixed overflow-hidden"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop)'
            }}
            id="reviews"
        >
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative container mx-auto px-4 text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
                    <span className="text-yellow-400">Hear</span> From Our Travelers
                </h2>

                <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                    Real stories from travelers who discovered the heart of a city with our guides.
                </p>
            </div>

            <div
                className="relative h-[350px] sm:h-[380px]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    {customerReviews.map((review, index) => (
                        <div key={index} className={getCardStyle(index)}>
                            <div className="mx-4">
                                <ReviewCard review={review} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons - Hidden on mobile, visible on larger screens */}
                <button
                    onClick={goToPrevious}
                    className="hidden sm:flex absolute left-4 md:left-16 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition items-center justify-center"
                    aria-label="Previous Review"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>
                <button
                    onClick={goToNext}
                    className="hidden sm:flex absolute right-4 md:right-16 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition items-center justify-center"
                    aria-label="Next Review"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>
            </div>

            {/* Much Smaller Dots for Mobile */}
            <div className="relative flex justify-center items-center space-x-1 sm:space-x-1.5 mt-6">
                {customerReviews.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`rounded-full transition-all duration-300 ${currentIndex === index
                                ? 'bg-yellow-400 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3'
                                : 'bg-white/50 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 hover:bg-white/70'
                            }`}
                        aria-label={`Go to review ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default ReviewsSection;