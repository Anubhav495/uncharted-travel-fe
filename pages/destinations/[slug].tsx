import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextSeo, ProductJsonLd, BreadcrumbJsonLd } from 'next-seo';
import TrekImage from '@/components/ui/TrekImage';
import { MapPin, Clock, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { treks } from '@/data/treks';
import GuideCard from '@/components/ui/GuideCard';
import CompanyCard from '@/components/ui/CompanyCard';
import GalleryPreview from '@/components/ui/GalleryPreview';
import TrekItinerary from '@/components/ui/TrekItinerary';
import BookingModal, { BookingFormData, BookingPreference } from '@/components/modals/booking/BookingModal'; // Adjust path if needed
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

const TrekDetailsPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { showToast } = useToast();
    const { user, loginWithGoogle } = useAuth();
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
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Trek Not Found</h1>
                    <button
                        onClick={() => router.push('/destinations')}
                        className="text-yellow-400 hover:underline"
                    >
                        Back to Destinations
                    </button>
                </div>
            </div>
        );
    }

    if (!trek) return null; // Loading state

    const handleRequestInfo = async (id?: string, name?: string, type: 'guide' | 'company' | 'general' = 'general') => {
        setBookingPreference({ id, name, type });
        if (!user) {
            const callbackUrl = new URL(router.asPath, window.location.origin);
            callbackUrl.searchParams.set('action', 'book');
            if (id && type !== 'general') {
                callbackUrl.searchParams.set('providerType', type);
                callbackUrl.searchParams.set('providerId', id);
                if (name) callbackUrl.searchParams.set('providerName', name);
            }
            await loginWithGoogle(callbackUrl.toString());
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

    return (
        <>
            <NextSeo 
                title={trek.title}
                description={trek.overview?.substring(0, 160) || `Experience the breathtaking ${trek.title} in ${trek.location}.`}
                canonical={`https://unchartedtravel.in/destinations/${trek.slug}`}
                openGraph={{
                    images: trek.image ? [
                        {
                            url: `https://unchartedtravel.in${trek.image}`,
                            alt: trek.title,
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
                    price: trek.price.replace(/[^0-9.-]+/g,""),
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                    url: `https://unchartedtravel.in/destinations/${trek.slug}`,
                    seller: { name: 'Uncharted Travel' }
                }}
            />

            <main className="bg-black min-h-screen pb-24 text-white border-b border-white/[0.08]">
                {/* Hero Section */}
                <section className="relative h-[70vh] min-h-[520px]">
                    <TrekImage
                        src={trek.image}
                        alt={trek.title}
                        fill
                        className={`object-cover ${trek.imagePosition === 'top' ? 'object-top' :
                                trek.imagePosition === 'bottom' ? 'object-bottom' :
                                    'object-center'
                            } ${trek.imageClassName || ''}`}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black from-10% via-black/60 to-transparent pointer-events-none" />

                    <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 pb-12 z-10">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-2 text-white/60 mb-4 font-mono uppercase tracking-widest text-xs">
                                <MapPin className="w-4 h-4 text-white/50" />
                                <span>{trek.location}</span>
                            </div>
                            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal text-white mb-6 leading-tight">
                                {trek.title}
                            </h1>
                            <div className="flex flex-wrap gap-3 text-white/90">
                                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/15 text-xs font-mono text-white/80">
                                    <Clock className="w-3.5 h-3.5 text-white/50" />
                                    <span>{trek.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/15 text-xs font-mono text-white/80">
                                    <TrendingUp className="w-3.5 h-3.5 text-white/50" />
                                    <span>{trek.difficulty}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/15 text-xs font-mono text-white/80">
                                    <span className="text-white/40">Tariff:</span>
                                    <span className="font-medium text-white">{trek.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Layout */}
                <div className="container mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 text-white/70">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-14">
                        {/* Overview */}
                        <section>
                            <h2 className="font-display text-3xl font-normal text-white mb-4 border-l-2 border-white pl-4">Trajectory Overview</h2>
                            <p className="text-base sm:text-lg leading-relaxed text-white/65 font-sans font-normal">
                                {trek.overview}
                            </p>
                        </section>

                        {/* Highlights */}
                        <section>
                            <h2 className="font-display text-3xl font-normal text-white mb-6 border-l-2 border-white pl-4">Alpine Highlights</h2>
                            <ul className="grid gap-3">
                                {trek.highlights?.map((highlight) => (
                                    <li key={highlight} className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                                        <span className="text-sm font-sans text-white/80">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Itinerary */}
                        {trek.itinerary && trek.itinerary.length > 0 && (
                            <TrekItinerary itinerary={trek.itinerary} />
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
                                <h2 className="font-display text-3xl font-normal text-white mb-2 border-l-2 border-white pl-4">Expedition Leaders</h2>
                                <p className="text-white/50 text-xs font-mono uppercase tracking-wider mb-6 pl-4">Request a specific local master or certified team.</p>

                                {totalGuides > 0 && totalCompanies > 0 && (
                                    <div className="mb-6 flex gap-2 border border-white/10 bg-white/[0.02] p-1 w-full sm:w-auto inline-flex">
                                        {(['guides', 'companies'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-5 py-2 text-xs font-mono uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black font-medium' : 'text-white/50 hover:text-white'}`}
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
                                            className="px-4 py-2 border border-white/15 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-white disabled:opacity-30 hover:border-white/30 transition-all"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-xs font-mono text-white/50">Page {guidePage} of {totalGuidePages}</span>
                                        <button 
                                            disabled={guidePage === totalGuidePages}
                                            onClick={() => setGuidePage(p => p + 1)}
                                            className="px-4 py-2 border border-white/15 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-white disabled:opacity-30 hover:border-white/30 transition-all"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                                {(activeTab === 'companies' || totalGuides === 0) && totalCompanyPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-8">
                                        <button disabled={companyPage === 1} onClick={() => setCompanyPage((page) => page - 1)} className="px-4 py-2 border border-white/15 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-white disabled:opacity-30 hover:border-white/30">Previous</button>
                                        <span className="text-xs font-mono text-white/50">Page {companyPage} of {totalCompanyPages}</span>
                                        <button disabled={companyPage === totalCompanyPages} onClick={() => setCompanyPage((page) => page + 1)} className="px-4 py-2 border border-white/15 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-white disabled:opacity-30 hover:border-white/30">Next</button>
                                    </div>
                                )}
                            </section>
                        ) : null}
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="lg:col-span-1 order-first lg:order-last mb-8 lg:mb-0">
                        <div className="lg:sticky lg:top-28 border border-white/15 bg-neutral-950 p-7 shadow-2xl">
                            <div className="hidden lg:block">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">Expedition Dossier</span>
                                <h3 className="font-display text-2xl font-normal text-white mb-2">Reserve Field Slot</h3>
                                <p className="text-xs text-white/50 mb-6 font-sans">Connect directly with vetted local leaders.</p>

                                <div className="space-y-3 mb-8 text-xs font-mono">
                                    <div className="flex justify-between items-center py-2.5 border-b border-white/[0.08]">
                                        <span className="text-white/50">DURATION</span>
                                        <span className="text-white">{trek.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2.5 border-b border-white/[0.08]">
                                        <span className="text-white/50">DIFFICULTY</span>
                                        <span className="text-white">{trek.difficulty}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2.5 border-b border-white/[0.08]">
                                        <span className="text-white/50">TARIFF</span>
                                        <span className="text-base text-white font-medium">{trek.price}</span>
                                    </div>
                                </div>
                            </div>

                            {hasEnquired ? (
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full bg-white text-black hover:bg-white/90 font-medium py-3.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                >
                                    <span>View Enquiry</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleRequestInfo()}
                                    className="w-full bg-white text-black hover:bg-white/90 font-medium py-3.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                >
                                    <span>Request Expedition Info</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}

                            <p className="mt-4 text-[11px] font-mono text-center text-white/40">
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
