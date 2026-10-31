import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Camera, MapPin, Maximize2 } from 'lucide-react';
import { treks } from '@/data/treks';

const GalleryPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const trek = treks.find(t => t.slug === slug);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    }, []);

    // Handle browser back button to close lightbox
    useEffect(() => {
        const handlePopState = () => {
            if (lightboxOpen) {
                closeLightbox();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [lightboxOpen, closeLightbox]);

    // Keyboard navigation in lightbox
    useEffect(() => {
        if (!lightboxOpen || !trek?.gallery) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev === trek.gallery.length - 1 ? 0 : prev + 1));
            if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev === 0 ? trek.gallery.length - 1 : prev - 1));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, trek, closeLightbox]);

    if (!trek && router.isReady) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white px-6">
                <div className="text-center max-w-md border border-white/10 bg-neutral-950 p-10">
                    <h1 className="font-display text-4xl font-normal mb-3 text-white">Gallery Not Found</h1>
                    <p className="text-xs text-white/50 font-sans mb-6">The requested expedition visual registry does not exist.</p>
                    <button
                        onClick={() => router.push('/destinations')}
                        className="px-6 py-3 border border-white/20 bg-white text-black hover:bg-neutral-200 text-xs uppercase tracking-widest font-sans font-medium transition-all"
                    >
                        Browse Destinations
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
        window.history.pushState({ lightbox: true }, '');
    };

    const handleCloseLightbox = () => {
        window.history.back();
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
                <title>{trek.title} Gallery &middot; Visual Archive | Uncharted Travel</title>
                <meta name="description" content={`Expedition photo gallery and terrain reconnaissance for ${trek.title} in ${trek.location}.`} />
            </Head>

            <main className="bg-slate-900 text-white min-h-screen pb-28 relative">
                {/* Subtle Ambient Topo Grid */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" 
                    aria-hidden="true"
                />

                {/* Hero Header Section */}
                <section className="relative pt-28 pb-12 px-6 sm:px-8 border-b border-slate-800 z-10">
                    <div className="max-w-7xl mx-auto">
                        <Link
                            href={`/destinations/${trek.slug}`}
                            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-slate-400 hover:text-yellow-400 transition-colors duration-150 mb-8 font-medium cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to {trek.title}</span>
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="inline-block border border-yellow-400/30 px-3 py-1 bg-yellow-400/10 text-[10px] font-sans uppercase tracking-widest text-yellow-400 mb-4 font-semibold">
                                    Visual Archive &middot; High Altitude Reconnaissance
                                </div>
                                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal text-white tracking-tight leading-tight">
                                    {trek.title}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs font-sans uppercase tracking-wider text-slate-400">
                                <span className="flex items-center gap-1.5 text-slate-200">
                                    <Camera className="w-3.5 h-3.5 text-yellow-400" />
                                    <span>Gallery &bull; {gallery.length} photos</span>
                                </span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                <span className="flex items-center gap-1.5 text-slate-400">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{trek.location}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery Grid */}
                <section className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 relative z-10">
                    {gallery.length === 0 ? (
                        <div className="text-center py-24 border border-slate-700 bg-slate-800/70 p-12">
                            <Camera className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                            <h3 className="font-display text-2xl font-normal text-white mb-2">No photos archived yet</h3>
                            <p className="text-slate-400 text-xs font-sans max-w-sm mx-auto">
                                Archival reconnaissance photography for this trail is currently being curated by native guides.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                            {gallery.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => openLightbox(index)}
                                    className="relative aspect-[4/3] sm:aspect-square border border-slate-700 bg-slate-800 overflow-hidden cursor-pointer group shadow-xl transition-all duration-300 hover:border-yellow-400/50"
                                >
                                    <Image
                                        src={image}
                                        alt={`${trek.title} - Frame ${index + 1}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    
                                    {/* Hover Vignette Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4" />

                                    {/* Frame Index Badge */}
                                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="font-sans text-[10px] text-white bg-slate-900/80 px-2 py-0.5 border border-slate-700 backdrop-blur-md font-semibold">
                                            #{index < 9 ? `0${index + 1}` : index + 1}
                                        </span>
                                    </div>

                                    {/* Expand Indicator */}
                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-7 h-7 flex items-center justify-center border border-slate-600 bg-slate-900/80 backdrop-blur-md text-yellow-400 shadow-lg">
                                            <Maximize2 className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Darkroom Cinematic Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[300] flex flex-col justify-between"
                    onClick={handleCloseLightbox}
                    tabIndex={0}
                    ref={(el) => el?.focus()}
                >
                    {/* Top Bar */}
                    <div 
                        className="w-full flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/80 relative z-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-display text-lg text-white">
                                {trek.title}
                            </span>
                            <span className="text-xs font-sans text-slate-400 uppercase tracking-widest hidden sm:inline">
                                &middot; Frame {currentIndex + 1} of {gallery.length}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleCloseLightbox}
                            className="p-2 border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
                            aria-label="Close viewer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Main Image Stage */}
                    <div 
                        className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Prev Button */}
                        <button
                            type="button"
                            onClick={goToPrevious}
                            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-slate-700 bg-slate-900/80 hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400 text-white backdrop-blur-md transition-all shadow-2xl z-20 cursor-pointer"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Image Container */}
                        <div className="relative w-full h-full max-w-5xl max-h-[78vh] flex items-center justify-center">
                            <Image
                                src={gallery[currentIndex]}
                                alt={`${trek.title} - Frame ${currentIndex + 1}`}
                                fill
                                priority
                                className="object-contain select-none"
                            />
                        </div>

                        {/* Next Button */}
                        <button
                            type="button"
                            onClick={goToNext}
                            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-slate-700 bg-slate-900/80 hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400 text-white backdrop-blur-md transition-all shadow-2xl z-20 cursor-pointer"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Bottom Metadata & Controls */}
                    <div 
                        className="w-full flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/80 relative z-20 text-xs font-sans text-slate-400"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span>Expedition Archival Photograph</span>
                        <div className="flex items-center gap-1.5 font-sans text-white">
                            <span className="text-yellow-400 font-semibold">{currentIndex + 1}</span>
                            <span className="text-slate-500">/</span>
                            <span>{gallery.length}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GalleryPage;
