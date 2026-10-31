import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const router = useRouter();

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredTreks = treks.filter((trek) => {
        const matchesCategory = activeCategory === 'All' || trek.category === activeCategory;
        const matchesSearch = !normalizedQuery || [
            trek.title,
            trek.location,
            trek.difficulty,
            trek.duration,
            ...trek.badges,
        ].some(val => val.toLowerCase().includes(normalizedQuery));
        return matchesCategory && matchesSearch;
    });

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
            <section className={`${mobileView ? 'hidden md:block' : ''} py-12 md:py-20 bg-slate-900 min-h-screen text-white border-t border-slate-800`}>
                <div className="container mx-auto px-6 md:px-12">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-slate-800">
                        {/* Search Input Box */}
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search treks by trail, region, or difficulty..."
                                className="w-full bg-slate-800/80 border border-slate-700 px-4 py-3 pl-11 text-xs font-sans text-white placeholder:text-slate-400 outline-none focus:border-yellow-400 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    aria-label="Clear search"
                                >
                                    &times;
                                </button>
                            )}
                        </div>

                        {/* Category Buttons */}
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`
                                        px-5 py-2.5 text-xs font-sans uppercase tracking-widest transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer border
                                        ${activeCategory === category
                                            ? 'bg-yellow-400 text-slate-950 border-yellow-400 font-bold'
                                            : 'bg-slate-800/60 text-slate-300 hover:text-white border-slate-700 hover:border-slate-500'
                                        }
                                    `}
                                >
                                    {category === 'All' ? 'All Treks' : `${category} Treks`}
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
                            <p className="text-slate-400 text-sm font-sans">No treks found matching "{searchQuery}".</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveCategory('All');
                                }}
                                className="mt-4 text-xs font-sans uppercase tracking-wider text-yellow-400 hover:underline cursor-pointer"
                            >
                                View all treks
                            </button>
                        </div>
                    )}

                    {/* Coming Soon Note */}
                    <div className="mt-20 text-center border-t border-slate-800 pt-12">
                        <p className="text-slate-400 font-display text-xl sm:text-2xl italic">
                            More Himalayan destinations coming soon.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DestinationsGrid;
