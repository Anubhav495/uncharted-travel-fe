import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

interface CustomerReview {
    name: string;
    avatarUrl: string;
    rating: number;
    tour: string;
    quote: string;
    profession?: string;
    date: string;
}

const customerReviews: CustomerReview[] = [
    {
        name: 'Vivek Verma',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        tour: 'Kareri Glacial Lake',
        quote: 'The alpine stillness of Kareri is impossible to capture in photos. Hiking with Aatish felt like walking through centuries of unwritten mountain heritage.',
        profession: 'Software Architect',
        date: 'Autumn Traverse',
    },
    {
        name: 'Pranjal Gupta',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        tour: 'Sar Pass High Traverse',
        quote: 'Crossing the snow ridges at 13,800 ft under Kapil’s watchful guidance was transcendent. Zero tourist rush. Just wind, ice, and absolute focus.',
        profession: 'Chartered Accountant',
        date: 'Early Summer',
    },
    {
        name: 'Nidhi Tripathi',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        tour: 'Kheerganga Hot Springs',
        quote: 'Pritam shared the mythologies of every stream we crossed. Reaching the steaming mineral pools after hours in the pinewood was pure medicine.',
        profession: 'Educator & Writer',
        date: 'Spring Equinox',
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-white/45 mb-3 font-sans font-medium">
                            Field Journals &middot; Verified Expeditions
                        </p>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                            Chronicles of <span className="italic text-white/90">the Traverse.</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 bg-white/[0.02]">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono uppercase tracking-wider text-white/70">
                            100% Verified Field Explorers
                        </span>
                    </div>
                </div>

                {/* Editorial Reviews Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {customerReviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col justify-between hover:border-white/20 hover:bg-white/[0.03] transition duration-200 relative group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-1 text-white/90">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 border border-white/[0.08] px-2 py-0.5">
                                        {review.date}
                                    </span>
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
                                        <p className="text-[11px] font-mono text-white/45 uppercase tracking-wider">
                                            {review.profession}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-[10px] px-2 py-1 border border-white/10 text-white/60 font-mono uppercase tracking-wider bg-black/40">
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
