import React, { useState } from 'react';
import Link from 'next/link';
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
        extracted: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
        local: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-200',
        manual: 'border-orange-400/30 bg-orange-400/10 text-orange-200',
        not_found: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    }[source];

    return (
        <span className={`ml-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}>
            {sourceLabels[source]}
        </span>
    );
}

function renderList(items: string[]) {
    if (items.length === 0) {
        return <span className="text-sm text-slate-500">Not found</span>;
    }

    return (
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
            {items.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
    );
}

function renderItinerary(pkg: ExtractedPackageData) {
    if (pkg.itinerary.length === 0) {
        return <p className="text-sm text-slate-500">Itinerary not found clearly on this package.</p>;
    }

    return (
        <ol className="space-y-3">
            {pkg.itinerary.slice(0, 5).map((day, idx) => (
                <li key={`${day.day || idx}-${day.title}`} className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-3">
                    <div className="text-sm font-semibold text-white">
                        {day.day ? `Day ${day.day}: ` : ''}{day.title}
                    </div>
                    {day.description && <p className="mt-1 text-xs leading-relaxed text-slate-400">{day.description}</p>}
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
                        {day.distance && <span className="rounded-full bg-slate-800 px-2 py-1">Distance: {day.distance}</span>}
                        {day.elevation && <span className="rounded-full bg-slate-800 px-2 py-1">Altitude: {day.elevation}</span>}
                        {day.meals && <span className="rounded-full bg-slate-800 px-2 py-1">Meals: {day.meals}</span>}
                    </div>
                </li>
            ))}
            {pkg.itinerary.length > 5 && (
                <li className="text-xs text-slate-500">+ {pkg.itinerary.length - 5} more days on the source itinerary</li>
            )}
        </ol>
    );
}

function renderDetails(details: PackageDetail[]) {
    if (details.length === 0) {
        return <span className="text-sm text-slate-500">No extra details found</span>;
    }

    return (
        <div className="space-y-2">
            {details.map((detail) => (
                <div key={`${detail.label}-${detail.value}`} className="rounded-lg bg-slate-900/60 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {detail.label}
                        {renderSourceBadge(detail.source)}
                    </div>
                    <div className="mt-1 text-sm text-slate-300">{detail.value}</div>
                </div>
            ))}
        </div>
    );
}

function renderSourceLink(pkg: ExtractedPackageData) {
    if (pkg.sourceUrl.startsWith('/')) {
        return (
            <Link href={pkg.sourceUrl} className="text-sm text-blue-400 hover:underline">
                View Package
            </Link>
        );
    }

    return (
        <a href={pkg.sourceUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline">
            View Original Page
        </a>
    );
}

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
                description="Compare our treks with other providers to see the difference."
                noindex={true}
            />

            <main className="min-h-screen bg-slate-950 px-4 pb-20 pt-24 text-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-8 max-w-3xl">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-yellow-300">Package clarity tool</p>
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Compare the details people usually miss</h1>
                        <p className="mt-4 text-slate-400">
                            Pick an Uncharted trek, paste supported competitor links, and compare itinerary, fine print, visible price, and missing information side-by-side.
                        </p>
                    </div>

                    <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
                        <label htmlFor="uncharted-trek" className="mb-2 block text-sm font-semibold text-slate-300">
                            Uncharted trek to compare
                        </label>
                        <select
                            id="uncharted-trek"
                            value={selectedTrekSlug}
                            onChange={(event) => setSelectedTrekSlug(event.target.value)}
                            className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
                        >
                            {treks.map((trek) => (
                                <option key={trek.slug} value={trek.slug}>{trek.title}</option>
                            ))}
                        </select>

                        <div className="mb-6 space-y-4">
                            {urls.map((url, index) => (
                                <div key={index} className="flex flex-col gap-3 md:flex-row">
                                    <input
                                        type="url"
                                        placeholder="https://indiahikes.com/... or https://trekthehimalayas.com/..."
                                        value={url}
                                        onChange={(event) => handleUrlChange(index, event.target.value)}
                                        className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white transition-colors focus:border-yellow-400 focus:outline-none"
                                    />
                                    {urls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveUrl(index)}
                                            className="rounded-lg bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            {urls.length < 3 && (
                                <button
                                    type="button"
                                    onClick={handleAddUrl}
                                    className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-300 transition-colors hover:bg-slate-800"
                                >
                                    + Add Another Link
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleCompare}
                                disabled={loading}
                                className="flex min-w-[180px] items-center justify-center rounded-lg bg-yellow-400 px-8 py-3 font-bold text-slate-950 transition-colors hover:bg-yellow-300 disabled:opacity-50"
                            >
                                {loading ? 'Extracting Data...' : 'Compare Packages'}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-6 rounded-lg border border-orange-400/20 bg-orange-400/10 p-4 text-orange-200">
                                {error}
                            </div>
                        )}
                    </div>

                    {comparisonResults.length > 0 && (
                        <div className="mb-8 grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lowest visible price</div>
                                <div className="mt-2 text-2xl font-bold text-white">{cheapestPackage?.providerName || 'Not enough data'}</div>
                                <div className="mt-1 text-sm text-slate-400">{cheapestPackage?.price || 'Price missing'}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Itinerary visibility</div>
                                <div className="mt-2 text-2xl font-bold text-white">
                                    {comparisonResults.length - packagesMissingItinerary.length}/{comparisonResults.length} shown
                                </div>
                                <div className="mt-1 text-sm text-slate-400">
                                    {packagesMissingItinerary.length > 0 ? `${packagesMissingItinerary.join(', ')} missing details` : 'All packages include itinerary details'}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fine-print reminder</div>
                                <div className="mt-2 text-2xl font-bold text-white">Verify add-ons</div>
                                <div className="mt-1 text-sm text-slate-400">Check transport, GST, insurance, offloading, rentals, and cancellation terms.</div>
                            </div>
                        </div>
                    )}

                    {comparisonResults.length > 0 && (
                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
                            <table className="w-full min-w-[960px] border-collapse text-left">
                                <thead>
                                    <tr>
                                        <th className="w-56 border-b border-slate-800 p-4 font-semibold text-slate-400">Feature</th>
                                        {comparisonResults.map((pkg) => (
                                            <th key={`${pkg.providerName}-${pkg.sourceUrl}`} className="border-b border-slate-800 p-4 align-top">
                                                <div className="text-xl font-bold text-yellow-300">{pkg.providerName}</div>
                                                <div className="mt-1 text-sm font-normal text-slate-400">{pkg.packageName || 'Package name not found'}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Total Price</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4 text-lg font-bold">
                                                {pkg.price || 'Not found'}{renderSourceBadge(pkg.fieldSources.price)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Duration</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4">
                                                {pkg.durationDays || 'Not found'}{renderSourceBadge(pkg.fieldSources.durationDays)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Location & Difficulty</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4 text-sm text-slate-300">
                                                <div>{pkg.location || 'Location not found'}{renderSourceBadge(pkg.fieldSources.location)}</div>
                                                <div className="mt-2">{pkg.difficulty || 'Difficulty not found'}{renderSourceBadge(pkg.fieldSources.difficulty)}</div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Batch Size</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4 text-sm text-slate-300">
                                                {pkg.batchSize || 'Not found'}{renderSourceBadge(pkg.fieldSources.batchSize)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Important Details</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4 align-top">
                                                {renderDetails(pkg.importantDetails)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Itinerary Preview</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4 align-top">
                                                {renderItinerary(pkg)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Inclusions</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4 align-top">
                                                {renderList(pkg.inclusions)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Exclusions & Add-ons</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4 align-top">
                                                {renderList(pkg.exclusions)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Safety Gear</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4 align-top">
                                                {renderList(pkg.safetyGear)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Data Notes</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4 align-top">
                                                {renderList(pkg.extractionWarnings)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-300">Source</td>
                                        {comparisonResults.map((pkg) => (
                                            <td key={pkg.sourceUrl} className="p-4">
                                                {renderSourceLink(pkg)}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default ComparePage;
