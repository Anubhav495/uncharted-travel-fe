import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo, BreadcrumbJsonLd } from 'next-seo';
import { Star, Award, MessageCircle } from 'lucide-react';
import { guideProfiles } from '@/data/guides';
import { getTreksForGuide } from '@/data/guides';

export default function GuidesIndexPage() {
    return (
        <>
            <NextSeo
                title="Local Himalayan Trek Guides"
                description="Meet Uncharted Travel's verified local mountain guides — Pritam Negi, Kapil Rawat, Kailash Rawat, Bhojraj, and Aatish. Real guides, real experience, real Himalayas."
                canonical="https://unchartedtravel.in/guides"
                openGraph={{
                    title: 'Local Himalayan Trek Guides | Uncharted Travel',
                    description: 'Meet our verified local mountain guides from the Parvati Valley and Garhwal Himalayas.',
                    url: 'https://unchartedtravel.in/guides',
                }}
            />
            <BreadcrumbJsonLd
                itemListElements={[
                    { position: 1, name: 'Home', item: 'https://unchartedtravel.in/' },
                    { position: 2, name: 'Guides', item: 'https://unchartedtravel.in/guides' },
                ]}
            />

            <main className="bg-slate-900 min-h-screen pb-24 text-white">
                {/* Hero */}
                <section className="pt-28 pb-14 px-6 border-b border-slate-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-block text-xs font-sans uppercase tracking-widest text-yellow-400 font-semibold mb-3">
                            Verified Native Guides
                        </span>
                        <h1 className="font-display text-5xl sm:text-6xl font-normal text-white mb-4 leading-tight tracking-tight">
                            Local Himalayan <span className="italic text-yellow-400">Guides</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto font-sans text-sm sm:text-base leading-relaxed">
                            Every guide on Uncharted Travel is a local — born and raised in the mountains they lead. They know the hidden trails, the weather patterns, and the stories behind every ridge. No middlemen. No markup.
                        </p>
                    </div>
                </section>

                {/* Guides Grid */}
                <section className="max-w-6xl mx-auto px-6 mt-14">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guideProfiles.map((guide) => {
                            const guidetreks = getTreksForGuide(guide.profileId);
                            return (
                                <Link
                                    key={guide.profileId}
                                    href={`/guides/${guide.profileId}`}
                                    className="group block border border-slate-700 bg-slate-800/70 hover:border-yellow-400/50 p-6 transition-all duration-200 shadow-xl"
                                >
                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative w-16 h-16 shrink-0 border-2 border-slate-600 group-hover:border-yellow-400 bg-slate-800 overflow-hidden transition-colors">
                                            <Image
                                                src={guide.avatar}
                                                alt={`${guide.name} — local Himalayan trek guide`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-sans uppercase tracking-widest text-slate-400 mb-1 font-semibold">
                                                Native Guide
                                            </div>
                                            <h2 className="font-display text-2xl font-normal text-white group-hover:text-yellow-400 transition-colors leading-tight">
                                                {guide.name}
                                            </h2>
                                            {guide.reviews && guide.reviews > 0 && (
                                                <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-sans mt-1">
                                                    <Star className="w-3.5 h-3.5 fill-current" />
                                                    <span className="font-semibold text-white">{guide.rating}</span>
                                                    <span className="text-slate-400">({guide.reviews} reviews)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed mb-4 line-clamp-3">
                                        {guide.description}
                                    </p>

                                    {/* Meta */}
                                    <div className="space-y-2 pt-4 border-t border-slate-700/60 text-xs font-sans text-slate-400">
                                        {guide.experience && (
                                            <div className="flex items-center gap-2">
                                                <Award className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                                <span className="text-slate-200">{guide.experience} Experience</span>
                                            </div>
                                        )}
                                        {guide.languages.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <MessageCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>Speaks {guide.languages.join(', ')}</span>
                                            </div>
                                        )}
                                        {guidetreks.length > 0 && (
                                            <div className="pt-2 flex flex-wrap gap-1.5">
                                                {guidetreks.map((t) => (
                                                    <span
                                                        key={t.slug}
                                                        className="inline-block text-[10px] bg-slate-700/60 border border-slate-600 text-slate-300 px-2 py-0.5"
                                                    >
                                                        {t.title}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 text-xs font-sans uppercase tracking-wider text-yellow-400 font-semibold group-hover:underline">
                                        View Full Profile →
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </main>
        </>
    );
}

