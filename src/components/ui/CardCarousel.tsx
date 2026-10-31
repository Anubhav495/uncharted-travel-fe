import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface CarouselItem {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface CardCarouselProps {
    items: CarouselItem[];
    label: string;
    interval: number;
    cardWidth?: 'standard' | 'wide';
}

const CardCarousel: React.FC<CardCarouselProps> = ({ items, label, interval, cardWidth = 'standard' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isTouching, setIsTouching] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const touchStart = useRef<{ x: number; y: number } | null>(null);
    const canRotate = items.length > 1;
    const isRotating = canRotate && !isPaused && !isHovered && !isFocused && !isTouching && !reducedMotion;

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updateMotion = () => setReducedMotion(media.matches);
        updateMotion();
        media.addEventListener('change', updateMotion);
        return () => media.removeEventListener('change', updateMotion);
    }, []);

    useEffect(() => {
        if (!isRotating) return;
        const timer = window.setTimeout(() => {
            setCurrentIndex(index => (index + 1) % items.length);
        }, interval);
        return () => window.clearTimeout(timer);
    }, [currentIndex, interval, isRotating, items.length]);

    const goToPrevious = () => setCurrentIndex(index => (index - 1 + items.length) % items.length);
    const goToNext = () => setCurrentIndex(index => (index + 1) % items.length);

    const endTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        const start = touchStart.current;
        const end = event.changedTouches[0];
        if (start && end) {
            const distanceX = start.x - end.clientX;
            const distanceY = start.y - end.clientY;
            if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > Math.abs(distanceY)) {
                if (distanceX > 0) goToNext();
                else goToPrevious();
            }
        }
        touchStart.current = null;
        setIsTouching(false);
    };

    const arrowClass = 'flex h-11 w-11 shrink-0 items-center justify-center border border-slate-700 bg-slate-800/90 text-white shadow-xl transition-colors hover:border-yellow-400 hover:bg-yellow-400 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400';

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label={label}
            tabIndex={0}
            className="relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocusCapture={() => setIsFocused(true)}
            onBlurCapture={event => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocused(false);
            }}
            onKeyDown={event => {
                if (event.target !== event.currentTarget || !canRotate) return;
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    goToPrevious();
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    goToNext();
                }
            }}
        >
            <div
                className="grid items-stretch justify-items-center overflow-hidden py-4 touch-pan-y"
                aria-live={isRotating ? 'off' : 'polite'}
                onTouchStart={event => {
                    const touch = event.targetTouches[0];
                    touchStart.current = { x: touch.clientX, y: touch.clientY };
                    setIsTouching(true);
                }}
                onTouchEnd={endTouch}
                onTouchCancel={() => {
                    touchStart.current = null;
                    setIsTouching(false);
                }}
            >
                {items.map((item, index) => {
                    const isActive = index === currentIndex;
                    const isPrevious = index === (currentIndex - 1 + items.length) % items.length;
                    const isNext = index === (currentIndex + 1) % items.length;
                    const previousPosition = cardWidth === 'wide'
                        ? '-translate-x-[85%]'
                        : '-translate-x-[85%] sm:-translate-x-[110%]';
                    const nextPosition = cardWidth === 'wide'
                        ? 'translate-x-[85%]'
                        : 'translate-x-[85%] sm:translate-x-[110%]';
                    const position = isActive
                        ? 'translate-x-0 scale-100 opacity-100 z-20'
                        : isPrevious
                            ? `${previousPosition} scale-90 opacity-50 z-10`
                            : isNext
                                ? `${nextPosition} scale-90 opacity-50 z-10`
                                : 'scale-75 opacity-0 pointer-events-none';
                    const width = cardWidth === 'wide' ? 'w-[82%] sm:w-[86%] md:w-[76%] max-w-4xl' : 'w-[82%] max-w-md';

                    return (
                        <div
                            key={item.id}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} of ${items.length}: ${item.label}`}
                            aria-hidden={!isActive}
                            className={`relative col-start-1 row-start-1 flex min-w-0 transition-all duration-500 ease-out motion-reduce:transition-none ${width} ${position}`}
                        >
                            {item.content}
                        </div>
                    );
                })}
            </div>

            {canRotate && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                    <button type="button" onClick={goToPrevious} className={arrowClass} aria-label="Previous slide">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-1">
                        {items.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`View ${item.label}`}
                                aria-current={index === currentIndex ? 'true' : undefined}
                                className="flex h-11 w-8 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
                            >
                                <span className={`h-1.5 transition-all duration-300 ${index === currentIndex ? 'w-7 bg-yellow-400' : 'w-3 bg-slate-500'}`} />
                            </button>
                        ))}
                    </div>
                    <button type="button" onClick={goToNext} className={arrowClass} aria-label="Next slide">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    {!reducedMotion && (
                        <button
                            type="button"
                            onClick={() => setIsPaused(paused => !paused)}
                            className={arrowClass}
                            aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
                        >
                            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CardCarousel;
