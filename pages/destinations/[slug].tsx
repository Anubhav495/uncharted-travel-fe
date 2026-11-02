import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextSeo, ProductJsonLd, BreadcrumbJsonLd } from 'next-seo';
import TrekImage from '@/components/ui/TrekImage';
import { MapPin, Clock, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { treks } from '@/data/treks';
import { Trek } from '@/types/trek';
import GuideCard from '@/components/ui/GuideCard';
import CompanyCard from '@/components/ui/CompanyCard';
import GalleryPreview from '@/components/ui/GalleryPreview';
import TrekItinerary from '@/components/ui/TrekItinerary';
import BookingModal, { BookingFormData, BookingPreference } from '@/components/modals/booking/BookingModal';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

/** Build FAQ items from trek data — only facts present in code, never invented. */
function buildFaqItems(trek: Trek) {
    const items: { q: string; a: string }[] = [];

    // Q1: Price
    items.push({
        q: `How much does the ${trek.title} cost?`,
        a: `The ${trek.title} starts at ${trek.price} per person. This includes the services of your local guide and the trek experience itself. Contact us for group pricing and exact inclusions.`,
    });

    // Q2: Duration
    items.push({
        q: `How many days is the ${trek.title}?`,
        a: `The ${trek.title} is ${trek.duration}. ${trek.itinerary && trek.itinerary.length > 0 ? `The route covers ${trek.itinerary.length} stages from ${trek.itinerary[0].title} to ${trek.itinerary[trek.itinerary.length - 1].title}.` : ''}`,
    });

    // Q3: Difficulty
    items.push({
        q: `How difficult is the ${trek.title}?`,
        a: `The ${trek.title} is rated ${trek.difficulty}. ${trek.difficulty === 'Easy' ? 'It is suitable for first-time trekkers and families with basic fitness.' : trek.difficulty === 'Moderate' ? 'You should have a basic level of fitness and some trekking experience. No technical climbing is required.' : trek.difficulty === 'Hard' ? 'This trek requires good physical fitness, prior trekking experience, and some high-altitude exposure. It is not recommended for beginners.' : 'This is an expert-level trek requiring excellent fitness, high-altitude experience, and technical skills.'}`,
    });

    // Q4: Max altitude (if available)
    if (trek.maxAltitude) {
        items.push({
            q: `What is the maximum altitude of the ${trek.title}?`,
            a: `The highest point of the ${trek.title} is ${trek.maxAltitude}. ${trek.difficulty === 'Moderate' || trek.difficulty === 'Hard' || trek.difficulty === 'Expert' ? 'Acclimatisation is important — take it slow and stay hydrated.' : ''}`,
        });
    }

    // Q5: Best time (if available)
    if (trek.bestTimeToVisit) {
        items.push({
            q: `When is the best time to do the ${trek.title}?`,
            a: `The best time to do the ${trek.title} is ${trek.bestTimeToVisit}. Conditions and trail accessibility can vary — your guide will confirm before departure.`,
        });
    }

    // Q6: Starting point
    items.push({
        q: `Where does the ${trek.title} start?`,
        a: trek.basecamp
            ? `The ${trek.title} starts from ${trek.basecamp}, located in ${trek.location}.`
            : `The ${trek.title} is located in ${trek.location}. Contact us for the exact trailhead details and how to reach the starting point.`,
    });

    return items;
}

const TrekDetailsPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { showToast } = useToast();
    const { user } = useAuth();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [hasEnquired, setHasEnquired] = useState(false);
    const [bookingPreference, setBookingPreference] = useState<BookingPreference>({ type: 'general' });
    const [activeTab, setActiveTab] = useState<'guides' | 'companies'>('guides');
    const [guidePage, setGuidePage] = useState(1);
    const [companyPage, setCompanyPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    // Find the trek
    const trek = treks.find(t => t.slug === slug);

    // Pagination data
    const totalGuides = trek?.guides?.length || 0;
    const totalGuidePages = Math.ceil(totalGuides / ITEMS_PER_PAGE);
    const visibleGuides = trek?.guides?.slice((guidePage - 1) * ITEMS_PER_PAGE, guidePage * ITEMS_PER_PAGE);

    const totalCompanies = trek?.companies?.length || 0;
    const totalCompanyPages = Math.ceil(totalCompanies / ITEMS_PER_PAGE);
    const visibleCompanies = trek?.companies?.slice((companyPage - 1) * ITEMS_PER_PAGE, companyPage * ITEMS_PER_PAGE);

    // Check for prior enquiry (only pending/confirmed are "active")
    useEffect(() => {
        const checkEnquiry = async () => {
            if (!user || !trek) return;
            const response = await fetch(`/api/submitBooking?trekTitle=${encodeURIComponent(trek.title)}`);
            if (response.ok) {
                const data = await response.json();
                setHasEnquired(data.hasEnquired);
            }
        };
        checkEnquiry();
    }, [user, trek]);

    // Check for pending booking after login or direct specific action
    useEffect(() => {
        const handleBookAction = async () => {
            if (router.isReady && user && router.query.action === 'book' && trek) {
                const providerType = router.query.providerType;
                if ((providerType === 'guide' || providerType === 'company') && typeof router.query.providerId === 'string') {
                    setBookingPreference({
                        type: providerType,
                        id: router.query.providerId,
                        name: typeof router.query.providerName === 'string' ? router.query.providerName : undefined,
                    });
                }
                // Perform a fresh check to be sure (state might not be ready)
                const response = await fetch(`/api/submitBooking?trekTitle=${encodeURIComponent(trek.title)}`);
                const data = response.ok ? await response.json() : { hasEnquired: false };

                if (data.hasEnquired) {
                    setHasEnquired(true);
                    showToast('You already have an active request for this trek.', 'info');
                } else {
                    setIsBookingModalOpen(true);
                }

                // Clean up the query param
                const rest = { ...router.query };
                delete rest.action;
                delete rest.providerType;
                delete rest.providerId;
                delete rest.providerName;
                router.replace({
                    pathname: router.pathname,
                    query: rest,
                }, undefined, { shallow: true });
            }
        };

        handleBookAction();
    }, [router, router.isReady, user, router.query, trek, showToast]);

    if (!trek && router.isReady) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white px-6">
                <div className="text-center max-w-md border border-slate-700 bg-slate-800/90 p-10 shadow-2xl rounded-none">
                    <h1 className="font-display text-4xl font-normal mb-3 text-white">Route Not Found</h1>
                    <p className="text-xs text-slate-400 font-sans mb-6">The requested Himalayan expedition route does not exist in our registry.</p>
                    <button
                        onClick={() => router.push('/destinations')}
                        className="px-6 py-3 bg-yellow-400 text-slate-950 hover:bg-yellow-300 text-xs uppercase tracking-widest font-sans font-bold transition-all rounded-none cursor-pointer shadow-lg"
                    >
                        Browse Destinations
                    </button>
                </div>
            </div>
        );
    }

    if (!trek) return null; // Loading state

    const handleRequestInfo = async (id?: string, name?: string, type: 'guide' | 'company' | 'general' = 'general') => {
        setBookingPreference({ id, name, type });
        if (!user) {
            const currentSlug = trek?.slug || (router.query.slug as string);
            let returnPath = `/destinations/${currentSlug}?action=book`;
            if (type !== 'general' && id) {
                returnPath += `&providerType=${encodeURIComponent(type)}&providerId=${encodeURIComponent(id)}&providerName=${encodeURIComponent(name || '')}`;
            }
            router.push(`/login?returnUrl=${encodeURIComponent(returnPath)}`);
            return;
        }
        setIsBookingModalOpen(true);
    };

    const handleBookingSubmit = async (data: BookingFormData): Promise<boolean> => {
        try {
            const response = await fetch('/api/submitBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    trekTitle: trek.title,
                }),
            });

            if (!response.ok) {
                showToast('Something went wrong. Please try again.', 'error');
                return false;
            }

            setHasEnquired(true); // Update UI immediately
            return true;
        } catch (error) {
            console.error(error);
            showToast('Something went wrong.', 'error');
            return false;
        }
    };

    const faqItems = buildFaqItems(trek);

    // FAQ JSON-LD
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
            },
        })),
    };

    // Clean price number for ProductJsonLd
    const priceNumeric = trek.price.replace(/[^\d.]/g, '').split('/')[0].trim();

    return (
        <>
            <NextSeo
                title={trek.title}
                description={trek.overview?.substring(0, 160) || `Experience the breathtaking ${trek.title} in ${trek.location}. ${trek.duration} · ${trek.difficulty} · ${trek.price}.`}
                canonical={`https://unchartedtravel.in/destinations/${trek.slug}`}
                openGraph={{
                    images: trek.image ? [
                        {
                            url: `https://unchartedtravel.in${trek.image}`,
                            alt: `${trek.title} — ${trek.location}`,
                        }
                    ] : []
                }}
            />
            <BreadcrumbJsonLd
                itemListElements={[
                    { position: 1, name: 'Home', item: 'https://unchartedtravel.in/' },
                    { position: 2, name: 'Destinations', item: 'https://unchartedtravel.in/destinations' },
                    { position: 3, name: trek.title, item: `https://unchartedtravel.in/destinations/${trek.slug}` }
                ]}
            />
            <ProductJsonLd
                productName={trek.title}
                images={trek.image ? [`https://unchartedtravel.in${trek.image}`] : undefined}
                description={trek.overview}
                brand="Uncharted Travel"
                offers={{
                    price: priceNumeric,
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                    url: `https://unchartedtravel.in/destinations/${trek.slug}`,
                    seller: { name: 'Uncharted Travel' }
                }}
            />
            {/* FAQ JSON-LD — answers also visible in page body below */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <main className="bg-slate-900 min-h-screen pb-24 text-white border-b border-slate-800">
                {/* Hero Section */}
                <section className="relative h-[70vh] min-h-[520px]">
                    <TrekImage
                        src={trek.image}
                        alt={`${trek.title} trail — ${trek.location}`}
                        fill
                        className={`object-cover ${trek.imagePosition === 'top' ? 'object-top' :
                                trek.imagePosition === 'bottom' ? 'object-bottom' :
                                    'object-center'
                            } ${trek.imageClassName || ''}`}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 from-10% via-slate-900/60 to-transparent pointer-events-none" />

                    <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 pb-12 z-10">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-2 text-yellow-400 mb-4 font-sans text-xs font-semibold uppercase tracking-wider">
                                <MapPin className="w-4 h-4 text-yellow-400" />
                                <span>{trek.location}</span>
                            </div>
                            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal text-white mb-6 leading-tight">
                                {trek.title}
                            </h1>
                            <div className="flex flex-wrap gap-3 text-white/90">
                                <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 border border-slate-700 text-xs font-sans text-slate-200">
                                    <Clock className="w-3.5 h-3.5 text-yellow-400" />
                                    <span>{trek.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 border border-slate-700 text-xs font-sans text-slate-200">
                                    <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
                                    <span>{trek.difficulty}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 border border-slate-700 text-xs font-sans text-slate-200">
                                    <span className="text-yellow-400 font-bold">Price:</span>
                                    <span className="font-bold text-white">{trek.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Layout */}
                <div className="container mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 text-slate-300">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-14">

                        {/* GEO: Direct answer first — for AI crawlers and featured snippets */}
                        <section className="border-l-4 border-yellow-400 pl-4 py-1">
                            <p className="text-base sm:text-lg leading-relaxed text-slate-200 font-sans font-normal">
                                The <strong className="text-white">{trek.title}</strong> is a <strong className="text-white">{trek.difficulty.toLowerCase()}</strong> {trek.duration.toLowerCase()} trek in <strong className="text-white">{trek.location}</strong>, starting at <strong className="text-white">{trek.price}</strong> per person.
                                {trek.maxAltitude && ` It reaches a maximum altitude of ${trek.maxAltitude}.`}
                                {trek.bestTimeToVisit && ` The best time to trek is ${trek.bestTimeToVisit}.`}
                            </p>
                        </section>
                        {/* Overview */}
                        <section>
                            <h2 className="font-display text-3xl font-normal text-white mb-4 border-l-4 border-yellow-400 pl-4">Overview</h2>
                            <p className="text-base sm:text-lg leading-relaxed text-slate-300 font-sans font-normal">
                                {trek.overview}
                            </p>
                        </section>

                        {/* Highlights */}
                        <section>
                            <h2 className="font-display text-3xl font-normal text-white mb-6 border-l-4 border-yellow-400 pl-4">Highlights</h2>
                            <ul className="grid gap-3">
                                {trek.highlights?.map((highlight) => (
                                    <li key={highlight} className="flex items-start gap-4 p-4 bg-slate-800/70 border border-slate-700 hover:border-slate-600 transition-colors">
                                        <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                                        <span className="text-sm font-sans text-slate-200">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Itinerary */}
                        {trek.itinerary && trek.itinerary.length > 0 && (
                            <TrekItinerary itinerary={trek.itinerary} />
                        )}

                        {/* Inclusions & Exclusions */}
                        {(trek.inclusions || trek.exclusions) && (
                            <section>
                                <h2 className="font-display text-3xl font-normal text-white mb-6 border-l-4 border-yellow-400 pl-4">Inclusions &amp; Exclusions</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {trek.inclusions && trek.inclusions.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-sans font-semibold text-green-400 uppercase tracking-wider mb-3">Included</h3>
                                            <ul className="space-y-2">
                                                {trek.inclusions.map((item) => (
                                                    <li key={item} className="flex items-start gap-2 text-sm font-sans text-slate-300">
                                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {trek.exclusions && trek.exclusions.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-sans font-semibold text-rose-400 uppercase tracking-wider mb-3">Not Included</h3>
                                            <ul className="space-y-2">
                                                {trek.exclusions.map((item) => (
                                                    <li key={item} className="flex items-start gap-2 text-sm font-sans text-slate-400">
                                                        <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Gallery Preview */}
                        {trek.gallery && trek.gallery.length > 0 && (
                            <GalleryPreview
                                images={trek.gallery}
                                trekSlug={trek.slug}
                                trekTitle={trek.title}
                            />
                        )}

                        {/* Trekking Options */}
                        {(totalGuides > 0 || totalCompanies > 0) ? (
                            <section>
                                <h2 className="font-display text-3xl font-normal text-white mb-2 border-l-4 border-yellow-400 pl-4">Local Guides &amp; Operators</h2>

                                {totalGuides > 0 && totalCompanies > 0 && (
                                    <div className="mb-6 flex gap-2 border border-slate-700 bg-slate-800 p-1 w-full sm:w-auto inline-flex">
                                        {(['guides', 'companies'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-5 py-2 text-xs font-sans uppercase tracking-wider transition-all font-semibold ${activeTab === tab ? 'bg-yellow-400 text-slate-900 font-bold' : 'text-slate-300 hover:bg-slate-700'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(activeTab === 'guides' && totalGuides > 0 ? visibleGuides : []).map((guide) => (
                                        <div key={guide.id} className="h-full">
                                            <GuideCard guide={guide} onBook={handleRequestInfo} />
                                        </div>
                                    ))}
                                    {(activeTab === 'companies' || totalGuides === 0 ? visibleCompanies : []).map((company) => (
                                        <div key={company.id} className="h-full">
                                            <CompanyCard company={company} onBook={handleRequestInfo} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {activeTab === 'guides' && totalGuidePages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-8">
                                        <button
                                            disabled={guidePage === 1}
                                            onClick={() => setGuidePage(p => p - 1)}
                                            className="px-4 py-2 border border-slate-700 bg-slate-800 text-xs font-sans uppercase tracking-wider text-slate-200 disabled:opacity-30 hover:border-slate-500 hover:bg-slate-700 transition-all cursor-pointer font-medium"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-xs font-sans text-slate-400">Page {guidePage} of {totalGuidePages}</span>
                                        <button
                                            disabled={guidePage === totalGuidePages}
                                            onClick={() => setGuidePage(p => p + 1)}
                                            className="px-4 py-2 border border-slate-700 bg-slate-800 text-xs font-sans uppercase tracking-wider text-slate-200 disabled:opacity-30 hover:border-slate-500 hover:bg-slate-700 transition-all cursor-pointer font-medium"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                                {(activeTab === 'companies' || totalGuides === 0) && totalCompanyPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-8">
                                        <button disabled={companyPage === 1} onClick={() => setCompanyPage((page) => page - 1)} className="px-4 py-2 border border-slate-700 bg-slate-800 text-xs font-sans uppercase tracking-wider text-slate-200 disabled:opacity-30 hover:border-slate-500 hover:bg-slate-700 cursor-pointer font-medium">Previous</button>
                                        <span className="text-xs font-sans text-slate-400">Page {companyPage} of {totalCompanyPages}</span>
                                        <button disabled={companyPage === totalCompanyPages} onClick={() => setCompanyPage((page) => page + 1)} className="px-4 py-2 border border-slate-700 bg-slate-800 text-xs font-sans uppercase tracking-wider text-slate-200 disabled:opacity-30 hover:border-slate-500 hover:bg-slate-700 cursor-pointer font-medium">Next</button>
                                    </div>
                                )}
                            </section>
                        ) : null}

                        {/* FAQ Section — visible text (mirrors FAQ JSON-LD above) */}
                        <section id="faq">
                            <h2 className="font-display text-3xl font-normal text-white mb-6 border-l-4 border-yellow-400 pl-4">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {faqItems.map((item) => (
                                    <div key={item.q} className="border border-slate-700 bg-slate-800/50 p-5">
                                        <h3 className="font-sans font-semibold text-white text-sm mb-2">{item.q}</h3>
                                        <p className="font-sans text-slate-300 text-sm leading-relaxed">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="lg:col-span-1 order-first lg:order-last mb-8 lg:mb-0">
                        <div className="lg:sticky lg:top-28 border border-slate-700 bg-slate-800/80 p-7 shadow-2xl">
                            <div className="hidden lg:block">
                                <span className="text-xs font-sans uppercase tracking-wider text-yellow-400 block mb-2 font-semibold">Trek Overview</span>
                                <h3 className="font-display text-2xl font-normal text-white mb-2">Book Your Trek</h3>
                                <p className="text-xs text-slate-400 mb-6 font-sans">Connect directly with vetted local guides.</p>

                                <div className="space-y-3 mb-8 text-xs font-sans">
                                    <div className="flex justify-between items-center py-2.5 border-b border-slate-700/60">
                                        <span className="text-slate-400">Duration</span>
                                        <span className="text-slate-200">{trek.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2.5 border-b border-slate-700/60">
                                        <span className="text-slate-400">Difficulty</span>
                                        <span className="text-slate-200">{trek.difficulty}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2.5 border-b border-slate-700/60">
                                        <span className="text-slate-400">Price</span>
                                        <span className="text-base text-yellow-400 font-bold">{trek.price}</span>
                                    </div>
                                    {trek.maxAltitude && (
                                        <div className="flex justify-between items-center py-2.5 border-b border-slate-700/60">
                                            <span className="text-slate-400">Max Altitude</span>
                                            <span className="text-slate-200">{trek.maxAltitude}</span>
                                        </div>
                                    )}
                                    {trek.bestTimeToVisit && (
                                        <div className="flex justify-between items-center py-2.5 border-b border-slate-700/60">
                                            <span className="text-slate-400">Best Time</span>
                                            <span className="text-slate-200">{trek.bestTimeToVisit}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {hasEnquired ? (
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-bold py-3.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg font-sans"
                                >
                                    <span>View Enquiry</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleRequestInfo()}
                                    className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-bold py-3.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg font-sans"
                                >
                                    <span>Request Trek Info</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}

                            <p className="mt-4 text-xs font-sans text-center text-slate-400">
                                Zero booking fee &middot; Direct guide contact
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                trekTitle={trek.title}
                bookingPreference={bookingPreference}
                onSubmit={handleBookingSubmit}
            />
        </>
    );
};

export default TrekDetailsPage;
