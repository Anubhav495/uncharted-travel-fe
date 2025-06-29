import React from 'react';
import brandLogo from '../../assets/placeholder-app-mockup.png';

const HowItWorksSection: React.FC = () => {
    return (
        <section 
            className="py-16 sm:py-20 md:py-24 text-white bg-cover bg-center bg-fixed" 
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop)'
            }}
            id="how-it-works"
        >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/50" />
            
            <div className="relative container mx-auto px-4 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    <span className="text-yellow-400">Find</span> Your Perfect Guide
                </h2>
                
                <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                    Browse profiles, read reviews, and find the local expert who will make your trip unforgettable.
                </p>
                
                <div className="inline-block bg-amber-400 p-6 sm:p-8 rounded-xl shadow-xl">
                    <img 
                        src={brandLogo} 
                        alt="UnchartedTravel Logo" 
                        className="h-16 sm:h-20 md:h-24 w-auto"
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;