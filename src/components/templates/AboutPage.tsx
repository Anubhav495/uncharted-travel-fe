import React from 'react';
import AboutHero from '../sections/about/AboutHero';
import MissionSection from '../sections/about/MissionSection';
import StorySection from '../sections/about/StorySection';
import ValuesSection from '../sections/about/ValuesSection';

interface AboutPageProps {
    onJoinWaitlist: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onJoinWaitlist }) => {
    return (
        <main className="bg-slate-900 min-h-screen">
            <AboutHero />
            <MissionSection />
            <StorySection />
            <ValuesSection />
            {/* We can reuse the CTA section from home or a simplified version if needed, 
                but for now let's keep it focused on the story. 
                Maybe add a simple "Ready to explore?" CTA at the bottom later. */}
        </main>
    );
};

export default AboutPage;
