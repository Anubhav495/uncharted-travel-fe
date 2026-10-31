import React from 'react';
import { Star } from 'lucide-react';
import CardCarousel from '@/components/ui/CardCarousel';

interface CustomerReview {
    name: string;
    avatarUrl: string;
    rating: number;
    tour: string;
    quote: string;
    profession?: string;
}

const customerReviews: CustomerReview[] = [
    {
        name: 'Vivek Verma',
        avatarUrl: 'https://picsum.photos/seed/vivek/100/100',
        rating: 5,
        tour: 'Kareri Lake Trek',
        quote: 'The trek with Aatish was incredible. As someone new to high-altitude trekking, his knowledge of the trails and calm demeanor made all the difference. Can’t wait for my next trek with Uncharted!',
        profession: 'Software Engineer',
    },
    {
        name: 'Pranjal Gupta',
        avatarUrl: 'https://picsum.photos/seed/pranjal/100/100',
        rating: 5,
        tour: 'Hampta Pass Trek',
        quote: 'Kapil was more than just a guide; he was a mentor on the trail. The way he handled our group through the snow sections showed his years of experience. Truly an unforgettable journey.',
        profession: 'Finance Professional',
    },
    {
        name: 'Nidhi Tripathi',
        avatarUrl: 'https://picsum.photos/seed/nidhi/100/100',
        rating: 5,
        tour: 'Kheerganga Trek',
        quote: 'Such a beautiful trek, perfect for beginners. The hot springs at the top were the highlight for me. Would totally do it again with friends.',
        profession: 'Teacher',
    }
];

const ReviewsSection: React.FC = () => {
    return (
        <section
            className="forest-background border-t border-slate-800 px-6 md:px-12 lg:px-20 py-24 md:py-32 relative text-white"
            id="reviews"
        >
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="max-w-2xl mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                        Hear From Our <span className="italic text-yellow-400">Travelers</span>
                    </h2>
                    <p className="text-sm text-slate-300 mt-4 font-sans leading-relaxed">
                        Real experiences from trekkers who explored the Himalayas with our local guides.
                    </p>
                </div>

                <CardCarousel
                    label="Traveler reviews"
                    interval={5000}
                    items={customerReviews.map(review => ({
                        id: review.name,
                        label: review.name,
                        content: (
                            <article
                                className="w-full border border-slate-700 bg-slate-800/95 p-4 sm:p-8 flex flex-col justify-between hover:border-yellow-400/40 transition duration-200 shadow-xl"
                            >
                                <div>
                                    <div className="flex items-center gap-1 mb-4 sm:mb-6">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>

                                    <p className="font-display text-base sm:text-xl font-normal italic text-slate-200 leading-relaxed mb-5 sm:mb-8">
                                        "{review.quote}"
                                    </p>
                                </div>

                                <div className="pt-4 sm:pt-6 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={review.avatarUrl}
                                            alt={review.name}
                                            loading="lazy"
                                            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 object-cover border border-slate-700"
                                        />
                                        <div>
                                            <p className="text-sm font-sans font-medium text-white">{review.name}</p>
                                            <p className="text-xs font-sans text-slate-400">
                                                {review.profession}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-xs px-2.5 py-1 border border-yellow-400/30 text-yellow-400 bg-yellow-400/10 font-sans font-semibold">
                                        {review.tour}
                                    </span>
                                </div>
                            </article>
                        ),
                    }))}
                />
            </div>
        </section>
    );
};

export default ReviewsSection;
