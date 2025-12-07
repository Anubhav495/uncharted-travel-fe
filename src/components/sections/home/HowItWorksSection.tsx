import React from 'react';
import brandLogo from '../../assets/brand-logo.png';

const HowItWorksSection: React.FC = () => {
    return (
        // The outer section now has a solid, premium dark color.
        <section
            className="py-6 md:py-20 px-4 bg-slate-900 text-white"
            id="how-it-works"
        >
            {/* The layout is constrained for a more focused, elegant look. */}
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                    <span className="text-yellow-400">Find</span> Your Perfect Guide
                </h2>

                <p className="text-sm md:text-lg text-gray-300 mb-4 md:mb-12">
                    Browse profiles, read reviews, and find the local expert who will make your trip unforgettable.
                </p>

                <div className="inline-block bg-amber-400 p-4 md:p-8 rounded-xl shadow-xl">
                    <img
                        src="/assets/brand-logo.png"
                        alt="UnchartedTravel Stag Logo"
                        className="h-12 md:h-24 w-auto"
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;