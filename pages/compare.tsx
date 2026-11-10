import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock, Info, Link2, Loader2, MapPin, Mountain, RotateCcw, TrendingUp } from 'lucide-react';
import TrekImage from '@/components/ui/TrekImage';
import ComparisonItinerary from '@/components/compare/ComparisonItinerary';
import PackageFeatureList from '@/components/compare/PackageFeatureList';
import ProviderSupportRequest from '@/components/compare/ProviderSupportRequest';
import CopyComparisonLink from '@/components/compare/CopyComparisonLink';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { ExtractedPackageData, FieldMetadata, PackageDetail, PackageFieldSource } from '@/lib/competitors/types';
import { toUnchartedPackage } from '@/lib/competitors/localPackage';
import { fieldMessage } from '@/lib/competitors/fields';
import { parsePackageResult } from '@/lib/competitors/validation';
import { checkPackageIdentity } from '@/lib/competitors/identity';
import { treks } from '@/data/treks';
import { getProviderPackageUrl, SUPPORTED_PROVIDERS, type SupportedProviderId } from '@/lib/competitors/catalog';
import { buildComparisonPath, readComparisonSelection, type ComparisonSelection } from '@/lib/competitors/comparisonLink';

const sourceLabels: Record<PackageFieldSource, string> = {
    extracted: 'Extracted',
    local: 'Uncharted',
    manual: 'Check',
    not_found: 'Missing',
};

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

function renderFieldNotes(metadata?: FieldMetadata, empty = false, showStatus = true, showEvidence = true) {
    const showMessage = showStatus && (empty || (metadata && (metadata.status !== 'found' || metadata.completeness === 'partial')));
    return (
        <>
            {metadata?.variant && <p className="text-xs text-slate-400">Route shown: {metadata.variant}</p>}
            {showMessage && <p className="text-xs leading-relaxed text-slate-400">{fieldMessage(metadata)}</p>}
            {showEvidence && !!metadata?.evidence.length && (
                <details className="mt-2 text-xs text-slate-400">
                    <summary className="cursor-pointer">Source details</summary>
                    <ul className="mt-2 space-y-3">
                        {metadata.evidence.filter((item, index, items) => items.findIndex((other) => other.rawText === item.rawText && other.sourceUrl === item.sourceUrl) === index).map((item, index) => (
                            <li key={index}><a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-yellow-400 underline">{item.section}</a><blockquote className="mt-1">{item.rawText}</blockquote></li>
                        ))}
                    </ul>
                </details>
            )}
        </>
    );
}

function renderScalarField(pkg: ExtractedPackageData, key: string, value?: string | null) {
    return <div className="space-y-2"><div className="flex flex-wrap items-center gap-2">{value || fieldMessage(pkg.fieldMetadata?.[key])}{renderSourceBadge(pkg.fieldSources[key])}</div>{renderFieldNotes(pkg.fieldMetadata?.[key], false, !!value)}</div>;
}

function renderList(items: string[]) {
    if (items.length === 0) {
        return <p className="text-xs text-slate-400">No additional notes.</p>;
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
        return <div>{renderFieldNotes(pkg.fieldMetadata?.itinerary, true)}</div>;
    }

    return (
        <ComparisonItinerary days={pkg.itinerary}>
            {renderFieldNotes(pkg.fieldMetadata?.itinerary)}
        </ComparisonItinerary>
    );
}

function renderFeatures(pkg: ExtractedPackageData, key: 'inclusions' | 'exclusions' | 'safetyGear') {
    const metadata = pkg.fieldMetadata?.[key];
    if (!pkg[key].length) return <div>{renderFieldNotes(metadata, true)}</div>;
    return (
        <div className="space-y-3">
            {renderFieldNotes(metadata, false, true, false)}
            <PackageFeatureList items={pkg[key]} metadata={metadata} kind={key === 'safetyGear' ? 'safety' : key}>
                {renderFieldNotes(metadata, false, false)}
            </PackageFeatureList>
        </div>
    );
}

