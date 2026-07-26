import React from 'react';
import { NextSeo } from 'next-seo';
import AboutPage from '../src/components/templates/AboutPage';

export default function About() {
    return (
        <>
            <NextSeo 
                title="About Us"
                description="Learn about Uncharted Travel's mission to connect adventurers with expert local guides and authentic Himalayan experiences."
                canonical="https://unchartedtravel.in/about"
            />
            <AboutPage />
        </>
    );
}
