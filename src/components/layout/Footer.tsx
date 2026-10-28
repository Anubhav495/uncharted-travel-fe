import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Mail, ArrowUpRight } from 'lucide-react';

const FooterLink: React.FC<{ href: string; children: React.ReactNode; isExternal?: boolean }> = ({
    href,
    children,
    isExternal = false
}) => {
    if (isExternal) {
        return (
            <li>
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/55 hover:text-white transition-colors duration-150 inline-flex items-center gap-1 font-sans"
                >
                    <span>{children}</span>
                    <ArrowUpRight className="w-3 h-3 text-white/30" />
                </a>
            </li>
        );
    }
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
        <footer className="bg-slate-950 text-white border-t border-slate-800 relative">
            <div className="container mx-auto px-6 md:px-12 py-16 md:py-20">
                {/* Upper Brand & Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
                            <img
                                src="/assets/brand-logo.png"
                                alt="UnchartedTravel Logo"
                                className="h-6 w-auto invert opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <span className="font-display text-2xl tracking-tight text-white">
                                UnchartedTravel
                            </span>
                        </Link>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm mb-6">
                            Authentic Himalayan treks and expeditions guided by vetted local experts. Discover personal, responsible journeys across the high Himalayas.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {/* Platform */}
                        <div>
                            <h4 className="text-xs font-sans uppercase tracking-wider text-slate-300 mb-4 font-semibold">
                                Platform
                            </h4>
                            <ul className="space-y-2.5">
                                <FooterLink href="/">Home</FooterLink>
                                <FooterLink href="/destinations">Destinations</FooterLink>
                                <FooterSectionLink targetId="why-us">Why Us</FooterSectionLink>
                                <FooterSectionLink targetId="stories">Guide Stories</FooterSectionLink>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-xs font-sans uppercase tracking-wider text-slate-300 mb-4 font-semibold">
                                Company
                            </h4>
                            <ul className="space-y-2.5">
                                <FooterLink href="/about">About Us</FooterLink>
                            </ul>
                        </div>

                        {/* Community */}
                        <div>
                            <h4 className="text-xs font-sans uppercase tracking-wider text-slate-300 mb-4 font-semibold">
                                Community
                            </h4>
                            <ul className="space-y-2.5">
                                <FooterLink href="/become-a-guide">Become a Guide</FooterLink>
                                <FooterLink href="/community">Community</FooterLink>
                            </ul>
                        </div>

                        {/* Get in Touch */}
                        <div>
                            <h4 className="text-xs font-sans uppercase tracking-wider text-slate-300 mb-4 font-semibold">
                                Contact
                            </h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <a
                                        href="mailto:hello@unchartedtravel.in"
                                        className="text-xs text-slate-400 hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5 font-sans"
                                    >
                                        <Mail className="w-3.5 h-3.5 text-yellow-400" />
                                        <span>hello@unchartedtravel.in</span>
                                    </a>
                                </li>
                                <li className="text-xs text-slate-500 font-sans pt-1">
                                    Kasol, Parvati Valley<br />
                                    Himachal Pradesh 175105
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-sans text-slate-500">
                        &copy; {currentYear} UnchartedTravel. All rights reserved.
                    </p>
                    <p className="text-xs font-sans text-slate-500">
                        Himalayan Treks & Local Expeditions
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
