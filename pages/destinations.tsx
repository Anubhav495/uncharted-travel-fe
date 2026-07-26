import React from 'react';
import { NextSeo } from 'next-seo';
import DestinationsPageTemplate from '@/components/templates/DestinationsPage';

const Destinations = () => {
    return (
        <>
            <NextSeo 
                title="Himalayan Treks & Destinations"
                description="Explore our curated collection of Himalayan treks. From the moderate Kareri Lake to the challenging Rupin Pass, find your perfect mountain adventure."
                canonical="https://unchartedtravel.in/destinations"
            />
            <DestinationsPageTemplate />
        </>
    );
};

export default Destinations;
