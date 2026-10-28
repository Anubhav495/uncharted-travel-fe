import React from 'react';
import Image from 'next/image';
import { Star, Award, MessageCircle, User, ArrowRight } from 'lucide-react';
import { Guide } from '@/types/trek';

interface GuideCardProps {
    guide: Guide;
    onBook?: (id: string, name: string, type: 'guide' | 'company') => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, onBook }) => {
    const [rating, setRating] = React.useState(guide.rating || 0);
    const [reviewCount, setReviewCount] = React.useState(guide.reviews || 0);

    React.useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await fetch(`/api/providerRating?id=${encodeURIComponent(guide.id)}&type=guide`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.count > 0) {
                        setRating(Number(data.average.toFixed(1)));
                        setReviewCount(data.count);
                    }
                }
            } catch (err) {
                console.error('Error fetching guide rating:', err);
            }
        };

        if (guide.id) {
            fetchRating();
        }
    }, [guide.id]);

    return (
        <div className="border border-slate-700 bg-slate-800/50 hover:border-yellow-400/50 p-6 sm:p-7 transition-all duration-200 group h-full flex flex-col justify-between shadow-xl">
            <div>
                {/* Header: Avatar + Name + Rating */}
                <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-16 h-16 shrink-0 border-2 border-slate-600 group-hover:border-yellow-400 bg-slate-800 overflow-hidden shadow-md transition-colors">
                        {guide.avatar ? (
                            <Image
                                src={guide.avatar}
                                alt={guide.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-slate-800">
                                <User className="h-7 w-7 text-slate-400" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-[10px] font-sans uppercase tracking-widest text-slate-400 mb-1 font-semibold">
                            Native Guide
                        </div>
                        <h3 className="font-display text-2xl font-normal text-white group-hover:text-yellow-400 transition-colors leading-tight">
                            {guide.name}
                        </h3>
                        {reviewCount > 0 ? (
                            <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-sans mt-1">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="font-semibold text-white">{rating}</span>
                                <span className="text-slate-400">({reviewCount} reviews)</span>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 font-sans mt-1">First-generation guide</p>
                        )}
                    </div>
                </div>

                {/* Guide Description */}
                <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed mb-6 font-normal">
                    {guide.description}
                </p>
            </div>

            <div>
                {/* Meta Attributes: Experience & Languages */}
                {(guide.experience || guide.languages.length > 0) && (
                    <div className="space-y-2.5 pt-4 border-t border-slate-700/60 text-xs font-sans text-slate-400">
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
                    </div>
                )}

                {/* Request This Guide Button */}
                {onBook && (
                    <button
                        type="button"
                        onClick={() => onBook(guide.id, guide.name, 'guide')}
                        className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-3 px-5 text-xs uppercase tracking-widest font-sans font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Request This Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GuideCard;
