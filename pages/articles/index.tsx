import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NextSeo, BreadcrumbJsonLd } from 'next-seo';
import { Calendar, ArrowRight, User, Tag } from 'lucide-react';
import { articles, Article } from '@/data/articles';

const CATEGORIES = ['All', 'Guide', 'Comparison', 'Planning', 'Seasonal'] as const;
type Category = typeof CATEGORIES[number];

export default function ArticlesIndexPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');

    const filteredArticles = useMemo(() => {
        if (selectedCategory === 'All') return articles;
        return articles.filter((a) => a.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <>
            <NextSeo
                title="Himalayan Trekking Guides &amp; Route Reports"
                description="Comprehensive Himalayan trekking guides, cost breakdowns, difficulty analysis, and local itineraries written from firsthand mountain expertise."
                canonical="https://unchartedtravel.in/articles"
                openGraph={{
                    title: 'Himalayan Trekking Guides & Route Reports | Uncharted Travel',
                    description: 'Direct guides, honest costs, and local insights for trekking in Himachal and Uttarakhand.',
                    url: 'https://unchartedtravel.in/articles',
                }}
            />
            <BreadcrumbJsonLd
                itemListElements={[
                    { position: 1, name: 'Home', item: 'https://unchartedtravel.in/' },
                    { position: 2, name: 'Articles', item: 'https://unchartedtravel.in/articles' },
                ]}
            />

            <main className="bg-slate-900 min-h-screen pb-24 text-white">
                {/* Hero Header */}
                <section className="pt-28 pb-14 px-6 border-b border-slate-800">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-block text-xs font-sans uppercase tracking-widest text-yellow-400 font-semibold mb-3">
                            Firsthand Mountain Knowledge
                        </span>
                        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal text-white mb-4 leading-tight tracking-tight">
                            Himalayan Trekking <span className="italic text-yellow-400">Guides</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto font-sans text-sm sm:text-base leading-relaxed">
                            Cost breakdowns, route comparisons, altitude guides, and practical preparation for treks across Himachal Pradesh and Uttarakhand — written directly from verified local trail data.
                        </p>
                    </div>
                </section>

                {/* Category Filters */}
                <section className="max-w-6xl mx-auto px-6 mt-10">
                    <div className="flex flex-wrap items-center justify-center gap-2 border border-slate-800 bg-slate-800/40 p-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-xs font-sans uppercase tracking-wider transition-all font-semibold ${
                                    selectedCategory === cat
                                        ? 'bg-yellow-400 text-slate-900 font-bold shadow-md'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Articles Grid */}
                <section className="max-w-6xl mx-auto px-6 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article: Article) => (
                            <article
                                key={article.slug}
                                className="group flex flex-col justify-between border border-slate-700 bg-slate-800/70 hover:border-yellow-400/50 p-7 transition-all duration-200 shadow-xl"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 text-[10px] font-sans uppercase tracking-widest text-slate-400 mb-3">
                                        <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                                            <Tag className="w-3 h-3" />
                                            {article.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {article.updatedDate}
                                        </span>
                                    </div>

                                    <h2 className="font-display text-2xl font-normal text-white group-hover:text-yellow-400 transition-colors leading-snug mb-3">
                                        <Link href={`/articles/${article.slug}`}>
                                            {article.title}
                                        </Link>
                                    </h2>

                                    <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed mb-6 font-normal">
                                        {article.excerpt}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-sans">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <User className="w-3.5 h-3.5 text-yellow-400" />
                                        <span>{article.guideAuthor}</span>
                                    </div>
                                    <Link
                                        href={`/articles/${article.slug}`}
                                        className="inline-flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-semibold group-hover:translate-x-1 transition-transform"
                                    >
                                        <span>Read</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}