function renderDetails(details: PackageDetail[], metadata?: FieldMetadata) {
    if (details.length === 0) {
        return <div>{renderFieldNotes(metadata, true)}</div>;
    }

    return (
        <dl className="space-y-4">
            {details.map((detail) => (
                <div key={`${detail.label}-${detail.value}`}>
                    <dt className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {detail.label}
                        {renderSourceBadge(detail.source)}
                    </dt>
                    <dd className="mt-1.5 space-y-2 text-xs leading-relaxed text-slate-300"><p>{detail.value}</p>{renderFieldNotes(detail.metadata, false, detail.value !== fieldMessage(detail.metadata))}</dd>
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

function renderPackagePrice(pkg: ExtractedPackageData) {
    const details = pkg.priceDetails;
    const hasBreakdown = details?.amount !== null && !!details?.basePriceText;
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-medium text-white">{hasBreakdown ? details.basePriceText : pkg.price || 'Not found'}</span>
                {renderSourceBadge(pkg.fieldSources.price)}
            </div>
            {hasBreakdown && (
                <>
                    {details.route && <p className="text-xs text-slate-400">{details.route}</p>}
                    {(details.taxPercentage !== null || !!details.additionalCosts?.length) && (
                        <ul aria-label="Additional price details" className="space-y-2 text-xs leading-relaxed text-slate-300">
                            {details.taxPercentage !== null && <li>+ {details.taxPercentage}% GST</li>}
                            {details.additionalCosts?.map((cost) => (
                                <li key={cost.kind}>+ {cost.displayText}{cost.amount === null && <span className="ml-1 text-amber-300">(confirm amount)</span>}</li>
                            ))}
                        </ul>
                    )}
                </>
            )}
            {details?.breakdownWarning && <p className="text-xs leading-relaxed text-amber-300">{details.breakdownWarning}</p>}
        </div>
    );
}

const comparisonRows: { label: string; render: (pkg: ExtractedPackageData) => React.ReactNode }[] = [
    {
        label: 'Listed price',
        render: renderPackagePrice,
    },
    {
        label: 'Duration',
        render: (pkg) => renderScalarField(pkg, 'durationDays', pkg.durationDays),
    },
    {
        label: 'Location & difficulty',
        render: (pkg) => <div className="space-y-3">{renderScalarField(pkg, 'location', pkg.location)}{renderScalarField(pkg, 'difficulty', pkg.difficulty)}</div>,
    },
    {
        label: 'Batch size',
        render: (pkg) => renderScalarField(pkg, 'batchSize', pkg.batchSize),
    },
    { label: 'Itinerary', render: renderItinerary },
    { label: 'Inclusions', render: (pkg) => renderFeatures(pkg, 'inclusions') },
    { label: 'Exclusions & add-ons', render: (pkg) => renderFeatures(pkg, 'exclusions') },
    { label: 'Safety gear', render: (pkg) => renderFeatures(pkg, 'safetyGear') },
    { label: 'Important details', render: (pkg) => renderDetails(pkg.importantDetails, pkg.fieldMetadata?.importantDetails) },
    { label: 'Data notes', render: (pkg) => renderList(pkg.extractionWarnings) },
    { label: 'Source', render: renderSourceLink },
];

async function fetchProviderPackage(providerId: SupportedProviderId, trekSlug: string, signal: AbortSignal) {
    const response = await fetch('/api/extractPackage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, trekSlug }),
        signal,
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Unable to read this package. Please retry.');
    }
    const data = parsePackageResult(await response.json());
    data.identity = checkPackageIdentity(data, trekSlug);
    return data;
}

function sortProviders(packages: ExtractedPackageData[]) {
    return [...packages].sort((a, b) => SUPPORTED_PROVIDERS.findIndex((provider) => provider.name === a.providerName)
        - SUPPORTED_PROVIDERS.findIndex((provider) => provider.name === b.providerName));
}

const ComparePage = () => {
    const router = useRouter();
    const [selectedProviderIds, setSelectedProviderIds] = useState<SupportedProviderId[]>([]);
    const [selectedTrekSlug, setSelectedTrekSlug] = useState(treks[0]?.slug || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<ExtractedPackageData[]>([]);
    const [uncertainResults, setUncertainResults] = useState<ExtractedPackageData[]>([]);
    const [failedProviders, setFailedProviders] = useState<{ providerId: SupportedProviderId; providerName: string; reason: string }[]>([]);
    const [retryingProviderIds, setRetryingProviderIds] = useState<SupportedProviderId[]>([]);
    const request = useRef({ id: 0, controller: null as AbortController | null });
    const retryControllers = useRef(new Map<SupportedProviderId, AbortController>());
    const localUrlUpdates = useRef(new Map<string, symbol>());

    useEffect(() => {
        const activeRequest = request.current;
        const controllers = retryControllers.current;
        return () => {
            activeRequest.id += 1; activeRequest.controller?.abort();
            controllers.forEach((controller) => controller.abort());
        };
    }, []);
    const invalidateComparison = useCallback(() => {
        request.current.id += 1;
        request.current.controller?.abort();
        retryControllers.current.forEach((controller) => controller.abort());
        retryControllers.current.clear();
        setRetryingProviderIds([]);
        setResults([]); setUncertainResults([]); setFailedProviders([]); setError(null); setLoading(false);
    }, []);

    const selectedTrek = treks.find((trek) => trek.slug === selectedTrekSlug) || treks[0];
    const unchartedPackage = selectedTrek ? toUnchartedPackage(selectedTrek) : null;
    const comparisonResults = unchartedPackage ? [unchartedPackage, ...results] : results;

    const availableProviders = SUPPORTED_PROVIDERS.filter((provider) => getProviderPackageUrl(provider.id, selectedTrekSlug));
    const comparisonError = error || (failedProviders.length
        ? results.length || uncertainResults.length
            ? `${failedProviders.length} provider${failedProviders.length > 1 ? 's' : ''} could not be loaded. Showing available results.`
            : 'We could not load the selected providers. Please try again.'
        : null);

    const updateSelection = (selection: ComparisonSelection) => {
        invalidateComparison();
        setSelectedTrekSlug(selection.trekSlug);
        setSelectedProviderIds(selection.providerIds);
        const path = `${buildComparisonPath(selection)}${window.location.hash}`;
        const updateId = Symbol();
        localUrlUpdates.current.set(path, updateId);
        // Shallow replacement preserves scroll and avoids creating a history
        // entry or automatically fetching packages for every checkbox change.
        void router.replace(path, undefined, { shallow: true, scroll: false })
            .catch((failure) => {
                if (!failure?.cancelled) setError('We could not update the comparison link. Please try again.');
            })
            .finally(() => {
                if (localUrlUpdates.current.get(path) === updateId) localUrlUpdates.current.delete(path);
            });
    };

    const toggleProvider = (providerId: SupportedProviderId) => {
        updateSelection({ trekSlug: selectedTrekSlug, providerIds: selectedProviderIds.includes(providerId)
            ? selectedProviderIds.filter((id) => id !== providerId) : [...selectedProviderIds, providerId] });
    };

    const changeTrek = (trekSlug: string) => {
        updateSelection({ trekSlug, providerIds: selectedProviderIds.filter((id) => getProviderPackageUrl(id, trekSlug)) });
    };

    const handleCompare = useCallback(async ({ trekSlug, providerIds }: ComparisonSelection) => {
        invalidateComparison();
        const requestId = ++request.current.id;
        const controller = new AbortController();
        request.current.controller = controller;

        const providers = SUPPORTED_PROVIDERS.filter((provider) => providerIds.includes(provider.id) && getProviderPackageUrl(provider.id, trekSlug));
        if (providers.length === 0) {
            setError('Select at least one provider to compare with your Uncharted trek.');
            return;
        }

        setLoading(true);

        try {
            const settledResults = await Promise.allSettled(
                providers.map((provider) => fetchProviderPackage(provider.id, trekSlug, controller.signal)),
            );

            const successfulResults = settledResults
                .filter((result): result is PromiseFulfilledResult<ExtractedPackageData> => result.status === 'fulfilled')
                .map((result) => result.value);
            if (request.current.id !== requestId) return;
            setResults(successfulResults.filter((pkg) => pkg.identity?.status === 'matched'));
            setUncertainResults(successfulResults.filter((pkg) => pkg.identity?.status === 'uncertain'));
            setFailedProviders(settledResults.flatMap((result, index) => result.status === 'rejected'
                ? [{ providerId: providers[index].id, providerName: providers[index].name, reason: result.reason instanceof Error ? result.reason.message : 'Unable to read this package.' }] : []));
        } catch (err) {
            if (request.current.id !== requestId) return;
            setError(err instanceof Error ? err.message : 'Failed to compare packages');
        } finally {
            if (request.current.id === requestId) setLoading(false);
        }
    }, [invalidateComparison]);

    useEffect(() => {
        if (!router.isReady) return;
        const restoreSelection = (url: string) => {
            if (localUrlUpdates.current.has(url)) return;
            const parsedUrl = new URL(url, window.location.origin);
            if (parsedUrl.pathname !== '/compare') return;
            const selection = readComparisonSelection(parsedUrl.searchParams);
            setSelectedTrekSlug(selection.trekSlug);
            setSelectedProviderIds(selection.providerIds);
            if (selection.providerIds.length) void handleCompare(selection);
            else invalidateComparison();
        };
        restoreSelection(window.location.href);
        router.events.on('routeChangeComplete', restoreSelection);
        return () => { router.events.off('routeChangeComplete', restoreSelection); };
    }, [router.isReady, router.events, handleCompare, invalidateComparison]);

    const retryProvider = async (providerId: SupportedProviderId) => {
        if (loading || retryControllers.current.has(providerId) || !failedProviders.some((provider) => provider.providerId === providerId)) return;
        const requestId = request.current.id;
        const controller = new AbortController();
        retryControllers.current.set(providerId, controller);
        setRetryingProviderIds((current) => [...current, providerId]);
        try {
            const data = await fetchProviderPackage(providerId, selectedTrekSlug, controller.signal);
            if (request.current.id !== requestId) return;
            if (data.identity?.status === 'matched') setResults((current) => sortProviders([...current, data]));
            else setUncertainResults((current) => sortProviders([...current, data]));
            setFailedProviders((current) => current.filter((provider) => provider.providerId !== providerId));
        } catch (err) {
            if (request.current.id !== requestId) return;
            setFailedProviders((current) => current.map((provider) => provider.providerId === providerId
                ? { ...provider, reason: err instanceof Error ? err.message : 'Unable to read this package. Please retry.' } : provider));
        } finally {
            if (request.current.id === requestId) {
                retryControllers.current.delete(providerId);
                setRetryingProviderIds((current) => current.filter((id) => id !== providerId));
            }
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
                            <span className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5 text-yellow-400" aria-hidden="true" /> Choose your providers</span>
                            <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-400" aria-hidden="true" /> One clearer picture</span>
                        </div>
                    </div>
                </section>

                <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div
                        className="grid border border-slate-700 bg-slate-900 shadow-2xl lg:grid-cols-[0.9fr_1.1fr]"
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
                                    form="trek-comparison"
                                    value={selectedTrekSlug}
                                    onChange={(event) => changeTrek(event.target.value)}
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
                                            <div className="shrink-0 text-right"><p className="text-[10px] text-slate-300">Starting from</p><p className="mt-1 text-lg font-medium">{unchartedPackage?.price}</p></div>
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
                                <div><h2 className="font-display text-2xl sm:text-3xl">Choose your providers</h2><p className="mt-1 text-xs text-slate-400">Select who you’d like to compare with Uncharted.</p></div>
                            </div>
                            <form id="trek-comparison" onSubmit={(event) => { event.preventDefault(); void handleCompare({ trekSlug: selectedTrekSlug, providerIds: selectedProviderIds }); }} aria-label="Set up your trek comparison">
                                <fieldset aria-describedby="provider-help" className="space-y-3">
                                    <legend className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Supported providers</legend>
                                    {SUPPORTED_PROVIDERS.map((provider) => {
                                        const available = !!getProviderPackageUrl(provider.id, selectedTrekSlug);
                                        const selected = available && selectedProviderIds.includes(provider.id);
                                        return (
                                            <label key={provider.id} className={`flex items-start gap-4 border p-4 transition-colors ${!available ? 'cursor-not-allowed border-slate-700/60 opacity-50' : selected ? 'cursor-pointer border-yellow-400/60 bg-yellow-400/5' : 'cursor-pointer border-slate-600 bg-slate-800/30 hover:border-slate-400'}`}>
                                                <input type="checkbox" checked={selected} onChange={() => toggleProvider(provider.id)} disabled={loading || !available} aria-label={provider.name} className="mt-1 h-4 w-4 shrink-0 accent-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400" />
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-600 bg-slate-900 text-[11px] font-semibold text-slate-300" aria-hidden="true">{provider.initials}</span>
                                                <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-white">{provider.name}</span><span className="mt-1 block break-all text-[11px] text-slate-500">{provider.domain}</span><span className="mt-2 block text-[11px] text-slate-400">{available ? 'Available for this trek' : 'Comparison not available for this trek yet'}</span></span>
                                            </label>
                                        );
                                    })}
                                </fieldset>
                                <p id="provider-help" className="mt-4 text-xs leading-relaxed text-slate-400">{availableProviders.length ? 'We’ll find each provider’s package for your selected trek. No links needed.' : 'Provider comparisons for this trek are coming soon. You can request another provider below.'}</p>
                            </form>
                            <ProviderSupportRequest trekSlug={selectedTrekSlug} providerIds={selectedProviderIds} />
                            <div className="mt-auto pt-6">
                                <button type="submit" form="trek-comparison" disabled={loading || availableProviders.length === 0} aria-busy={loading} className="flex w-full items-center justify-center gap-3 bg-yellow-400 px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-950 transition-colors hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 disabled:cursor-not-allowed disabled:opacity-70">
                                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Reading packages...</> : <>Compare packages<ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
                                </button>
                                <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400" role="status">{loading ? 'Gathering the details. This may take a moment.' : 'Compare the journey, then choose your own path.'}</p>
                            </div>
                            {comparisonError && <div role="alert" className="mt-4 flex items-start gap-2.5 border border-amber-400/25 bg-amber-400/5 p-3 text-xs leading-relaxed text-amber-200"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{comparisonError}</div>}
                            {failedProviders.length > 0 && (
                                <ul aria-label="Provider failures" className="mt-3 space-y-3 text-xs text-amber-200">
                                    {failedProviders.map((failure) => (
                                        <li key={failure.providerId} className="flex flex-wrap items-start justify-between gap-3 border border-amber-400/20 p-3">
                                            <p className="min-w-0 flex-1 leading-relaxed"><span className="font-medium">{failure.providerName}</span>: {failure.reason}</p>
                                            <button type="button" aria-label={`Retry ${failure.providerName}`} disabled={retryingProviderIds.includes(failure.providerId)} onClick={() => void retryProvider(failure.providerId)} className="inline-flex shrink-0 items-center gap-2 border border-amber-400/40 px-3 py-2 font-semibold text-amber-200 transition-colors hover:bg-amber-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 disabled:cursor-wait disabled:opacity-50">
                                                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Retry
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {uncertainResults.map((pkg) => (
                                <div key={pkg.sourceUrl} className="mt-4 space-y-3 border border-amber-400/25 p-4 text-xs text-amber-200">
                                    <p>{pkg.providerName}: {pkg.packageName}. {pkg.identity?.reason || 'The trek name or route variant needs confirmation before comparison.'}</p>
                                    <a href={pkg.sourceUrl} target="_blank" rel="noreferrer" className="mr-4 underline">Review original package</a>
                                    <button type="button" onClick={() => { setResults((current) => sortProviders([...current, pkg])); setUncertainResults((current) => current.filter((item) => item !== pkg)); }} className="border border-amber-400/40 px-3 py-2">Confirm and include {pkg.providerName}</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <section aria-labelledby="comparison-heading" className="mt-14 sm:mt-20" aria-busy={loading}>
                        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-400">The bigger picture</p>
                                <h2 id="comparison-heading" className="font-display text-3xl font-normal tracking-tight sm:text-5xl">The details, <span className="italic text-slate-400">side by side.</span></h2>
                                <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">Go beyond the price tag. See what each journey has to offer.</p>
                            </div>
                            <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
                                {results.length > 0 && <span className="border border-slate-700 bg-slate-800/50 px-3 py-2 text-[10px] uppercase tracking-widest text-slate-300">{comparisonResults.length} packages compared</span>}
                                <CopyComparisonLink trekSlug={selectedTrekSlug} providerIds={selectedProviderIds} />
                            </div>
                        </div>

                        {results.length === 0 ? (
                            <div className="flex flex-col items-center border border-dashed border-slate-600 bg-slate-800/20 px-6 py-12 text-center sm:py-16">
                                <div className="mb-6 flex items-center gap-4 text-slate-500" aria-hidden="true"><Mountain className="h-9 w-9 text-yellow-400/80" strokeWidth={1} /><span className="h-px w-10 bg-slate-600" /><Link2 className="h-7 w-7" strokeWidth={1} /></div>
                                <h3 className="font-display text-2xl sm:text-3xl">{loading ? 'Finding the details that matter.' : 'Your next adventure deserves a closer look.'}</h3>
                                <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">{loading ? 'We’re reading the selected providers’ packages. Your comparison will appear here.' : 'Choose a trail and select providers above. We’ll bring the itinerary, inclusions, and finer details together here.'}</p>
                            </div>
                        ) : (
                            <>
                                <p id="comparison-scroll-help" className="mb-3 flex items-center gap-2 text-[10px] text-slate-400"><ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />Scroll across to explore every package. Open itinerary rows for the day-by-day route.</p>
                                <div role="region" aria-label="Trek package comparison" aria-describedby="comparison-scroll-help" tabIndex={0} className="overflow-x-auto border border-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400">
                                    <table className="w-full border-separate border-spacing-0 text-left text-xs text-slate-300 sm:text-sm">
                                        <caption className="sr-only">Selected Uncharted trek compared with competitor packages</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col" className="sticky left-0 z-20 min-w-[112px] border-b border-r border-slate-700 bg-slate-900 p-4 align-bottom text-[9px] font-semibold uppercase tracking-widest text-slate-400 sm:min-w-[176px] sm:p-5">The details</th>
                                                {comparisonResults.map((pkg) => (
                                                    <th scope="col" key={pkg.sourceUrl} className={`min-w-[240px] border-b border-r border-t-2 border-b-slate-700 border-r-slate-700 p-5 align-top last:border-r-0 sm:min-w-[280px] sm:p-6 ${pkg.providerName === 'Uncharted Travel' ? 'border-t-yellow-400 bg-yellow-400/5' : 'border-t-slate-600 bg-slate-800/50'}`}>
                                                        <p className={`text-[9px] font-semibold uppercase tracking-widest ${pkg.providerName === 'Uncharted Travel' ? 'text-yellow-400' : 'text-slate-400'}`}>{pkg.providerName === 'Uncharted Travel' ? 'Your selected trek' : 'Provider package'}</p>
                                                        <p className="mt-3 font-display text-2xl font-normal text-white">{pkg.providerName}</p>
                                                        <p className="mt-2 text-xs font-normal leading-relaxed text-slate-400">{pkg.packageName || 'Package name not found'}</p>
                                                        {pkg.providerName !== 'Uncharted Travel' && Number.isFinite(Date.parse(pkg.extractedAt)) && <p className="mt-3 text-[10px] font-normal leading-relaxed text-slate-500">Last checked <time dateTime={pkg.extractedAt}>{new Date(pkg.extractedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' })} IST</time></p>}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comparisonRows.map((row) => (
                                                <tr key={row.label}>
                                                    <th scope="row" className="sticky left-0 z-10 border-b border-r border-slate-700 bg-slate-900 p-4 align-top text-[10px] font-medium leading-relaxed text-slate-400 sm:p-5 sm:text-xs">{row.label}</th>
                                                    {comparisonResults.map((pkg) => (
                                                        <td key={pkg.sourceUrl} className={`border-b border-r border-slate-700/70 p-5 align-top leading-relaxed last:border-r-0 sm:p-6 ${pkg.providerName === 'Uncharted Travel' ? 'bg-yellow-400/[0.025]' : 'bg-slate-800/20'}`}>{row.render(pkg)}</td>
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
