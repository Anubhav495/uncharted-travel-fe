import React from 'react';
import HeroSection from './sections/HeroSection';
import WhyUsSection from './sections/WhyUsSection';
import GuideStoriesSection from './sections/GuideStoriesSection';
import ReviewsSection from './sections/ReviewsSection';
import HowItWorksSection from './sections/HowItWorksSection';

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