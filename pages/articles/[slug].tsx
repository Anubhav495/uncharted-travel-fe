import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo, ArticleJsonLd, BreadcrumbJsonLd } from 'next-seo';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,

    User,
    Tag,



    Compass,
} from 'lucide-react';
import { articles, Article, getArticleBySlug } from '@/data/articles';
import { treks } from '@/data/treks';
import { Trek } from '@/types/trek';
import { getGuideByName, GuideProfile } from '@/data/guides';

interface ArticlePageProps {
    article: Article;
    relatedTreks: Trek[];
    guideAuthorProfile: GuideProfile | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = articles.map((a) => ({
        params: { slug: a.slug },
    }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({ params }) => {
    const slug = params?.slug as string;
    const article = getArticleBySlug(slug);

    if (!article) {
        return { notFound: true };
    }

    const relatedTreks = treks.filter((t) => article.trekSlugs.includes(t.slug));
    const guideAuthorProfile = getGuideByName(article.guideAuthor) || null;

    return {
        props: {
            article: JSON.parse(JSON.stringify(article)),
            relatedTreks: JSON.parse(JSON.stringify(relatedTreks)),
            guideAuthorProfile: guideAuthorProfile
                ? JSON.parse(JSON.stringify(guideAuthorProfile))
                : null,
        },
    };
};

export default function ArticleDetailPage({
    article,
    relatedTreks,
    guideAuthorProfile,
}: ArticlePageProps) {
    const canonicalUrl = `https://unchartedtravel.in/articles/${article.slug}`;

    // FAQ schema matching visible FAQ items
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    const firstTrekImage = relatedTreks[0]?.image
        ? `https://unchartedtravel.in${relatedTreks[0].image}`
        : 'https://unchartedtravel.in/assets/og-cover.jpg';

    return (
        <>
            <NextSeo
                title={article.title}
                description={article.excerpt}
                canonical={canonicalUrl}
                openGraph={{
                    title: `${article.title} | Uncharted Travel`,
                    description: article.excerpt,
                    url: canonicalUrl,
                    type: 'article',
                    article: {
                        publishedTime: article.publishedDate,
                        modifiedTime: article.updatedDate,
                        authors: [article.guideAuthor],
                        tags: [article.category, ...article.trekSlugs],
                    },
                    images: [
                        {
                            url: firstTrekImage,
                            alt: article.title,
                        },
                    ],
                }}
            />
            <BreadcrumbJsonLd
                itemListElements={[
                    { position: 1, name: 'Home', item: 'https://unchartedtravel.in/' },
                    { position: 2, name: 'Articles', item: 'https://unchartedtravel.in/articles' },
                    { position: 3, name: article.title, item: canonicalUrl },
                ]}
            />
            <ArticleJsonLd
                url={canonicalUrl}
                title={article.title}
                images={[firstTrekImage]}
                datePublished={article.publishedDate}
                dateModified={article.updatedDate}
                authorName={[article.guideAuthor]}
                publisherName="Uncharted Travel"
                publisherLogo="https://unchartedtravel.in/assets/brand-logo.png"
                description={article.excerpt}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <main className="bg-slate-900 min-h-screen pb-24 text-white">
                {/* Back to Articles link */}
                <div className="pt-28 pb-4 px-6 max-w-4xl mx-auto">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-slate-400 hover:text-yellow-400 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Articles
                    </Link>
                </div>

                {/* Article Header */}
                <header className="px-6 max-w-4xl mx-auto mt-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-sans uppercase tracking-wider text-slate-400 mb-4">
                        <span className="flex items-center gap-1.5 text-yellow-400 font-semibold bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1">
                            <Tag className="w-3 h-3" />
                            {article.category}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Last updated: {article.updatedDate}
                        </span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                        <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            By{' '}
                            {guideAuthorProfile ? (
                                <Link
                                    href={`/guides/${guideAuthorProfile.profileId}`}
                                    className="text-yellow-400 hover:underline font-semibold"
                                >
                                    {article.guideAuthor}
                                </Link>
                            ) : (
                                <span className="text-slate-200">{article.guideAuthor}</span>
                            )}
                        </span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-white leading-tight mb-8">
                        {article.title}
                    </h1>

                    {/* GEO: Direct Answer First Box */}
                    <div className="border-l-4 border-yellow-400 bg-slate-800/80 p-6 sm:p-7 shadow-xl mb-10">
                        <div className="text-[10px] font-sans uppercase tracking-widest text-yellow-400 font-semibold mb-2">
                            Direct Summary
                        </div>
                        <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-sans font-normal">
                            {article.excerpt}
                        </p>
                    </div>
                </header>

                <div className="px-6 max-w-4xl mx-auto space-y-12">
                    {/* Quick Facts Table */}
                    {article.facts && article.facts.length > 0 && (
                        <section aria-labelledby="quick-facts-heading">
                            <h2
                                id="quick-facts-heading"
                                className="font-display text-2xl font-normal text-white mb-4 border-l-4 border-yellow-400 pl-4"
                            >
                                Key Trip Facts
                            </h2>
                            <div className="border border-slate-700 bg-slate-800/60 overflow-hidden">
                                <dl className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-700">
                                    <div className="divide-y divide-slate-700/60">
                                        {article.facts
                                            .slice(0, Math.ceil(article.facts.length / 2))
                                            .map((fact) => (
                                                <div
                                                    key={fact.label}
                                                    className="flex justify-between items-center px-5 py-3 text-xs font-sans"
                                                >
                                                    <dt className="text-slate-400 font-medium">
                                                        {fact.label}
                                                    </dt>
                                                    <dd className="text-white font-semibold text-right">
                                                        {fact.value}
                                                    </dd>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="divide-y divide-slate-700/60">
                                        {article.facts
                                            .slice(Math.ceil(article.facts.length / 2))
                                            .map((fact) => (
                                                <div
                                                    key={fact.label}
                                                    className="flex justify-between items-center px-5 py-3 text-xs font-sans"
                                                >
                                                    <dt className="text-slate-400 font-medium">
                                                        {fact.label}
                                                    </dt>
                                                    <dd className="text-white font-semibold text-right">
                                                        {fact.value}
                                                    </dd>
                                                </div>
                                            ))}
                                    </div>
                                </dl>
                            </div>
                        </section>
                    )}

                    {/* Article Content Sections */}
                    <div className="space-y-10">
                        {article.sections.map((section) => (
                            <section key={section.heading} className="space-y-4">
                                <h2 className="font-display text-2xl sm:text-3xl font-normal text-white border-l-4 border-yellow-400 pl-4">
                                    {section.heading}
                                </h2>
                                <div className="space-y-4 text-slate-300 font-sans text-sm sm:text-base leading-relaxed">
                                    {section.body.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Relevant Treks Callout (Internal Linking) */}
                    {relatedTreks.length > 0 && (
                        <section className="border border-slate-700 bg-slate-800/70 p-6 sm:p-8">
                            <span className="text-xs font-sans uppercase tracking-widest text-yellow-400 font-semibold block mb-2">
                                Featured Expeditions
                            </span>
                            <h2 className="font-display text-2xl font-normal text-white mb-6">
                                Book or Explore Related Treks
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {relatedTreks.map((trek) => (
                                    <div
                                        key={trek.slug}
                                        className="border border-slate-700 bg-slate-900/80 p-4 flex flex-col justify-between"
                                    >
                                        <div>
                                            <h3 className="font-display text-lg text-white mb-1">
                                                {trek.title}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-sans mb-3">
                                                {trek.duration} · {trek.difficulty} ·{' '}
                                                <span className="text-yellow-400 font-semibold">
                                                    {trek.price}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Link
                                                href={`/destinations/${trek.slug}`}
                                                className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-sans text-xs uppercase tracking-wider font-bold px-3 py-2 transition-all"
                                            >
                                                <span>View Route</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                            {trek.gallery && trek.gallery.length > 0 && (
                                                <Link
                                                    href={`/destinations/${trek.slug}/gallery`}
                                                    className="inline-flex items-center gap-1 border border-slate-700 hover:border-slate-500 text-slate-300 px-3 py-2 text-xs font-sans uppercase tracking-wider transition-all"
                                                >
                                                    Gallery
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Author Guide Card if author is a verified guide */}
                    {guideAuthorProfile && (
                        <section className="border border-slate-700 bg-slate-800/60 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                            <div className="relative w-20 h-20 shrink-0 border border-slate-600 overflow-hidden">
                                <Image
                                    src={guideAuthorProfile.avatar}
                                    alt={`${guideAuthorProfile.name} — Himalayan guide`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <div className="text-[10px] font-sans uppercase tracking-widest text-yellow-400 font-semibold mb-1">
                                    About the Author &amp; Native Guide
                                </div>
                                <h3 className="font-display text-xl text-white mb-2">
                                    {guideAuthorProfile.name}
                                </h3>
                                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                                    {guideAuthorProfile.description}
                                </p>
                                <Link
                                    href={`/guides/${guideAuthorProfile.profileId}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-yellow-400 hover:underline font-semibold"
                                >
                                    <span>View {guideAuthorProfile.name}'s Profile &amp; Treks</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* Visible FAQ Section */}
                    {article.faqs && article.faqs.length > 0 && (
                        <section id="faq" className="space-y-4">
                            <h2 className="font-display text-2xl sm:text-3xl font-normal text-white border-l-4 border-yellow-400 pl-4 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {article.faqs.map((faq) => (
                                    <div
                                        key={faq.question}
                                        className="border border-slate-700 bg-slate-800/50 p-5"
                                    >
                                        <h3 className="font-sans font-semibold text-white text-sm mb-2">
                                            {faq.question}
                                        </h3>
                                        <p className="font-sans text-slate-300 text-sm leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Booking Call-To-Action (links to trek page, no duplicate form) */}
                    <section className="border border-yellow-400/20 bg-yellow-400/5 p-8 text-center mt-12">
                        <Compass className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                        <h2 className="font-display text-3xl font-normal text-white mb-3">
                            Ready to Trek the Himalayas?
                        </h2>
                        <p className="text-slate-400 font-sans text-sm mb-6 max-w-lg mx-auto">
                            Send an enquiry directly to our verified local guides. Zero booking
                            fees, honest local pricing, and personalised mountain itineraries.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/destinations"
                                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-3.5 px-7 text-xs uppercase tracking-widest font-sans font-bold transition-all shadow-lg"
                            >
                                <span>Browse All 10 Treks</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/guides"
                                className="inline-flex items-center gap-2 border border-slate-600 hover:border-yellow-400 text-slate-300 hover:text-yellow-400 py-3.5 px-7 text-xs uppercase tracking-widest font-sans font-semibold transition-all"
                            >
                                <span>Meet Local Guides</span>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
