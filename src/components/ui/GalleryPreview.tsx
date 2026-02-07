import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-yellow-400 pl-4">
                Gallery
            </h2>

            <div className="flex gap-3 md:gap-4 h-64 md:h-80 lg:h-96">
                {/* Featured Large Image - Left (2/3 width) */}
                <div className="w-2/3 relative rounded-2xl overflow-hidden group cursor-pointer">
                    <Image
                        src={previewImages[0]}
                        alt={`${trekTitle} - Gallery image 1`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Smaller Images on Right - Stack (1/3 width) */}
                <div className="w-1/3 flex flex-col gap-3 md:gap-4">
                    {previewImages.slice(1, 3).map((image, index) => (
                        <div
                            key={index}
                            className="relative rounded-2xl overflow-hidden group cursor-pointer flex-1"
                        >
                            <Image
                                src={image}
                                alt={`${trekTitle} - Gallery image ${index + 2}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* +X more overlay on the last preview image */}
                            {index === 1 && remainingCount > 0 && (
                                <Link
                                    href={`/destinations/${trekSlug}/gallery`}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white transition-all hover:bg-black/70"
                                >
                                    <span className="text-3xl md:text-4xl font-bold">+{remainingCount}</span>
                                    <span className="text-sm md:text-base mt-1 flex items-center gap-1">
                                        View Full Gallery <ArrowRight className="w-4 h-4" />
                                    </span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* View All Button - visible on mobile or if few images */}
            {remainingCount <= 0 && images.length > 1 && (
                <div className="mt-4 text-center">
                    <Link
                        href={`/destinations/${trekSlug}/gallery`}
                        className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                    >
                        View Full Gallery <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </section>
    );
};

export default GalleryPreview;
