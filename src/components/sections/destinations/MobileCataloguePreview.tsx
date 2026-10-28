import React, { useRef, useState } from 'react';
import TrekImage from '@/components/ui/TrekImage';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Search, TrendingUp } from 'lucide-react';
import { treks } from '@/data/treks';
import { Trek } from '@/types/trek';
import { MobileCatalogueView } from './mobileCatalogueView';

interface MobileCataloguePreviewProps {
    view: MobileCatalogueView;
}

const difficultyStyles: Record<Trek['difficulty'], string> = {
    Easy: 'bg-white/10 text-white/90 border-white/20',
    Moderate: 'bg-white/10 text-white/90 border-white/20',
    Hard: 'bg-white/10 text-white/90 border-white/20',
    Expert: 'bg-white/10 text-white/90 border-white/20',
};

const TrekCountHeader: React.FC<{ eyebrow?: string; title: string; count?: number }> = ({
    title,
    count = treks.length,
}) => (
    <header className="mb-6 flex items-end justify-between gap-4">
        <div>
            <h2 className="font-display text-3xl font-normal text-white">{title}</h2>
        </div>
        <p className="shrink-0 pb-1 text-xs font-sans text-white/50">
            {count} {count === 1 ? 'trek' : 'treks'}
        </p>
    </header>
);

