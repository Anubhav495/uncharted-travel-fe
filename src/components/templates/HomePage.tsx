import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '../sections/home/HeroSection';
import WhyUsSection from '../sections/home/WhyUsSection';
import GuideStoriesSection from '../sections/home/GuideStoriesSection';
import ReviewsSection from '../sections/home/ReviewsSection';
import HowItWorksSection from '../sections/home/HowItWorksSection';

const HimalayanMapSection = dynamic(
    () => import('../sections/home/HimalayanMapSection'),
    { ssr: false }
);

interface HomePageProps { }

const HomePage: React.FC<HomePageProps> = () => {
    return (
        <main>
            <HeroSection />
            <WhyUsSection />
            <HimalayanMapSection />
            <GuideStoriesSection />
            <ReviewsSection />
            <HowItWorksSection />
        </main>
    );
};

export default HomePage;