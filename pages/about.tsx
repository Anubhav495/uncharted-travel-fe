import React from 'react';
import AboutPage from '../src/components/templates/AboutPage';

interface AboutProps {
    onJoinWaitlist: () => void;
}

export default function About({ onJoinWaitlist }: AboutProps) {
    return <AboutPage onJoinWaitlist={onJoinWaitlist} />;
}
