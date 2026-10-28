import React from 'react';
import { Heart, Globe, Users, Compass } from 'lucide-react';

const values = [
    {
        icon: Users,
        title: 'Local Empowerment',
        description: 'We connect you directly with local guides, ensuring the community benefits from every trek.'
    },
    {
        icon: Heart,
        title: 'Safe Adventures',
        description: 'Every guide is thoroughly vetted for their expertise in high-altitude environments.'
    },
    {
        icon: Globe,
        title: 'Sustainability',
        description: 'We adhere strictly to leave-no-trace policies to preserve the Himalayas.'
    },
    {
        icon: Compass,
        title: 'Curiosity',
        description: 'Embrace the unknown and learn the untaught stories of the mountains.'
    }
];

const ValuesSection: React.FC = () => {
    return (
        <section className="py-24 md:py-32 bg-slate-900 text-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div>
                            <div className="flex items-center space-x-3 mb-3">
                                <span className="text-xs uppercase tracking-widest text-yellow-400 font-sans font-semibold">
                                    Our Values
                                </span>
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                                Guiding <span className="italic text-yellow-400">Principles</span>
                            </h2>
                        </div>
                        <p className="text-sm text-slate-400 max-w-sm font-sans leading-relaxed">
                            These core values shape every experience we curate and every connection we facilitate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val) => {
                            const Icon = val.icon;
                            return (
                                <div
                                    key={val.title}
                                    className="border border-slate-700/80 bg-slate-800/60 p-8 flex flex-col justify-between hover:border-yellow-400/40 hover:bg-slate-800/90 transition duration-200 shadow-lg"
                                >
                                    <div>
                                        <div className="h-9 w-9 border border-slate-700 bg-slate-900/80 flex items-center justify-center text-yellow-400 mb-6">
                                            <Icon className="w-4 h-4 text-yellow-400" />
                                        </div>

                                        <h3 className="font-display text-2xl font-normal text-white mb-3">
                                            {val.title}
                                        </h3>
                                        <p className="text-sm text-slate-300 leading-relaxed font-sans">
                                            {val.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;
