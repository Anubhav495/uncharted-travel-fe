import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Building, CalendarDays, ArrowRight } from 'lucide-react';
import { Company } from '@/types/trek';
import ItineraryModal from '../modals/ItineraryModal';

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
                const response = await fetch(`/api/providerRating?id=${encodeURIComponent(company.id)}&type=company`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.count > 0) {
                        setRating(Number(data.average.toFixed(1)));
                        setReviewCount(data.count);
                    }
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
        <div className="border border-slate-700 bg-slate-800/50 hover:border-yellow-400/50 p-6 sm:p-7 transition-all duration-200 group h-full flex flex-col justify-between shadow-xl">
            <div>
                {/* Header: Logo + Name + Rating */}
                <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-16 h-16 shrink-0 border-2 border-slate-600 group-hover:border-yellow-400 bg-slate-800 overflow-hidden shadow-md flex items-center justify-center transition-colors">
                        {company.logo ? (
                            <Image
                                src={company.logo}
                                alt={company.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Building className="w-7 h-7 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <div className="text-[10px] font-sans uppercase tracking-widest text-slate-400 mb-1 font-semibold">
                            Trek Agency
                        </div>
                        <h3 className="font-display text-2xl font-normal text-white group-hover:text-yellow-400 transition-colors leading-tight">
                            {company.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-sans mt-1">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-semibold text-white">{rating}</span>
                            {reviewCount > 0 && (
                                <span className="text-slate-400">({reviewCount} reviews)</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Company Description */}
                <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed mb-6 font-normal">
                    {company.description}
                </p>
            </div>

            <div>
                {/* Established Year */}
                <div className="space-y-2.5 pt-4 border-t border-slate-700/60 text-xs font-sans text-slate-400">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span className="text-slate-200">Established {company.establishedYear}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2.5 mt-6">
                    {company.itinerary && company.itinerary.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setIsItineraryOpen(true)}
                            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white text-xs font-sans uppercase tracking-widest transition-all shadow-sm flex justify-center items-center cursor-pointer font-bold"
                        >
                            View Itinerary & Meals
                        </button>
                    )}
                    {onBook && (
                        <button
                            type="button"
                            onClick={() => onBook(company.id, company.name, 'company')}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-3 px-5 text-xs uppercase tracking-widest font-sans font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Request This Company</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
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
