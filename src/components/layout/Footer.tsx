import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HowItWorksSection from '@/components/sections/home/HowItWorksSection';
import FooterLandscape from '@/components/layout/FooterLandscape';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
    href,
    children,
}) => {
    return (
        <li>
            <Link
                href={href}
                className="text-xs text-white/55 hover:text-white transition-colors duration-150 block font-sans"
            >
                {children}
            </Link>
        </li>
    );
};

const FooterSectionLink: React.FC<{ targetId: string; children: React.ReactNode }> = ({
    targetId,
    children
}) => {
    const router = useRouter();

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (router.pathname !== '/') {
            await router.push(`/#${targetId}`);
            return;
        }

        const target = document.getElementById(targetId);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <li>
            <a
                href={`/#${targetId}`}
                className="text-xs text-white/55 hover:text-white transition-colors duration-150 block font-sans"
                onClick={handleClick}
            >
                {children}
            </a>
        </li>
    );
};

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 text-white relative isolate">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-full h-24 sm:h-32 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"
            />
            <FooterLandscape />
            <div className="container mx-auto px-6 md:px-12 py-8 md:py-12 relative z-10">
                <HowItWorksSection />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 md:gap-x-12 md:gap-y-8 mb-8 md:mb-10">
                    <div className="order-1">
                        <h3 className="text-xs font-sans uppercase tracking-wider text-slate-300 mb-3 font-semibold">
                            Platform
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterSectionLink targetId="why-us">Why Us</FooterSectionLink>
                        </ul>
                    </div>

                    <div className="order-3 lg:order-2">
                        <h3 className="text-xs font-sans uppercase tracking-wider text-slate-300 mb-3 font-semibold">
                            Company
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink href="/about">About Us</FooterLink>
                        </ul>
                    </div>

                    <div className="order-2 lg:order-3">
                        <h3 className="text-xs font-sans uppercase tracking-wider text-slate-300 mb-3 font-semibold">
                            Community
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink href="/become-a-guide">Become a Guide</FooterLink>
                        </ul>
                    </div>

                    <div className="order-4 min-w-0">
                        <h3 className="text-xs font-sans uppercase tracking-wider text-slate-300 mb-3 font-semibold">
                            Get in Touch
                        </h3>
                        <ul className="space-y-2 break-words">
                            <FooterLink href="mailto:hello@unchartedtravel.com">
                                hello@unchartedtravel.com
                            </FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="pt-5 sm:pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <img
                            src="/assets/brand-logo.png"
                            alt="UnchartedTravel Logo"
                            className="h-8 w-8 shrink-0 object-contain"
                        />
                        <span className="font-display text-2xl tracking-tight text-white">
                            UnchartedTravel
                        </span>
                    </Link>
                    <p className="text-xs font-sans text-slate-500 text-center sm:text-right">
                        &copy; {currentYear} UnchartedTravel. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
