import React from 'react';
import HeroSection from '../sections/home/HeroSection';
import WhyUsSection from '../sections/home/WhyUsSection';
import GuideStoriesSection from '../sections/home/GuideStoriesSection';
import ReviewsSection from '../sections/home/ReviewsSection';
import HowItWorksSection from '../sections/home/HowItWorksSection';

interface HomePageProps {
    onJoinWaitlist: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onJoinWaitlist }) => {
    return (
        <main>
            <HeroSection onJoinWaitlist={onJoinWaitlist} />
            <WhyUsSection />
            <GuideStoriesSection />
            <ReviewsSection />
            <HowItWorksSection />
        </main>
    );
};

export default HomePage;