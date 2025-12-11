import React from 'react';
import Head from 'next/head';
import DestinationsPageTemplate from '@/components/templates/DestinationsPage';

const Destinations = () => {
    return (
        <>
            <Head>
                <title>Destinations | UnchartedTravel</title>
                <meta name="description" content="Explore our curated collection of authentic trekking expeditions in the Himalayas." />
            </Head>
            <DestinationsPageTemplate />
        </>
    );
};

export default Destinations;
