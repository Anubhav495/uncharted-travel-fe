import React from 'react';
import Link from 'next/link';
import GuideRegistrationWizard from '../../src/components/forms/guide-registration/GuideRegistrationWizard';

const RegisterGuidePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white relative overflow-x-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />



            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 pb-12" style={{ paddingTop: '120px' }}>
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Join our Community of Guides</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Share your passion, earn on your terms, and meet travelers from around the world.
                    </p>
                </div>

                <GuideRegistrationWizard />
            </main>
        </div>
    );
};

export default RegisterGuidePage;
