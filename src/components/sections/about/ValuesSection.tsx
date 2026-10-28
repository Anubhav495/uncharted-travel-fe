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
        <section className="py-24 md:py-32 bg-black text-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div>
                            <div className="flex items-center space-x-3 mb-3">
                                <span className="text-xs uppercase tracking-wider text-white/50 font-sans font-medium">
                                    Our Values
                                </span>
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                                Guiding <span className="italic text-white/90">Principles</span>
                            </h2>
                        </div>
                        <p className="text-sm text-white/60 max-w-sm font-sans leading-relaxed">
                            These core values shape every experience we curate and every connection we facilitate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val) => {
                            const Icon = val.icon;
                            return (
                                <div
                                    key={val.title}
                                    className="border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col justify-between hover:border-white/25 hover:bg-white/[0.04] transition duration-200"
                                >
                                    <div>
                                        <div className="h-9 w-9 border border-white/15 bg-white/[0.03] flex items-center justify-center text-white mb-6">
                                            <Icon className="w-4 h-4 text-white/80" />
                                        </div>

                                        <h3 className="font-display text-2xl font-normal text-white mb-3">
                                            {val.title}
                                        </h3>
                                        <p className="text-sm text-white/55 leading-relaxed font-sans">
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
