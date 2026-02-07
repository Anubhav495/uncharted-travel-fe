import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { treks } from '@/data/treks';

const GalleryPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const trek = treks.find(t => t.slug === slug);

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

    if (!trek) return null;

    const gallery = trek.gallery || [];

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <Head>
                <title>{trek.title} Gallery | UnchartedTravel</title>
                <meta name="description" content={`Photo gallery for ${trek.title} trek`} />
            </Head>

            <main className="bg-slate-900 min-h-screen pb-20">
                {/* Hero Section */}
                <section className="relative py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
                    <div className="container mx-auto">
                        <Link
                            href={`/destinations/${trek.slug}`}
                            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to {trek.title}
                        </Link>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {trek.title}
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Gallery • {gallery.length} photos
                        </p>
                    </div>
                </section>

                {/* Gallery Grid */}
                <section className="container mx-auto px-4 mt-8">
                    {gallery.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-slate-400 text-lg">No photos available yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gallery.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => openLightbox(index)}
                                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                                >
                                    <Image
                                        src={image}
                                        alt={`${trek.title} - Photo ${index + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                    onClick={closeLightbox}
                    onKeyDown={(e) => e.key === 'Escape' && closeLightbox()}
                    tabIndex={0}
                    ref={(el) => el?.focus()}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrevious();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 transition-colors z-10"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 transition-colors z-10"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    <div
                        className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={gallery[currentIndex]}
                            alt={`${trek.title} - Photo ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70">
                        {currentIndex + 1} / {gallery.length}
                    </div>
                </div>
            )}
        </>
    );
};

export default GalleryPage;
