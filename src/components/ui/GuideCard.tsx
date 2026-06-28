import React from 'react';
import Image from 'next/image';
import { Star, Award, MessageCircle } from 'lucide-react';
import { Guide } from '@/types/trek';

interface GuideCardProps {
    guide: Guide;
    onBook?: (id: string, name: string, type: 'guide' | 'company') => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, onBook }) => {
    const [rating, setRating] = React.useState(guide.rating || 5.0);
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
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-yellow-400/50 transition-colors group h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-yellow-400 transition-colors">
                    <Image
                        src={guide.avatar}
                        alt={guide.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{guide.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{rating}</span>
                        <span className="text-slate-500 text-xs ml-1">({reviewCount} reviews)</span>
                    </div>
                </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                {guide.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>{guide.experience} Experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MessageCircle className="w-4 h-4 text-yellow-400" />
                    <span>Speaks {guide.languages.join(', ')}</span>
                </div>
            </div>

            {onBook && (
                <button
                    type="button"
                    onClick={() => onBook(guide.id, guide.name, 'guide')}
                    className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-yellow-300"
                >
                    Request This Guide
                </button>
            )}

        </div>
    );
};

export default GuideCard;
