import React from 'react';
import HeroSection from './sections/HeroSection.tsx';
import WhyUsSection from './sections/WhyUsSection.tsx';
import GuideStoriesSection from './sections/GuideStoriesSection.tsx';
import ReviewsSection from './sections/ReviewsSection.tsx';
import HowItWorksSection from './sections/HowItWorksSection.tsx';

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