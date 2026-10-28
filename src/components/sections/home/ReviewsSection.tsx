import React from 'react';
import { Star } from 'lucide-react';

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
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        tour: 'Kareri Lake Trek',
        quote: 'The trek with Aatish was incredible. As someone new to high-altitude trekking, his knowledge of the trails and calm demeanor made all the difference. Can’t wait for my next trek with Uncharted!',
        profession: 'Software Engineer',
    },
    {
        name: 'Pranjal Gupta',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        tour: 'Hampta Pass Trek',
        quote: 'Kapil was more than just a guide; he was a mentor on the trail. The way he handled our group through the snow sections showed his years of experience. Truly an unforgettable journey.',
        profession: 'Finance Professional',
    },
    {
        name: 'Nidhi Tripathi',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        tour: 'Kheerganga Trek',
        quote: 'Such a beautiful trek, perfect for beginners. The hot springs at the top were the highlight for me. Would totally do it again with friends.',
        profession: 'Teacher',
    }
];

const ReviewsSection: React.FC = () => {
    return (
        <section
            className="border-t border-white/[0.08] px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-black relative text-white"
            id="reviews"
        >
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="max-w-2xl mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                        Hear From Our <span className="italic text-white/90">Travelers</span>
                    </h2>
                    <p className="text-sm text-white/60 mt-4 font-sans leading-relaxed">
                        Real experiences from trekkers who explored the Himalayas with our local guides.
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {customerReviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col justify-between hover:border-white/20 hover:bg-white/[0.03] transition duration-200"
                        >
                            <div>
                                <div className="flex items-center gap-1 text-white/90 mb-6">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-white text-white" />
                                    ))}
                                </div>

                                <p className="font-display text-xl font-normal italic text-white/85 leading-relaxed mb-8">
                                    "{review.quote}"
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={review.avatarUrl}
                                        alt={review.name}
                                        className="w-10 h-10 object-cover border border-white/20"
                                    />
                                    <div>
                                        <p className="text-sm font-sans font-medium text-white">{review.name}</p>
                                        <p className="text-xs font-sans text-white/50">
                                            {review.profession}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-xs px-2.5 py-1 border border-white/10 text-white/70 bg-white/[0.03] font-sans">
                                    {review.tour}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
