import React from 'react';
import type { Trek } from '@/types/trek';
import { buildTrekFaqs } from '@/lib/trekFaqs';

const TrekFaq = ({ trek }: { trek: Trek }) => {
    const items = buildTrekFaqs(trek);
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    };

    return (
        <section id="faq" aria-labelledby="trek-faq-heading">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
            />
            <h2 id="trek-faq-heading" className="font-display text-3xl font-normal text-white mb-6 border-l-4 border-yellow-400 pl-4">
                Frequently Asked Questions
            </h2>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.q} className="border border-slate-700 bg-slate-800/50 p-5">
                        <h3 className="font-sans font-semibold text-white text-sm mb-2">{item.q}</h3>
                        <p className="font-sans text-slate-300 text-sm leading-relaxed">{item.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrekFaq;