const TREKS_PER_PAGE = 3;
const CompareCatalogue: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activePage, setActivePage] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredTreks = normalizedQuery
        ? treks.filter((trek) => [
            trek.title,
            trek.difficulty,
            trek.duration,
            ...trek.badges,
        ].some((value) => value.toLowerCase().includes(normalizedQuery)))
        : treks;
    const trekPages = Array.from(
        { length: Math.ceil(filteredTreks.length / TREKS_PER_PAGE) },
        (_, index) => filteredTreks.slice(index * TREKS_PER_PAGE, (index + 1) * TREKS_PER_PAGE),
    );

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setActivePage(0);
        scrollRef.current?.scrollTo?.({ left: 0, behavior: 'auto' });
    };

    const updateActivePage = () => {
        const container = scrollRef.current;
        if (!container) return;

        const pages = Array.from(container.children) as HTMLElement[];
        const nearestPage = pages.reduce((nearest, page, index) => {
            const nearestDistance = Math.abs(pages[nearest].offsetLeft - container.scrollLeft);
            const distance = Math.abs(page.offsetLeft - container.scrollLeft);
            return distance < nearestDistance ? index : nearest;
        }, 0);

        setActivePage(nearestPage);
    };

    return (
        <div>
            <TrekCountHeader
                title="Choose your trail"
                count={filteredTreks.length}
            />
            <label className="relative mb-6 block">
                <span className="sr-only">Search treks</span>
                <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by trail, difficulty, or region"
                    className="w-full border border-slate-700 bg-slate-800/80 py-3 pl-11 pr-4 text-xs font-sans text-white outline-none transition-colors placeholder:text-slate-400 focus:border-yellow-400"
                />
            </label>
            {filteredTreks.length > 0 ? (
                <>
                    <div
                        ref={scrollRef}
                        onScroll={updateActivePage}
                        className="scrollbar-hide -mx-5 flex snap-x snap-mandatory overflow-x-scroll overscroll-x-contain [-webkit-overflow-scrolling:touch]"
                        role="region"
                        aria-label="Trek pages"
                    >
                        {trekPages.map((page, pageIndex) => (
                            <div
                                key={pageIndex}
                                className="min-w-full flex-none snap-start snap-always space-y-3 px-5"
                                role="group"
                                aria-label={`Trek page ${pageIndex + 1} of ${trekPages.length}`}
                            >
                                {page.map((trek) => (
                                    <Link
                                        key={trek.id}
                                        href={`/destinations/${trek.slug}`}
                                        className="group grid min-h-[160px] grid-cols-[38%_1fr] overflow-hidden border border-slate-700 bg-slate-800/80 transition-colors hover:border-yellow-400/50"
                                        aria-label={`View ${trek.title}`}
                                    >
                                        <div className="relative min-h-full overflow-hidden">
                                            <TrekImage
                                                src={trek.image}
                                                alt=""
                                                fill
                                                sizes="38vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-slate-900/30 pointer-events-none" />
                                        </div>
                                        <div className="flex min-w-0 flex-col p-3.5 justify-between">
                                            <div>
                                                <p className="flex items-center gap-1.5 truncate text-xs font-sans text-slate-400 mb-1">
                                                    <MapPin className="h-3 w-3 shrink-0 text-yellow-400" aria-hidden="true" />
                                                    <span className="truncate">{trek.location}</span>
                                                </p>
                                                <h3 className="font-display text-xl font-normal leading-tight text-white mb-2 group-hover:text-yellow-400 transition-colors">{trek.title}</h3>
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-300 font-sans">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3 text-slate-400" aria-hidden="true" />
                                                        {trek.duration}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp className="h-3 w-3 text-slate-400" aria-hidden="true" />
                                                        {trek.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-end justify-between gap-2 pt-2 border-t border-slate-700/60">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-sans">From</p>
                                                    <p className="text-sm font-sans font-medium text-white">{trek.price}</p>
                                                </div>
                                                <span className="flex items-center gap-1 bg-yellow-400 text-slate-950 px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider">
                                                    View
                                                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between" aria-live="polite">
                        <p className="text-xs uppercase tracking-wider text-white/40 font-sans">Swipe to browse</p>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5" aria-hidden="true">
                                {trekPages.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`h-1 transition-all ${index === activePage ? 'w-5 bg-white' : 'w-1.5 bg-white/20'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-white/40 font-sans">
                                <span className="text-white font-medium">{activePage + 1}</span> / {trekPages.length}
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="border border-white/10 bg-white/[0.02] px-6 py-12 text-center" role="status">
                    <p className="text-sm text-white font-sans">No matching treks</p>
                    <p className="mt-1 text-xs text-white/40 font-sans">Try searching by trail name, difficulty, or region.</p>
                </div>
            )}
        </div>
    );
};

const ImmerseCatalogue: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const updateActiveCard = () => {
        const container = scrollRef.current;
        if (!container) return;

        const cards = Array.from(container.children) as HTMLElement[];
        const nearestIndex = cards.reduce((nearest, card, index) => {
            const nearestDistance = Math.abs(cards[nearest].offsetLeft - container.scrollLeft);
            const distance = Math.abs(card.offsetLeft - container.scrollLeft);
            return distance < nearestDistance ? index : nearest;
        }, 0);

        setActiveIndex(nearestIndex);
    };

    return (
        <div>
            <TrekCountHeader title="Explore the Himalayas" />
            <div
                ref={scrollRef}
                onScroll={updateActiveCard}
                className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4"
                role="region"
                aria-label="Trek carousel"
            >
                {treks.map((trek) => (
                    <Link
                        key={trek.id}
                        href={`/destinations/${trek.slug}`}
                        className="group relative min-h-[500px] w-[88vw] max-w-[390px] shrink-0 snap-start overflow-hidden border border-slate-700 bg-slate-800/80 shadow-2xl"
                        aria-label={`View ${trek.title}`}
                    >
                        <TrekImage
                            src={trek.image}
                            alt=""
                            fill
                            sizes="88vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />
                        <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap gap-1.5">
                            {trek.badges.slice(0, 2).map((badge) => (
                                <span key={badge} className="bg-slate-900/90 border border-yellow-400/30 px-2.5 py-0.5 text-xs uppercase tracking-wider text-yellow-400 backdrop-blur-md font-sans font-semibold">
                                    {badge}
                                </span>
                            ))}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-6">
                            <p className="flex items-center gap-1.5 text-xs text-slate-300 font-sans mb-1">
                                <MapPin className="h-3.5 w-3.5 text-yellow-400" aria-hidden="true" />
                                {trek.location}
                            </p>
                            <h3 className="font-display text-3xl font-normal leading-tight text-white mb-4 group-hover:text-yellow-400 transition-colors">{trek.title}</h3>
                            <div className="grid grid-cols-2 gap-3 border-y border-slate-800 py-3 text-xs text-slate-300 font-sans mb-4">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                                    {trek.duration}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <TrendingUp className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                                    {trek.difficulty}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-sans">Starting from</p>
                                    <p className="text-xl font-medium text-white font-sans">{trek.price}</p>
                                </div>
                                <span className="flex items-center gap-1.5 bg-yellow-400 text-slate-950 px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-widest shadow-md shadow-yellow-400/10">
                                    View trek
                                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="mt-3 flex items-center justify-between" aria-live="polite">
                <p className="text-xs text-slate-400 font-sans">
                    <span className="text-white font-medium">{String(activeIndex + 1).padStart(2, '0')}</span>
                    {' / '}
                    {String(treks.length).padStart(2, '0')}
                </p>
            </div>
        </div>
    );
};

const ConvertCatalogue: React.FC = () => (
    <div>
        <TrekCountHeader title="Treks worth taking" />
        <div className="grid grid-cols-2 gap-3">
            {treks.map((trek) => (
                <Link
                    key={trek.id}
                    href={`/destinations/${trek.slug}`}
                    className="group flex min-w-0 flex-col overflow-hidden border border-slate-700 bg-slate-800/80 transition-colors hover:border-yellow-400/50"
                    aria-label={`View ${trek.title}`}
                >
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <TrekImage
                            src={trek.image}
                            alt=""
                            fill
                            sizes="50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-sans border bg-slate-900/90 border-yellow-400/30 text-yellow-400 font-semibold">
                            {trek.difficulty}
                        </span>
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                        <p className="truncate text-xs text-slate-400 font-sans">{trek.location}</p>
                        <h3 className="font-display mt-1 line-clamp-2 text-lg font-normal leading-tight text-white group-hover:text-yellow-400 transition-colors">{trek.title}</h3>
                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-400 font-sans">
                            <Clock className="h-3 w-3 text-slate-400" aria-hidden="true" />
                            {trek.duration}
                        </p>
                        <div className="mt-auto pt-3 border-t border-slate-700/60">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-sans">From</p>
                            <p className="text-base font-medium text-white font-sans">{trek.price}</p>
                            <span className="mt-2 flex w-full items-center justify-center gap-1 bg-yellow-400 text-slate-950 py-2 text-xs font-sans font-bold uppercase tracking-wider">
                                View trek
                                <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

const MobileCataloguePreview: React.FC<MobileCataloguePreviewProps> = ({ view }) => {
    return (
        <section className="min-h-screen overflow-hidden bg-slate-900 px-5 pb-16 pt-8 md:hidden text-white border-t border-slate-800">
            <div className="mx-auto max-w-md">
                {view === 'compare' && <CompareCatalogue />}
                {view === 'immerse' && <ImmerseCatalogue />}
                {view === 'convert' && <ConvertCatalogue />}
            </div>
        </section>
    );
};

export default MobileCataloguePreview;
