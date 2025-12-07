import React from 'react';
import { Heart, Globe, Users, Compass } from 'lucide-react';

const values = [
    {
        icon: <Users className="w-6 h-6 text-yellow-400" />,
        title: 'Authenticity',
        description: 'Real people, real stories, no scripts.'
    },
    {
        icon: <Heart className="w-6 h-6 text-yellow-400" />,
        title: 'Connection',
        description: 'Travel is about the people you meet.'
    },
    {
        icon: <Globe className="w-6 h-6 text-yellow-400" />,
        title: 'Respect',
        description: 'We honor local cultures and communities.'
    },
    {
        icon: <Compass className="w-6 h-6 text-yellow-400" />,
        title: 'Curiosity',
        description: 'Embrace the unknown with open minds.'
    }
];

const ValuesSection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-16 items-start">
                    {/* Text Side */}
                    <div className="w-full md:w-1/2 md:sticky md:top-24">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-px w-8 bg-yellow-400"></div>
                            <span className="text-yellow-400 uppercase tracking-widest text-sm font-medium">Our Values</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                            Guiding <br />
                            <span className="text-gray-500">Principles</span>
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-md">
                            These core values shape every experience we curate and every connection we facilitate.
                        </p>
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-1/2">
                        {/* Mobile View: Minimalist List */}
                        <div className="flex flex-col space-y-12 md:hidden">
                            {values.map((value, index) => (
                                <div key={index} className="flex gap-6 items-start group">
                                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-2xl bg-slate-800 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all duration-300 shadow-lg shadow-black/20">
                                        {React.cloneElement(value.icon as React.ReactElement, { className: "w-6 h-6" })}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">{value.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Cards Grid */}
                        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {values.map((value, index) => (
                                <div key={index} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-yellow-400/30 transition-colors duration-300 group">
                                    <div className="bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-slate-800 group-hover:border-yellow-400/50 transition-colors duration-300">
                                        {React.cloneElement(value.icon as React.ReactElement, { className: "w-6 h-6 group-hover:text-yellow-400 transition-colors duration-300" })}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;
