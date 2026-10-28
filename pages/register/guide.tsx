import React from 'react';
import GuideRegistrationWizard from '../../src/components/forms/guide-registration/GuideRegistrationWizard';

const RegisterGuidePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white relative overflow-x-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 pb-16 pt-28 lg:pt-40">
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-sans uppercase tracking-widest text-yellow-400 font-semibold mb-3">
                        Local Mountain Experts
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal mb-4 tracking-tight text-white">
                        Join our Community of <span className="italic text-yellow-400">Guides</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base font-sans leading-relaxed">
                        Share your passion, earn on your terms, and meet travelers from around the world.
                    </p>
                </div>

                <GuideRegistrationWizard />
            </main>
        </div>
    );
};

export default RegisterGuidePage;
