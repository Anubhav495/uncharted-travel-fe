import React from 'react';

const AboutHero: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-slate-900 text-white pt-32 pb-20">
            <div className="container mx-auto px-4 text-center">
                <p className="text-yellow-400 uppercase tracking-widest text-sm font-medium mb-8">
                    Our Philosophy
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto mb-12">
                    From <span className="text-gray-500">logic</span> comes life, and the chain begins to breathe — alive with <span className="text-yellow-400">connections</span> that learn, adapt, and act.
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    We believe the best way to see a city is through the eyes of the people who call it home.
                </p>
            </div>
        </section>
    );
};

export default AboutHero;
