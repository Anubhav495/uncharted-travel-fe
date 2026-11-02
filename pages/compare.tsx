import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock, Info, Link2, Loader2, MapPin, Mountain, Plus, TrendingUp, X } from 'lucide-react';
import TrekImage from '@/components/ui/TrekImage';
import { NextSeo } from 'next-seo';
import { ExtractedPackageData, PackageDetail, PackageFieldSource } from '@/lib/competitors/types';
import { treks } from '@/data/treks';
import { Trek } from '@/types/trek';

const sourceLabels: Record<PackageFieldSource, string> = {
    extracted: 'Extracted',
    local: 'Uncharted',
    manual: 'Check',
    not_found: 'Missing',
};

function extractPriceNumber(price: string | null): number | null {
    if (!price) return null;

    const parsed = Number(price.replace(/[^0-9]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
}

function toUnchartedPackage(trek: Trek): ExtractedPackageData {
    const importantDetails: PackageDetail[] = [
        { label: 'Location', value: trek.location, source: 'local' },
        { label: 'Difficulty', value: trek.difficulty, source: 'local' },
        { label: 'Primary guide', value: trek.guideName, source: 'local' },
        { label: 'Batch size', value: 'Confirm with the selected guide or company before booking.', source: 'manual' },
        { label: 'Transport', value: 'Confirm pickup, drop, and transfer cost before booking.', source: 'manual' },
        { label: 'Taxes and fees', value: 'Confirm final payable amount before booking.', source: 'manual' },
        { label: 'Cancellation policy', value: 'Confirm cancellation or reschedule terms before booking.', source: 'manual' },
    ];

    return {
        providerName: 'Uncharted Travel',
        sourceUrl: `/destinations/${trek.slug}`,
        packageName: trek.title,
        price: trek.price,
        durationDays: trek.duration,
        difficulty: trek.difficulty,
        location: trek.location,
        batchSize: 'Confirm before booking',
        inclusions: [
            `Local guide: ${trek.guideName}`,
            ...trek.highlights?.slice(0, 4) || [],
        ],
        exclusions: [
            'Transport, taxes, rentals, offloading, and cancellation terms should be confirmed before payment.',
        ],
        safetyGear: [],
        itinerary: trek.itinerary?.map((day) => ({
            day: day.day,
            title: day.title,
            description: day.description,
            elevation: day.elevation,
            distance: day.distance,
            meals: day.meals,
        })) || [],
        importantDetails,
        fieldSources: {
            packageName: 'local',
            price: 'local',
            durationDays: 'local',
            difficulty: 'local',
            location: 'local',
            batchSize: 'manual',
            inclusions: 'local',
            exclusions: 'manual',
            safetyGear: 'not_found',
            itinerary: trek.itinerary?.length ? 'local' : 'not_found',
            importantDetails: 'local',
        },
        extractionWarnings: [
            'Uncharted details come from local trek content. Confirm operational terms before booking.',
        ],
        extractedAt: new Date().toISOString(),
    };
}

function renderSourceBadge(source?: PackageFieldSource) {
    if (!source) return null;

    const className = {
        extracted: 'border-emerald-400/25 bg-emerald-400/5 text-emerald-300',
        local: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400',
        manual: 'border-amber-400/25 bg-amber-400/5 text-amber-300',
        not_found: 'border-slate-600 bg-slate-800/60 text-slate-400',
    }[source];

    return (
        <span className={`inline-flex shrink-0 border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${className}`}>
            {sourceLabels[source]}
        </span>
    );
}

function renderList(items: string[]) {
    if (items.length === 0) {
        return <span className="text-xs text-slate-400">Not found on source</span>;
    }

    return (
        <ul className="space-y-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
            {items.map((item, index) => (
                <li key={`${index}-${item}`} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-slate-500" aria-hidden="true" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function renderItinerary(pkg: ExtractedPackageData) {
    if (pkg.itinerary.length === 0) {
        return <p className="text-xs leading-relaxed text-slate-400">Itinerary not found clearly on this package.</p>;
    }

    return (
        <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-medium text-slate-200 transition-colors hover:text-yellow-400 [&::-webkit-details-marker]:hidden">
                <span>View itinerary · {pkg.itinerary.length} days listed</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ol className="mt-5 space-y-5 border-l border-slate-700 pl-4">
                {pkg.itinerary.slice(0, 5).map((day, index) => (
                    <li key={`${day.day || index}-${day.title}`} className="relative">
                        <span className="absolute -left-[19px] top-1 h-[5px] w-[5px] bg-yellow-400" aria-hidden="true" />
                        <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-yellow-400">Day {day.day || index + 1}</p>
                        <p className="text-sm font-medium text-white">{day.title}</p>
                        {day.description && <p className="mt-2 text-xs leading-relaxed text-slate-400">{day.description}</p>}
                        <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                            {day.distance && <p>Distance: {day.distance}</p>}
                            {day.elevation && <p>Altitude: {day.elevation}</p>}
                            {day.meals && <p>Meals: {day.meals}</p>}
                        </div>
                    </li>
                ))}
                {pkg.itinerary.length > 5 && (
                    <li className="text-xs text-slate-400">+ {pkg.itinerary.length - 5} more days on the source itinerary</li>
                )}
            </ol>
        </details>
    );
}

function renderDetails(details: PackageDetail[]) {
    if (details.length === 0) {
        return <span className="text-xs text-slate-400">No extra details found</span>;
    }

    return (
        <dl className="space-y-4">
            {details.map((detail) => (
                <div key={`${detail.label}-${detail.value}`}>
                    <dt className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {detail.label}
                        {renderSourceBadge(detail.source)}
                    </dt>
                    <dd className="mt-1.5 text-xs leading-relaxed text-slate-300">{detail.value}</dd>
                </div>
            ))}
        </dl>
    );
}

function renderSourceLink(pkg: ExtractedPackageData) {
    const className = 'inline-flex items-center gap-2 border-b border-yellow-400/30 pb-1 text-[10px] font-semibold uppercase tracking-widest text-yellow-400 transition-colors hover:border-yellow-400 hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400';

    if (pkg.sourceUrl.startsWith('/')) {
        return <Link href={pkg.sourceUrl} className={className}>Explore trek <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>;
    }

    return (
        <a href={pkg.sourceUrl} target="_blank" rel="noreferrer" className={className}>
            View original package <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
        </a>
    );
}

const comparisonRows: { label: string; render: (pkg: ExtractedPackageData) => React.ReactNode }[] = [
    {
        label: 'Listed price',
        render: (pkg) => <div className="flex flex-wrap items-center gap-2"><span className="text-xl font-medium text-white">{pkg.price || 'Not found'}</span>{renderSourceBadge(pkg.fieldSources.price)}</div>,
    },
    {
        label: 'Duration',
        render: (pkg) => <div className="flex flex-wrap items-center gap-2">{pkg.durationDays || 'Not found'}{renderSourceBadge(pkg.fieldSources.durationDays)}</div>,
    },
    {
        label: 'Location & difficulty',
        render: (pkg) => <div className="space-y-3"><div className="flex flex-wrap items-center gap-2">{pkg.location || 'Location not found'}{renderSourceBadge(pkg.fieldSources.location)}</div><div className="flex flex-wrap items-center gap-2">{pkg.difficulty || 'Difficulty not found'}{renderSourceBadge(pkg.fieldSources.difficulty)}</div></div>,
    },
    {
        label: 'Batch size',
        render: (pkg) => <div className="flex flex-wrap items-center gap-2">{pkg.batchSize || 'Not found'}{renderSourceBadge(pkg.fieldSources.batchSize)}</div>,
    },
    { label: 'Itinerary', render: renderItinerary },
    { label: 'Inclusions', render: (pkg) => renderList(pkg.inclusions) },
    { label: 'Exclusions & add-ons', render: (pkg) => renderList(pkg.exclusions) },
    { label: 'Safety gear', render: (pkg) => renderList(pkg.safetyGear) },
    { label: 'Important details', render: (pkg) => renderDetails(pkg.importantDetails) },
    { label: 'Data notes', render: (pkg) => renderList(pkg.extractionWarnings) },
    { label: 'Source', render: renderSourceLink },
];

const ComparePage = () => {
    const [urls, setUrls] = useState<string[]>(['']);
    const [selectedTrekSlug, setSelectedTrekSlug] = useState(treks[0]?.slug || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<ExtractedPackageData[]>([]);

    const selectedTrek = treks.find((trek) => trek.slug === selectedTrekSlug) || treks[0];
    const unchartedPackage = selectedTrek ? toUnchartedPackage(selectedTrek) : null;
    const comparisonResults = unchartedPackage ? [unchartedPackage, ...results] : results;
    const packagesWithPrices = comparisonResults
        .map((pkg) => ({ pkg, price: extractPriceNumber(pkg.price) }))
        .filter((item): item is { pkg: ExtractedPackageData; price: number } => item.price !== null);
    const cheapestPackage = packagesWithPrices.sort((a, b) => a.price - b.price)[0]?.pkg || null;
    const packagesMissingItinerary = comparisonResults.filter((pkg) => pkg.itinerary.length === 0).map((pkg) => pkg.providerName);

    const handleAddUrl = () => {
        if (urls.length < 3) {
            setUrls([...urls, '']);
        }
    };

    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const handleRemoveUrl = (index: number) => {
        setUrls(urls.filter((_, currentIndex) => currentIndex !== index));
    };

    const handleCompare = async () => {
        setError(null);
        setResults([]);

        const validUrls = urls.map((url) => url.trim()).filter(Boolean);
        if (validUrls.length === 0) {
            setError('Add at least one competitor URL to compare against the selected Uncharted trek.');
            return;
        }

        setLoading(true);

        try {
            const settledResults = await Promise.allSettled(
                validUrls.map(async (url) => {
                    const response = await fetch('/api/extractPackage', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url }),
                    });

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        throw new Error(errData.error || `Failed to extract ${url}`);
                    }

                    return response.json() as Promise<ExtractedPackageData>;
                }),
            );

            const successfulResults = settledResults
                .filter((result): result is PromiseFulfilledResult<ExtractedPackageData> => result.status === 'fulfilled')
                .map((result) => result.value);
            const failedResults = settledResults.filter((result) => result.status === 'rejected');

            setResults(successfulResults);

            if (failedResults.length > 0) {
                setError(`${failedResults.length} link${failedResults.length > 1 ? 's' : ''} could not be extracted. Showing available results.`);
            }

            if (successfulResults.length === 0) {
                setError('No competitor links could be extracted. Check the URL and supported provider.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to compare packages');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NextSeo
                title="Compare Treks | Uncharted Travel"
                description="Find your trail. Compare trek packages, itineraries, and the details that matter before you book."
                noindex={true}
            />

            <main className="min-h-screen border-b border-slate-800 bg-slate-900 font-sans text-white">
                <section className="relative isolate overflow-hidden border-b border-slate-800 pb-24 pt-28 sm:pb-28 sm:pt-36">
                    <div className="absolute inset-0 -z-10" aria-hidden="true">
                        <Image
                            src="/assets/images/treks/hampta-pass/snow-valley.jpg"
                            alt=""
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover object-[center_45%] opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/75 to-slate-900/10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40" />
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-400">
                            <Link href="/destinations" className="transition-colors hover:text-white">Destinations</Link>
                            <span aria-hidden="true">/</span>
                            <span className="text-slate-200">Compare treks</span>
                        </nav>
                        <div className="max-w-2xl">
                            <p className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-yellow-400">
                                <span className="h-px w-7 bg-yellow-400" aria-hidden="true" /> Find your kind of adventure
                            </p>
                            <h1 className="font-display text-5xl font-normal leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
                                Same mountains.<br /><span className="italic text-yellow-400">Different journeys.</span>
                            </h1>
                            <p className="mt-6 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
                                A great trek is in the details. Compare routes, prices, and what comes with each package to find the journey that feels right for you.
                            </p>
                        </div>
                        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[10px] uppercase tracking-widest text-slate-300 sm:gap-x-8">
                            <span className="flex items-center gap-2"><Mountain className="h-3.5 w-3.5 text-yellow-400" aria-hidden="true" /> Your chosen trail</span>
                            <span className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5 text-yellow-400" aria-hidden="true" /> Up to 3 packages</span>
                            <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-400" aria-hidden="true" /> One clearer picture</span>
                        </div>
                    </div>
                </section>

                <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <form
                        onSubmit={(event) => { event.preventDefault(); void handleCompare(); }}
                        className="grid border border-slate-700 bg-slate-900 shadow-2xl lg:grid-cols-[0.9fr_1.1fr]"
                        aria-label="Set up your trek comparison"
                    >
                        <div className="min-w-0 border-b border-slate-700 p-5 sm:p-8 lg:border-b-0 lg:border-r">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-yellow-400/30 bg-yellow-400/5 text-[11px] text-yellow-400">01</span>
                                <div>
                                    <h2 className="font-display text-2xl sm:text-3xl">Choose your trail</h2>
                                    <p className="mt-1 text-xs text-slate-400">Start with an Uncharted adventure.</p>
                                </div>
                            </div>
                            <label htmlFor="uncharted-trek" className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-slate-400">Uncharted trek</label>
                            <div className="relative">
                                <select
                                    id="uncharted-trek"
                                    value={selectedTrekSlug}
                                    onChange={(event) => setSelectedTrekSlug(event.target.value)}
                                    disabled={loading}
                                    className="w-full appearance-none border border-slate-600 bg-slate-800 py-3.5 pl-4 pr-10 text-sm text-white outline-none transition-colors focus:border-yellow-400 disabled:opacity-60"
                                >
                                    {treks.map((trek) => <option key={trek.slug} value={trek.slug}>{trek.title}</option>)}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-400" aria-hidden="true" />
                            </div>
                            {selectedTrek && (
                                <div className="mt-5">
                                    <div className="relative h-44 overflow-hidden bg-slate-800 sm:h-48">
                                        <TrekImage src={selectedTrek.image} alt={selectedTrek.title} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" style={{ objectPosition: selectedTrek.imagePosition || 'center' }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/10 to-transparent" aria-hidden="true" />
                                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
                                            <div className="min-w-0">
                                                <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-yellow-400">Uncharted Travel</p>
                                                <p className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-200"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />{selectedTrek.location}</p>
                                            </div>
                                            <div className="shrink-0 text-right"><p className="text-[10px] text-slate-300">Starting from</p><p className="mt-1 text-lg font-medium">{selectedTrek.price}</p></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-700 py-3.5 text-xs text-slate-300">
                                        <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />{selectedTrek.duration}</span>
                                        <span className="flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />{selectedTrek.difficulty}</span>
                                        <Link href={`/destinations/${selectedTrek.slug}`} className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-yellow-400 hover:text-yellow-300">View trek <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex min-w-0 flex-col p-5 sm:p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-yellow-400/30 bg-yellow-400/5 text-[11px] text-yellow-400">02</span>
                                <div><h2 className="font-display text-2xl sm:text-3xl">Bring the other options</h2><p className="mt-1 text-xs text-slate-400">Paste package links for the same trek.</p></div>
                            </div>
                            <p id="provider-help" className="mb-5 text-xs leading-relaxed text-slate-400">Currently supporting <span className="text-slate-200">Indiahikes</span> &amp; <span className="text-slate-200">Trek The Himalayas</span>.</p>
                            <div className="space-y-4">
                                {urls.map((url, index) => (
                                    <div key={index}>
                                        <label htmlFor={`package-url-${index}`} className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-slate-400">Package link {String(index + 1).padStart(2, '0')}</label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative min-w-0 flex-1">
                                                <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                                                <input
                                                    id={`package-url-${index}`}
                                                    type="url"
                                                    placeholder="https://indiahikes.com/your-trek"
                                                    value={url}
                                                    onChange={(event) => handleUrlChange(index, event.target.value)}
                                                    disabled={loading}
                                                    aria-describedby="provider-help"
                                                    className="w-full border border-slate-600 bg-slate-800/60 py-3.5 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-yellow-400 disabled:opacity-60"
                                                />
                                            </div>
                                            {urls.length > 1 && <button type="button" onClick={() => handleRemoveUrl(index)} disabled={loading} aria-label={`Remove package link ${index + 1}`} className="flex h-12 w-10 shrink-0 items-center justify-center border border-slate-700 text-slate-400 transition-colors hover:border-rose-400/50 hover:text-rose-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 disabled:opacity-50"><X className="h-4 w-4" aria-hidden="true" /></button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {urls.length < 3 && (
                                <button type="button" onClick={handleAddUrl} disabled={loading} className="mt-4 inline-flex items-center gap-2 self-start py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300 transition-colors hover:text-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 disabled:opacity-50"><Plus className="h-3.5 w-3.5" aria-hidden="true" />Add another package<span className="font-normal text-slate-500">{urls.length}/3</span></button>
                            )}
                            <div className="mt-auto pt-6">
                                <button type="submit" disabled={loading} aria-busy={loading} className="flex w-full items-center justify-center gap-3 bg-yellow-400 px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-950 transition-colors hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 disabled:cursor-wait disabled:opacity-70">
                                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Reading packages...</> : <>Compare packages<ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
                                </button>
                                <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400" role="status">{loading ? 'Gathering the details. This may take a moment.' : 'Compare the journey, then choose your own path.'}</p>
                            </div>
                            {error && <div role="alert" className="mt-4 flex items-start gap-2.5 border border-amber-400/25 bg-amber-400/5 p-3 text-xs leading-relaxed text-amber-200"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</div>}
                        </div>
                    </form>

                    <section aria-labelledby="comparison-heading" className="mt-14 sm:mt-20" aria-busy={loading}>
                        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-400">The bigger picture</p>
                                <h2 id="comparison-heading" className="font-display text-3xl font-normal tracking-tight sm:text-5xl">The details, <span className="italic text-slate-400">side by side.</span></h2>
                                <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">Go beyond the price tag. See what each journey has to offer.</p>
                            </div>
                            {results.length > 0 && <span className="self-start border border-slate-700 bg-slate-800/50 px-3 py-2 text-[10px] uppercase tracking-widest text-slate-300">{comparisonResults.length} packages compared</span>}
                        </div>

                        {results.length === 0 ? (
                            <div className="flex flex-col items-center border border-dashed border-slate-600 bg-slate-800/20 px-6 py-12 text-center sm:py-16">
                                <div className="mb-6 flex items-center gap-4 text-slate-500" aria-hidden="true"><Mountain className="h-9 w-9 text-yellow-400/80" strokeWidth={1} /><span className="h-px w-10 bg-slate-600" /><Link2 className="h-7 w-7" strokeWidth={1} /></div>
                                <h3 className="font-display text-2xl sm:text-3xl">{loading ? 'Finding the details that matter.' : 'Your next adventure deserves a closer look.'}</h3>
                                <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">{loading ? 'We’re reading your package links. Your comparison will appear here.' : 'Choose a trail and add a package link above. We’ll bring the itinerary, inclusions, and finer details together here.'}</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 grid gap-px border border-slate-700 bg-slate-700 sm:grid-cols-3">
                                    <div className="bg-slate-900 p-5 sm:p-6"><p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Lowest visible price</p><p className="mt-3 font-display text-2xl text-white">{cheapestPackage?.providerName || 'Price unavailable'}</p><p className="mt-1 text-sm text-yellow-400">{cheapestPackage?.price || 'Not found on source'}</p></div>
                                    <div className="bg-slate-900 p-5 sm:p-6"><p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Itinerary visibility</p><p className="mt-3 font-display text-2xl">{comparisonResults.length - packagesMissingItinerary.length} of {comparisonResults.length} packages</p><p className="mt-1 text-xs leading-relaxed text-slate-400">{packagesMissingItinerary.length > 0 ? `Details missing for ${packagesMissingItinerary.join(', ')}.` : 'Every package has an itinerary to explore.'}</p></div>
                                    <div className="bg-slate-900 p-5 sm:p-6"><p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Before you book</p><p className="mt-3 font-display text-2xl">Look at the whole journey.</p><p className="mt-1 text-xs leading-relaxed text-slate-400">Check transport, GST, insurance, rentals, and cancellation terms.</p></div>
                                </div>
                                <p id="comparison-scroll-help" className="mb-3 flex items-center gap-2 text-[10px] text-slate-400"><ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />Scroll across to explore every package. Open itinerary rows for the day-by-day route.</p>
                                <div role="region" aria-label="Trek package comparison" aria-describedby="comparison-scroll-help" tabIndex={0} className="overflow-x-auto border border-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400">
                                    <table className="w-full border-separate border-spacing-0 text-left text-xs text-slate-300 sm:text-sm">
                                        <caption className="sr-only">Selected Uncharted trek compared with competitor packages</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col" className="sticky left-0 z-20 min-w-[112px] border-b border-r border-slate-700 bg-slate-900 p-4 align-bottom text-[9px] font-semibold uppercase tracking-widest text-slate-400 sm:min-w-[176px] sm:p-5">The details</th>
                                                {comparisonResults.map((pkg, index) => (
                                                    <th scope="col" key={`${index}-${pkg.sourceUrl}`} className={`min-w-[240px] border-b border-r border-t-2 border-b-slate-700 border-r-slate-700 p-5 align-top last:border-r-0 sm:min-w-[280px] sm:p-6 ${pkg.providerName === 'Uncharted Travel' ? 'border-t-yellow-400 bg-yellow-400/5' : 'border-t-slate-600 bg-slate-800/50'}`}>
                                                        <p className={`text-[9px] font-semibold uppercase tracking-widest ${pkg.providerName === 'Uncharted Travel' ? 'text-yellow-400' : 'text-slate-400'}`}>{pkg.providerName === 'Uncharted Travel' ? 'Your selected trek' : 'Provider package'}</p>
                                                        <p className="mt-3 font-display text-2xl font-normal text-white">{pkg.providerName}</p>
                                                        <p className="mt-2 text-xs font-normal leading-relaxed text-slate-400">{pkg.packageName || 'Package name not found'}</p>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comparisonRows.map((row) => (
                                                <tr key={row.label}>
                                                    <th scope="row" className="sticky left-0 z-10 border-b border-r border-slate-700 bg-slate-900 p-4 align-top text-[10px] font-medium leading-relaxed text-slate-400 sm:p-5 sm:text-xs">{row.label}</th>
                                                    {comparisonResults.map((pkg, index) => (
                                                        <td key={`${index}-${pkg.sourceUrl}`} className={`border-b border-r border-slate-700/70 p-5 align-top leading-relaxed last:border-r-0 sm:p-6 ${pkg.providerName === 'Uncharted Travel' ? 'bg-yellow-400/[0.025]' : 'bg-slate-800/20'}`}>{row.render(pkg)}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] text-slate-400">
                                    <span className="uppercase tracking-widest">Reading the details</span>
                                    <span className="flex items-center gap-2">{renderSourceBadge('local')} Our trek content</span>
                                    <span className="flex items-center gap-2">{renderSourceBadge('extracted')} Found on provider page</span>
                                    <span className="flex items-center gap-2">{renderSourceBadge('manual')} Confirm before booking</span>
                                    <span className="flex items-center gap-2">{renderSourceBadge('not_found')} Not found on source</span>
                                </div>
                            </>
                        )}
                        <p className="mt-6 flex max-w-3xl items-start gap-2 text-[11px] leading-relaxed text-slate-400"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />Listed prices may exclude extras. Package details can change; confirm the final price and arrangements with your provider before booking.</p>
                    </section>
                </div>
            </main>
        </>
    );
};

export default ComparePage;
