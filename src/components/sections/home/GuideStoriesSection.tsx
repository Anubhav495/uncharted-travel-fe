import React from 'react';
import { MapPin } from 'lucide-react';
import CardCarousel from '@/components/ui/CardCarousel';

interface GuideStory {
    name: string;
    location: string;
    quote: string;
    tags: string[];
    imageUrl: string;
    imageClassName: string;
}

const foundingGuides: GuideStory[] = [
    {
        name: 'Kapil Rawat',
        location: 'Sankri, Uttarakhand',
        quote: 'The mountains don\'t yield to us, we yield to them. I teach trekkers how to respectfully navigate these snowy peaks and return safely transformed.',
        tags: ['Mountaineering', 'Snow Treks', 'Safety Leader'],
        imageUrl: '/assets/kapil-rawat.jpeg',
        imageClassName: 'object-[50%_20%]',
    },
    {
        name: 'Pritam Negi',
        location: 'Parvati Valley, Himachal',
        quote: 'Every path in Parvati Valley holds a legend. I love guiding people to the hot springs while sharing the history of Lord Shiva\'s meditation here.',
        tags: ['Cultural History', 'Nature', 'Storytelling'],
        imageUrl: '/assets/pritam-photo-edited.png',
        imageClassName: 'object-[50%_12%]',
    },
    {
        name: 'Aatish',
        location: 'Dharamshala, Himachal',
        quote: 'I grew up in the Dhauladhar foothills. Guiding isn\'t my job; it\'s my way of sharing the spectacular glacial lakes and meadows with the world.',
        tags: ['Local Expert', 'Alpine Lakes', 'Photography'],
        imageUrl: '/assets/aatish-photo.jpeg',
        imageClassName: 'object-[50%_65%] sm:object-[50%_55%] md:object-[50%_80%]',
    }
];

const GuideStoriesSection: React.FC = () => {
    return (
        <section
            className="forest-background border-t border-slate-800 px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-20 md:py-28 relative text-white overflow-hidden"
            id="stories"
        >
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
                    <div>
                        <div className="inline-block border border-slate-700 px-2.5 py-0.5 bg-slate-800 text-[11px] font-sans uppercase tracking-wider text-yellow-400 font-semibold mb-2 sm:mb-3">
                            Real Local Experts
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
                            Stories From Our Founding <span className="italic text-yellow-400">Guides</span>
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-sm font-sans leading-relaxed">
                        They don't just guide treks — they grew up on these trails. Born in the mountains, built for adventure.
                    </p>
                </div>

                <CardCarousel
                    label="Founding guide stories"
                    interval={4000}
                    cardWidth="wide"
                    items={foundingGuides.map(guide => ({
                        id: guide.name,
                        label: guide.name,
                        content: (
                            <article className="w-full border border-slate-700 bg-slate-800/95 shadow-2xl overflow-hidden grid md:grid-cols-12 md:min-h-[440px]">
                                <div className="relative h-52 sm:h-72 md:h-auto md:col-span-5 overflow-hidden border-b md:border-b-0 md:border-r border-slate-700">
                                    <img
                                        src={guide.imageUrl}
                                        alt={guide.name}
                                        loading="lazy"
                                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${guide.imageClassName}`}
                                    />
                                </div>
                                <div className="md:col-span-7 p-4 sm:p-7 lg:p-10 flex flex-col justify-center">
                                    <div className="flex items-start gap-2 text-slate-300 text-xs font-sans mb-2 sm:mb-3">
                                        <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                        <span>{guide.location}</span>
                                    </div>
                                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-white mb-3 sm:mb-4">
                                        {guide.name}
                                    </h3>
                                    <blockquote className="border-l-2 border-yellow-400 pl-3 sm:pl-4 py-1 mb-4 sm:mb-6 font-display text-base sm:text-xl italic text-slate-100 leading-relaxed">
                                        "{guide.quote}"
                                    </blockquote>
                                    <div className="flex flex-wrap gap-1.5">
                                        {guide.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="text-[10px] sm:text-xs px-2.5 py-1 border border-slate-700 text-slate-300 bg-slate-900/50 font-sans"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ),
                    }))}
                />
            </div>
        </section>
    );
};

export default GuideStoriesSection;
