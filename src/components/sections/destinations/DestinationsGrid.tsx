import React, { useState } from 'react';
import { useRouter } from 'next/router';
import TrekCard from '@/components/ui/TrekCard';
import { treks } from '@/data/treks';
import MobileCataloguePreview from './MobileCataloguePreview';
import { MobileCatalogueView } from './mobileCatalogueView';

const categories = ['All'];

interface DestinationsGridProps {
    mobileView?: MobileCatalogueView;
}

const DestinationsGrid: React.FC<DestinationsGridProps> = ({ mobileView }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const router = useRouter();

    const filteredTreks = activeCategory === 'All'
        ? treks
        : treks.filter(trek => trek.category === activeCategory);

    const handleBook = (slug: string) => {
        router.push(`/destinations/${slug}`);
    };

    React.useEffect(() => {
        if (mobileView) return;
        if (typeof window === 'undefined') return;

        const checkMobileAndObserve = () => {
            if (window.innerWidth >= 768) {
                setActiveCardId(null);
                return;
            }

            const container = scrollContainerRef.current;
            if (!container) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute('data-id');
                            setActiveCardId(id);
                        }
                    });
                },
                {
                    root: container,
                    threshold: 0.7,
                }
            );

            const cards = container.querySelectorAll('.trek-card-wrapper');
            cards.forEach((card) => observer.observe(card));

            return () => observer.disconnect();
        };

        const cleanup = checkMobileAndObserve();

        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setActiveCardId(null);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (typeof cleanup === 'function') cleanup();
            window.removeEventListener('resize', handleResize);
        };
    }, [filteredTreks, mobileView]);

    return (
        <>
            {mobileView && <MobileCataloguePreview view={mobileView} />}
            <section className={`${mobileView ? 'hidden md:block' : ''} py-12 md:py-20 bg-black min-h-screen text-white border-t border-white/[0.08]`}>
                <div className="container mx-auto px-6 md:px-12">
                    {/* Filter Bar */}
                    <div className="relative mb-12 py-3 bg-transparent border-b border-white/[0.08]">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`
                                        px-5 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer border
                                        ${activeCategory === category
                                            ? 'bg-white text-black border-white font-medium'
                                            : 'bg-white/[0.03] text-white/60 hover:text-white border-white/10 hover:border-white/30'
                                        }
                                    `}
                                >
                                    {category} Expeditions
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Treks Grid */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:pb-0 md:mx-0 md:px-0 scrollbar-hide"
                    >
                        {filteredTreks.map((trek) => (
                            <div
                                key={trek.id}
                                data-id={trek.id}
                                className="trek-card-wrapper min-w-[85vw] snap-center md:min-w-0"
                            >
                                <TrekCard
                                    trek={trek}
                                    isActive={trek.id === activeCardId}
                                    onBook={handleBook}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredTreks.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-white/50 text-sm font-sans">No treks found in this catalogue category.</p>
                            <button
                                onClick={() => setActiveCategory('All')}
                                className="mt-4 text-xs font-mono uppercase tracking-wider text-white hover:underline"
                            >
                                View all treks
                            </button>
                        </div>
                    )}

                    {/* Coming Soon Note */}
                    <div className="mt-20 text-center border-t border-white/[0.08] pt-12">
                        <p className="text-white/40 font-display text-xl sm:text-2xl italic">
                            More untamed Himalayan ridges currently undergoing cartographic vetting...
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DestinationsGrid;
