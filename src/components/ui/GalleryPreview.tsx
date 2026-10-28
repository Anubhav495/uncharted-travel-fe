import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';

interface GalleryPreviewProps {
    images: string[];
    trekSlug: string;
    trekTitle: string;
}

const GalleryPreview: React.FC<GalleryPreviewProps> = ({ images, trekSlug, trekTitle }) => {
    if (!images || images.length === 0) return null;

    const previewImages = images.slice(0, 3);
    const remainingCount = images.length - 3;

    return (
        <section>
            <div className="mb-6">
                <h2 className="font-display text-3xl font-normal text-white border-l-4 border-yellow-400 pl-4">
                    Gallery
                </h2>
                <p className="text-slate-400 text-xs font-sans mt-1 pl-4">
                    Visual terrain reconnaissance and ridgeline perspectives.
                </p>
            </div>

            <div className="flex gap-3 md:gap-4 h-64 md:h-80 lg:h-96">
                {/* Featured Large Image - Left (2/3 width) */}
                <div className="w-2/3 relative border border-slate-700 bg-slate-800 overflow-hidden group cursor-pointer shadow-xl">
                    <Image
                        src={previewImages[0]}
                        alt={`${trekTitle} - Gallery image 1`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[10px] font-sans uppercase tracking-wider text-slate-200">
                        <Camera className="w-3 h-3 text-yellow-400" />
                        <span>Trail View</span>
                    </div>
                </div>

                {/* Smaller Images on Right - Stack (1/3 width) */}
                <div className="w-1/3 flex flex-col gap-3 md:gap-4">
                    {previewImages.slice(1, 3).map((image, index) => (
                        <div
                            key={index}
                            className="relative border border-slate-700 bg-slate-800 overflow-hidden group cursor-pointer flex-1 shadow-xl"
                        >
                            <Image
                                src={image}
                                alt={`${trekTitle} - Gallery image ${index + 2}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

                            {/* +X more overlay on the last preview image */}
                            {index === 1 && remainingCount > 0 && (
                                <Link
                                    href={`/destinations/${trekSlug}/gallery`}
                                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white text-center transition-all hover:bg-slate-900/90 p-3 group border border-slate-700"
                                >
                                    <span className="font-display text-3xl md:text-5xl font-normal text-white mb-1">
                                        +{remainingCount}
                                    </span>
                                    <span className="text-[10px] md:text-xs uppercase tracking-widest font-sans font-semibold text-yellow-400 group-hover:text-yellow-300 flex items-center justify-center gap-1.5 transition-colors">
                                        View Full Gallery <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* View All Button - visible if remaining count is 0 */}
            {remainingCount <= 0 && images.length > 1 && (
                <div className="mt-4">
                    <Link
                        href={`/destinations/${trekSlug}/gallery`}
                        className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-yellow-400 hover:text-yellow-300 transition-colors border-b border-yellow-400/30 hover:border-yellow-400 pb-1 font-semibold"
                    >
                        <span>View Full Gallery ({images.length} frames)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            )}
        </section>
    );
};

export default GalleryPreview;
