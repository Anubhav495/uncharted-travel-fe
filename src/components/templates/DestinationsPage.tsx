import React from 'react';
import { useRouter } from 'next/router';
import DestinationsHero from '@/components/sections/destinations/DestinationsHero';
import MobileDestinationsHero from '@/components/sections/destinations/MobileDestinationsHero';
import DestinationsGrid from '@/components/sections/destinations/DestinationsGrid';
import { resolveMobileCatalogueView } from '@/components/sections/destinations/mobileCatalogueView';

const DestinationsPage: React.FC = () => {
    const router = useRouter();
    const mobileView = resolveMobileCatalogueView(router.query.view);

    return (
        <div className="bg-black min-h-screen">
            <main>
                {mobileView && <MobileDestinationsHero />}
                <div className={mobileView ? 'hidden md:block' : undefined}>
                    <DestinationsHero />
                </div>
                <DestinationsGrid mobileView={mobileView} />
            </main>
        </div>
    );
};

export default DestinationsPage;
