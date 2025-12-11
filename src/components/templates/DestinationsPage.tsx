import React from 'react';
import DestinationsHero from '@/components/sections/destinations/DestinationsHero';
import DestinationsGrid from '@/components/sections/destinations/DestinationsGrid';

const DestinationsPage: React.FC = () => {
    return (
        <div className="bg-slate-900 min-h-screen">
            <main>
                <DestinationsHero />
                <DestinationsGrid />
            </main>
        </div>
    );
};

export default DestinationsPage;
