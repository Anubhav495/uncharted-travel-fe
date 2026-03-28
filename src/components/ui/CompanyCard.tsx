import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Building, CalendarDays } from 'lucide-react';
import { Company } from '@/types/trek';
import ItineraryModal from '../modals/ItineraryModal';
import { supabase } from '@/lib/supabaseClient';

interface CompanyCardProps {
    company: Company;
    onBook?: (id: string, name: string, type: 'guide' | 'company') => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onBook }) => {
    const [isItineraryOpen, setIsItineraryOpen] = useState(false);
    const [rating, setRating] = useState(company.rating || 5.0);
    const [reviewCount, setReviewCount] = useState(company.reviews || 0);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('rating')
                    .eq('provider_id', company.id);

                if (!error && data && data.length > 0) {
                    const avg = data.reduce((acc, curr) => acc + curr.rating, 0) / data.length;
                    setRating(Number(avg.toFixed(1)));
                    setReviewCount((company.reviews || 0) + data.length);
                }
            } catch (err) {
                console.error('Error fetching company rating:', err);
            }
        };

        if (company.id) {
            fetchRating();
        }
    }, [company.id]);

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-yellow-400/50 transition-colors group h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-600 group-hover:border-yellow-400 transition-colors bg-slate-900 flex items-center justify-center">
                    {company.logo ? (
                        <Image
                            src={company.logo}
                            alt={company.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <Building className="w-8 h-8 text-slate-500" />
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{company.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{rating}</span>
                        {reviewCount > 0 && <span className="text-slate-500 text-xs ml-1">({reviewCount} reviews)</span>}
                    </div>
                </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                {company.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <CalendarDays className="w-4 h-4 text-yellow-400" />
                    <span>Established {company.establishedYear}</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-6">
                {company.itinerary && company.itinerary.length > 0 && (
                    <button
                        onClick={() => setIsItineraryOpen(true)}
                        className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 rounded-xl text-slate-300 text-sm font-bold transition-all duration-300 shadow-sm flex justify-center items-center"
                    >
                        View Itinerary & Meals
                    </button>
                )}
            </div>

            {company.itinerary && company.itinerary.length > 0 && (
                <ItineraryModal 
                    isOpen={isItineraryOpen} 
                    onClose={() => setIsItineraryOpen(false)} 
                    title={company.name}
                    itinerary={company.itinerary} 
                />
            )}
        </div>
    );
};

export default CompanyCard;
