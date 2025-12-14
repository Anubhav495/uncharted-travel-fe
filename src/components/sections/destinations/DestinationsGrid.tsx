import React, { useState } from 'react';
import TrekCard from '@/components/ui/TrekCard';
import { treks, Trek } from '@/data/treks';

const categories = ['All', 'Expedition', 'Trekking', 'Cultural', 'Relaxed'];

import BookingModal, { BookingFormData } from '@/components/modals/booking/BookingModal';
import { useToast } from '@/context/ToastContext';

const DestinationsGrid: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Booking Modal State
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedTrek, setSelectedTrek] = useState<{ id: string; title: string } | null>(null);
    const { showToast } = useToast();

    const filteredTreks = activeCategory === 'All'
        ? treks
        : treks.filter(trek => trek.category === activeCategory);

    const handleBook = (id: string, title: string) => {
        setSelectedTrek({ id, title });
        setIsBookingModalOpen(true);
    };

    const handleBookingSubmit = async (data: BookingFormData): Promise<boolean> => {
        if (!selectedTrek) return false;

        try {
            const response = await fetch('/api/submitBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    trekTitle: selectedTrek.title,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Submission failed:', errorData);
                showToast('Something went wrong. Please try again in sometime.', 'error');
                return false;
            }

            console.log('Booking submitted successfully');
            // Modal handles local success state (view switching)
            return true;
        } catch (error) {
            console.error('Submission error:', error);
            showToast('Something went wrong. Please try again in sometime.', 'error');
            return false;
        }
    };

    // Intersection Observer for Mobile Scroll
    React.useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // The card id is stored in a data attribute
                        const id = entry.target.getAttribute('data-id');
                        setActiveCardId(id);
                    }
                });
            },
            {
                root: container,
                threshold: 0.7, // Trigger when 70% of the card is visible
            }
        );

        const cards = container.querySelectorAll('.trek-card-wrapper');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [filteredTreks]);

    return (
        <section className="py-12 md:py-20 bg-slate-900 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Filter Bar */}
                <div className="relative mb-12 -mx-4 px-4 py-4 bg-transparent border-b border-white/5 md:mx-0 md:px-0 md:border-none">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`
                                    px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0
                                    ${activeCategory === category
                                        ? 'bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/20 scale-105'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                                    }
                                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Carousel */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:pb-0 md:mx-0 md:px-0 scrollbar-hide"
                >
                    {filteredTreks.map((trek) => (
                        <div
                            key={trek.id}
                            data-id={trek.id}
                            className="trek-card-wrapper min-w-[85vw] snap-center md:min-w-0"
                        >
                            <TrekCard
                                trek={trek}
                                isActive={trek.id === activeCardId}
                                onBook={handleBook}
                            />
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTreks.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-lg">No treks found in this category.</p>
                        <button
                            onClick={() => setActiveCategory('All')}
                            className="mt-4 text-yellow-400 hover:underline"
                        >
                            View all treks
                        </button>
                    </div>
                )}
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                trekTitle={selectedTrek?.title || ''}
                onSubmit={handleBookingSubmit}
            />
        </section>
    );
};

export default DestinationsGrid;
