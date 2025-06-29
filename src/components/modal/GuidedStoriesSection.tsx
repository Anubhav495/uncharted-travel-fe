import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GuideStoriesSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const foundingGuides = [
        {
            name: 'Marco Rossi',
            location: 'Rome, Italy',
            specialty: 'Ancient Roman History',
            quote: 'I don’t just show you ruins; I help you see the bustling city that once stood here. To me, every stone tells a story.',
            tags: ['History', 'Architecture', 'Storytelling'],
            imageUrl: 'https://picsum.photos/seed/guide1/800/600',
        },
        {
            name: 'Amélie Dubois',
            location: 'Paris, France',
            specialty: 'Le Marais Culinary Scene',
            quote: 'The best way to understand Paris is through its food. I love revealing the hidden bakeries and markets only locals know.',
            tags: ['Foodie', 'Culture', 'Local Life'],
            imageUrl: 'https://picsum.photos/seed/guide2/800/600',
        },
        {
            name: 'Kenji Tanaka',
            location: 'Kyoto, Japan',
            specialty: 'Zen Gardens & Philosophy',
            quote: 'Guiding is my meditation. I help travelers find the quiet beauty and deep philosophy hidden in Kyoto’s incredible gardens.',
            tags: ['Zen', 'Nature', 'Photography'],
            imageUrl: 'https://picsum.photos/seed/guide3/800/600',
        },
        {
            name: 'Sofia Reyes',
            location: 'Mexico City, Mexico',
            specialty: 'Street Art & Murals',
            quote: 'Every mural has a voice and a history. I help you listen to the vibrant, colorful stories painted on the walls of my city.',
            tags: ['Art', 'Street Art', 'Urban'],
            imageUrl: 'https://picsum.photos/seed/guide4/800/600',
        },
    ];

    const goToPrevious = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? foundingGuides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, foundingGuides.length]);

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === foundingGuides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, foundingGuides.length]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            goToNext();
        }, 4000);
        return () => {
            clearInterval(timer);
        };
    }, [isPaused, currentIndex, goToNext]);


    const getCardStyle = (index: number) => {
        const total = foundingGuides.length;
        const prevIndex = (currentIndex - 1 + total) % total;
        const nextIndex = (currentIndex + 1) % total;
        let styles = 'absolute top-0 w-full max-w-md transform transition-all duration-500';

        if (index === currentIndex) {
            styles += ' scale-100 opacity-100 z-20';
        } else if (index === prevIndex) {
            styles += ' translate-x-[-40%] scale-95 opacity-60 z-10';
        } else if (index === nextIndex) {
            styles += ' translate-x-[40%] scale-95 opacity-60 z-10';
        } else {
            styles += ' scale-90 opacity-0 z-0';
        }
        return styles;
    };

    return (
        <section className="relative py-20 overflow-hidden" id="stories">
            <div className="container mx-auto text-center px-4">
                <span className="inline-block bg-sky-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                    Real Local Experts
                </span>
                <h2 className="text-4xl font-bold mb-4 text-white">Stories From Our Founding <span className="text-yellow-400">Guides</span></h2>
                <p className="text-lg text-gray-200 mb-12 max-w-2xl mx-auto">
                    Meet some of the passionate storytellers, historians, and artists ready to make your next trip unforgettable.
                </p>
            </div>
            
            <div 
                className="relative h-[550px]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    {foundingGuides.map((guide, index) => (
                        <div key={index} className={getCardStyle(index)}>
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[500px] flex flex-col">
                                <div className="relative h-56">
                                    <img src={guide.imageUrl} alt={`Photo of ${guide.name}`} className="absolute h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                                        <h3 className="text-white text-xl font-bold">{guide.specialty}</h3>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <p className="text-sm font-semibold text-blue-600">{guide.name} - {guide.location}</p>
                                    <p className="text-gray-600 my-4 italic text-sm">"{guide.quote}"</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {guide.tags.map(tag => (
                                            <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                    <a href="#" className="font-semibold text-blue-700 hover:underline text-sm mt-auto">
                                        View Profile &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={goToPrevious} className="absolute left-4 md:left-16 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition" aria-label="Previous Guide">
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button onClick={goToNext} className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition" aria-label="Next Guide">
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30">
                    {foundingGuides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-blue-600 w-5 h-2' : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'}`}
                            aria-label={`Go to guide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GuideStoriesSection;