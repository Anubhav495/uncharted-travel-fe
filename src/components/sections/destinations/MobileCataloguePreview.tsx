import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Search, TrendingUp } from 'lucide-react';
import { treks } from '@/data/treks';
import { Trek } from '@/types/trek';
import { MobileCatalogueView } from './mobileCatalogueView';

interface MobileCataloguePreviewProps {
    view: MobileCatalogueView;
}

const difficultyStyles: Record<Trek['difficulty'], string> = {
    Easy: 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/25',
    Moderate: 'bg-amber-400/15 text-amber-300 ring-amber-400/25',
    Hard: 'bg-orange-400/15 text-orange-300 ring-orange-400/25',
    Expert: 'bg-red-400/15 text-red-300 ring-red-400/25',
};

const TrekCountHeader: React.FC<{ eyebrow: string; title: string; count?: number }> = ({
    eyebrow,
    title,
    count = treks.length,
}) => (
    <header className="mb-6 flex items-end justify-between gap-4">
        <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">{eyebrow}</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">{title}</h2>
        </div>
        <p className="shrink-0 pb-1 text-sm text-slate-400">
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
                eyebrow="Compare at a glance"
                title="Choose your trail"
                count={filteredTreks.length}
            />
            <label className="relative mb-5 block">
                <span className="sr-only">Search treks</span>
                <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by trail, difficulty, or feature"
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-800/60 py-3 pl-12 pr-4 text-base text-white outline-none transition-colors placeholder:text-slate-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
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
                                        className="group grid min-h-[168px] grid-cols-[35%_1fr] overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 shadow-lg shadow-black/10 transition-colors hover:border-yellow-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                                        aria-label={`View ${trek.title}`}
                                    >
                                        <div className="relative min-h-full overflow-hidden">
                                            <Image
                                                src={trek.image}
                                                alt=""
                                                fill
                                                sizes="38vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/30" />
                                        </div>
                                        <div className="flex min-w-0 flex-col p-3">
                                            <p className="flex items-center gap-1.5 truncate text-xs font-medium text-yellow-400">
                                                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                                <span className="truncate">{trek.location}</span>
                                            </p>
                                            <h3 className="mt-1 text-base font-bold leading-tight text-white">{trek.title}</h3>
                                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-300">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                                                    {trek.duration}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <TrendingUp className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                                                    {trek.difficulty}
                                                </span>
                                            </div>
                                            <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">From</p>
                                                    <p className="text-base font-bold text-white">{trek.price}</p>
                                                </div>
                                                <span className="flex min-h-11 items-center gap-1 rounded-xl bg-yellow-400 px-3 text-xs font-bold text-slate-950">
                                                    View trek
                                                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between" aria-live="polite">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Swipe to browse</p>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5" aria-hidden="true">
                                {trekPages.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${index === activePage ? 'w-5 bg-yellow-400' : 'w-1.5 bg-slate-600'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm tabular-nums text-slate-400">
                                <span className="font-bold text-white">{activePage + 1}</span> / {trekPages.length}
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-slate-800/40 px-6 py-12 text-center" role="status">
                    <p className="font-bold text-white">No matching treks</p>
                    <p className="mt-2 text-sm text-slate-400">Try a trail name, difficulty, or feature.</p>
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

    const goToCard = (index: number) => {
        const container = scrollRef.current;
        const card = container?.children[index] as HTMLElement | undefined;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        card?.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'nearest',
            inline: 'start',
        });
    };

    return (
        <div>
            <TrekCountHeader eyebrow="Travel through the view" title="Explore the Himalayas" />
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
                        className="group relative min-h-[520px] w-[88vw] max-w-[390px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-white/10 bg-slate-800/50 shadow-2xl shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                        aria-label={`View ${trek.title}`}
                    >
                        <Image
                            src={trek.image}
                            alt=""
                            fill
                            sizes="88vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/10" />
                        <div className="absolute left-5 top-5 flex max-w-[calc(100%-2.5rem)] flex-wrap gap-2">
                            {trek.badges.slice(0, 2).map((badge) => (
                                <span key={badge} className="rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                    {badge}
                                </span>
                            ))}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-6">
                            <p className="flex items-center gap-2 text-sm font-medium text-yellow-400">
                                <MapPin className="h-4 w-4" aria-hidden="true" />
                                {trek.location}
                            </p>
                            <h3 className="mt-2 text-3xl font-bold leading-tight text-white">{trek.title}</h3>
                            <div className="mt-5 grid grid-cols-2 gap-3 border-y border-white/15 py-4 text-sm text-slate-200">
                                <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                                    {trek.duration}
                                </span>
                                <span className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                                    {trek.difficulty}
                                </span>
                            </div>
                            <div className="mt-5 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Starting from</p>
                                    <p className="text-2xl font-bold text-white">{trek.price}</p>
                                </div>
                                <span className="flex min-h-11 items-center gap-2 rounded-xl bg-yellow-400 px-4 text-sm font-bold text-slate-950">
                                    View trek
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="mt-2 flex items-center justify-between" aria-live="polite">
                <p className="text-sm tabular-nums text-slate-400">
                    <span className="font-bold text-white">{String(activeIndex + 1).padStart(2, '0')}</span>
                    {' / '}
                    {String(treks.length).padStart(2, '0')}
                </p>
                <div className="flex items-center gap-1" aria-label="Choose a trek slide">
                    {treks.map((trek, index) => (
                        <button
                            key={trek.id}
                            type="button"
                            onClick={() => goToCard(index)}
                            className="flex h-11 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                            aria-label={`Go to ${trek.title}`}
                            aria-current={index === activeIndex ? 'true' : undefined}
                        >
                            <span className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${index === activeIndex ? 'w-6 bg-yellow-400' : 'w-1.5 bg-slate-600'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ConvertCatalogue: React.FC = () => (
    <div>
        <TrekCountHeader eyebrow="Pick a route" title="Treks worth taking" />
        <div className="grid grid-cols-2 gap-3">
            {treks.map((trek) => (
                <Link
                    key={trek.id}
                    href={`/destinations/${trek.slug}`}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 transition-colors hover:border-yellow-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    aria-label={`View ${trek.title}`}
                >
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                            src={trek.image}
                            alt=""
                            fill
                            sizes="50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                        <span className={`absolute bottom-2 left-2 rounded-full px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${difficultyStyles[trek.difficulty]}`}>
                            {trek.difficulty}
                        </span>
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                        <p className="truncate text-[11px] font-medium text-yellow-400">{trek.location}</p>
                        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight text-white">{trek.title}</h3>
                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {trek.duration}
                        </p>
                        <div className="mt-auto pt-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">From</p>
                            <p className="text-lg font-bold text-white">{trek.price}</p>
                            <span className="mt-3 flex min-h-11 w-full items-center justify-center gap-1 rounded-xl bg-yellow-400 text-xs font-bold text-slate-950">
                                View trek
                                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
        <section className="min-h-screen overflow-hidden bg-slate-900 px-5 pb-16 pt-8 md:hidden">
            <div className="mx-auto max-w-md">
                {view === 'compare' && <CompareCatalogue />}
                {view === 'immerse' && <ImmerseCatalogue />}
                {view === 'convert' && <ConvertCatalogue />}
            </div>
        </section>
    );
};

export default MobileCataloguePreview;
