import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { MapPin, Clock, TrendingUp, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { treks } from '@/data/treks';
import GuideCard from '@/components/ui/GuideCard';
import GalleryPreview from '@/components/ui/GalleryPreview';
import BookingModal, { BookingFormData } from '@/components/modals/booking/BookingModal'; // Adjust path if needed
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const TrekDetailsPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { showToast } = useToast();
    const { user, loginWithGoogle } = useAuth();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [hasEnquired, setHasEnquired] = useState(false);

    // Find the trek
    const trek = treks.find(t => t.slug === slug);

    // Check for prior enquiry
    useEffect(() => {
        const checkEnquiry = async () => {
            if (!user || !trek) return;
            const { data } = await supabase
                .from('booking_requests')
                .select('id')
                .eq('user_id', user.id)
                .eq('trek_title', trek.title)
                .neq('status', 'closed') // Consider 'active' only if not closed
                .maybeSingle();

            if (data) setHasEnquired(true);
        };
        checkEnquiry();
    }, [user, trek]);

    // Check for pending booking after login or direct specific action
    useEffect(() => {
        const handleBookAction = async () => {
            if (router.isReady && user && router.query.action === 'book' && trek) {
                // Perform a fresh check to be sure (state might not be ready)
                const { data } = await supabase
                    .from('booking_requests')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('trek_title', trek.title)
                    .neq('status', 'closed') // Allow re-booking if previous was closed/rejected
                    .maybeSingle();

                if (data) {
                    setHasEnquired(true);
                    showToast('You already have an active request for this trek.', 'info');
                } else {
                    setIsBookingModalOpen(true);
                }

                // Clean up the query param
                const { action, ...rest } = router.query;
                router.replace({
                    pathname: router.pathname,
                    query: rest,
                }, undefined, { shallow: true });
            }
        };

        handleBookAction();
    }, [router.isReady, user, router.query, trek, showToast]);

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

    const handleRequestInfo = async () => {
        if (!user) {
            await loginWithGoogle(`${window.location.origin}${router.asPath}?action=book`);
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
            <Head>
                <title>{trek.title} | UnchartedTravel</title>
                <meta name="description" content={trek.overview?.substring(0, 160)} />
            </Head>

            <main className="bg-slate-900 min-h-screen pb-20">
                {/* Hero Section */}
                <section className="relative h-[70vh] min-h-[500px]">
                    <Image
                        src={trek.image}
                        alt={trek.title}
                        fill
                        className="object-cover object-top"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/30" />

                    <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 z-10">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-2 text-yellow-400 mb-4 font-medium uppercase tracking-wider text-sm">
                                <MapPin className="w-5 h-5" />
                                <span>{trek.location}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                {trek.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 md:gap-8 text-white/90">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                    <span>{trek.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                                    <span>{trek.difficulty}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <span className="text-yellow-400 font-bold">Price:</span>
                                    <span>{trek.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Layout */}
                <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 text-slate-300">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-yellow-400 pl-4">Overview</h2>
                            <p className="text-lg leading-relaxed text-slate-300">
                                {trek.overview}
                            </p>
                        </section>

                        {/* Highlights */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-yellow-400 pl-4">Highlights</h2>
                            <ul className="grid gap-4">
                                {trek.highlights?.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                                        <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                                        <span className="text-lg">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Gallery Preview */}
                        {trek.gallery && trek.gallery.length > 0 && (
                            <GalleryPreview
                                images={trek.gallery}
                                trekSlug={trek.slug}
                                trekTitle={trek.title}
                            />
                        )}

                        {/* Itinerary */}
                        {trek.itinerary && trek.itinerary.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-yellow-400 pl-4">Itinerary</h2>
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                                    {trek.itinerary.map((day, index) => (
                                        <div key={day.day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                            {/* Icon */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-yellow-400 font-bold z-10">
                                                {day.day}
                                            </div>

                                            {/* Content Card */}
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-yellow-400/30 transition-colors shadow-lg">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                    <h3 className="font-bold text-white text-lg">{day.title}</h3>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 sm:mt-0">
                                                        {day.distance && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {day.distance}</span>}
                                                        {day.elevation && <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {day.elevation}</span>}
                                                    </div>
                                                </div>
                                                <p className="text-slate-300 text-sm leading-relaxed">
                                                    {day.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Meet the Locals (Guides) */}
                        {trek.guides && trek.guides.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-yellow-400 pl-4">Meet the Local Guide</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {trek.guides.map((guide) => (
                                        <div key={guide.id} className="h-full">
                                            <GuideCard guide={guide} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="lg:col-span-1 order-first lg:order-last mb-8 lg:mb-0">
                        <div className="lg:sticky lg:top-24 lg:bg-slate-800 lg:border lg:border-slate-700 lg:rounded-2xl lg:p-6 lg:shadow-2xl">
                            <div className="hidden lg:block">
                                <h3 className="text-2xl font-bold text-white mb-2">Book This Adventure</h3>
                                <p className="text-slate-400 mb-6">Ready to explore the uncharted?</p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-700">
                                        <span>Duration</span>
                                        <span className="text-white font-medium">{trek.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-700">
                                        <span>Difficulty</span>
                                        <span className="text-white font-medium">{trek.difficulty}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-700">
                                        <span>Price</span>
                                        <span className="text-2xl font-bold text-yellow-400">{trek.price}</span>
                                    </div>
                                </div>
                            </div>

                            {hasEnquired ? (
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-yellow-400/20"
                                >
                                    View Enquiry
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleRequestInfo}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-yellow-400/20"
                                >
                                    Request Info
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            )}

                            {!hasEnquired && (
                                <p className="mt-4 text-xs text-center text-slate-500">
                                    No payment required at this step. We'll contact you with details.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                trekTitle={trek.title}
                onSubmit={handleBookingSubmit}
            />
        </>
    );
};

export default TrekDetailsPage;
