import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo, BreadcrumbJsonLd } from 'next-seo';
import { Star, Award, MessageCircle, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { guideProfiles, GuideProfile, getTreksForGuide } from '@/data/guides';
import { Trek } from '@/types/trek';

interface GuidePageProps {
    guide: GuideProfile;
    treks: Trek[];
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = guideProfiles.map((g) => ({
        params: { id: g.profileId },
    }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<GuidePageProps> = async ({ params }) => {
    const id = params?.id as string;
    const guide = guideProfiles.find((g) => g.profileId === id);
    if (!guide) return { notFound: true };

    const treks = getTreksForGuide(id);
    return {
        props: {
            guide: JSON.parse(JSON.stringify(guide)),
            treks: JSON.parse(JSON.stringify(treks)),
        },
    };
};

export default function GuideProfilePage({ guide, treks }: GuidePageProps) {
    const canonicalUrl = `https://unchartedtravel.in/guides/${guide.profileId}`;

    // PersonJsonLd built inline as JSON-LD script (next-seo doesn't have a Person component)
    const personJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: guide.name,
        image: `https://unchartedtravel.in${guide.avatar}`,
        description: guide.description,
        url: canonicalUrl,
        worksFor: {
            '@type': 'Organization',
            name: 'Uncharted Travel',
            url: 'https://unchartedtravel.in',
        },
        knowsAbout: treks.map((t) => t.title),
        knowsLanguage: guide.languages,
        jobTitle: 'Mountain Trek Guide',
        hasOccupation: {
            '@type': 'Occupation',
            name: 'Himalayan Trek Guide',
            occupationLocation: {
                '@type': 'Country',
                name: 'India',
            },
        },
    };

    return (
        <>
            <NextSeo
                title={`${guide.name} — Local Himalayan Trek Guide`}
                description={`${guide.name} is a verified local Himalayan guide with ${guide.experience} experience. Speaks ${guide.languages.join(', ')}. Leads treks including ${treks.map((t) => t.title).join(', ')}.`}
                canonical={canonicalUrl}
                openGraph={{
                    title: `${guide.name} — Himalayan Trek Guide | Uncharted Travel`,
                    description: guide.description,
                    url: canonicalUrl,
                    images: [
                        {
                            url: `https://unchartedtravel.in${guide.avatar}`,
                            alt: `${guide.name} — local Himalayan trek guide`,
                        },
                    ],
                }}
            />
            <BreadcrumbJsonLd
                itemListElements={[
                    { position: 1, name: 'Home', item: 'https://unchartedtravel.in/' },
                    { position: 2, name: 'Guides', item: 'https://unchartedtravel.in/guides' },
                    { position: 3, name: guide.name, item: canonicalUrl },
                ]}
            />
            {/* Person JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
            />

            <main className="bg-slate-900 min-h-screen pb-24 text-white">
                {/* Back Link */}
                <div className="pt-28 pb-0 px-6 max-w-5xl mx-auto">
                    <Link
                        href="/guides"
                        className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-slate-400 hover:text-yellow-400 transition-colors mb-8 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Guides
                    </Link>
                </div>

                {/* Hero */}
                <section className="px-6 max-w-5xl mx-auto mt-4">
                    <div className="flex flex-col sm:flex-row items-start gap-8 border border-slate-700 bg-slate-800/70 p-8">
                        {/* Avatar */}
                        <div className="relative w-28 h-28 shrink-0 border-2 border-slate-600 overflow-hidden">
                            <Image
                                src={guide.avatar}
                                alt={`${guide.name} — local Himalayan trek guide with ${guide.experience} experience`}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <span className="text-[10px] font-sans uppercase tracking-widest text-yellow-400 font-semibold mb-1 block">
                                Verified Native Guide
                            </span>
                            <h1 className="font-display text-4xl sm:text-5xl font-normal text-white leading-tight mb-2">
                                {guide.name}
                            </h1>

                            {/* Rating */}
                            {guide.reviews && guide.reviews > 0 && (
                                <div className="flex items-center gap-2 text-sm font-sans mb-4">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-white font-semibold">{guide.rating}</span>
                                    <span className="text-slate-400">({guide.reviews} verified reviews)</span>
                                </div>
                            )}

                            {/* Quick meta */}
                            <div className="flex flex-wrap gap-4 text-xs font-sans text-slate-300">
                                {guide.experience && (
                                    <span className="flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5 text-yellow-400" />
                                        {guide.experience} of guiding experience
                                    </span>
                                )}
                                {guide.languages.length > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                                        Speaks {guide.languages.join(', ')}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    Himalayan Treks, India
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About */}
                <section className="px-6 max-w-5xl mx-auto mt-10">
                    <h2 className="font-display text-3xl font-normal text-white mb-4 border-l-4 border-yellow-400 pl-4">
                        About {guide.name}
                    </h2>
                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
                        {guide.description}
                    </p>
                    <p className="text-slate-400 text-sm font-sans mt-4 leading-relaxed">
                        <strong className="text-slate-200">Last updated:</strong> November 2026
                    </p>
                </section>

                {/* Treks Led */}
                {treks.length > 0 && (
                    <section className="px-6 max-w-5xl mx-auto mt-12">
                        <h2 className="font-display text-3xl font-normal text-white mb-6 border-l-4 border-yellow-400 pl-4">
                            Treks Led by {guide.name}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {treks.map((trek) => (
                                <Link
                                    key={trek.slug}
                                    href={`/destinations/${trek.slug}`}
                                    className="group block border border-slate-700 bg-slate-800/60 hover:border-yellow-400/50 p-5 transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="relative w-16 h-16 shrink-0 overflow-hidden border border-slate-700">
                                            <Image
                                                src={trek.image}
                                                alt={`${trek.title} — led by ${guide.name}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-display text-lg font-normal text-white group-hover:text-yellow-400 transition-colors">
                                                {trek.title}
                                            </h3>
                                            <p className="text-xs font-sans text-slate-400 mt-0.5">
                                                {trek.location} · {trek.duration} · {trek.difficulty} · {trek.price}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="px-6 max-w-5xl mx-auto mt-12">
                    <div className="border border-yellow-400/20 bg-yellow-400/5 p-8 text-center">
                        <h2 className="font-display text-3xl font-normal text-white mb-3">
                            Want to trek with {guide.name}?
                        </h2>
                        <p className="text-slate-400 font-sans text-sm mb-6 max-w-lg mx-auto">
                            Choose a trek above and submit an enquiry. {guide.name} will connect with you directly — no booking fees, no middlemen.
                        </p>
                        <Link
                            href="/destinations"
                            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-3 px-7 text-xs uppercase tracking-widest font-sans font-bold transition-all shadow-lg"
                        >
                            Browse All Treks
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}

