import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Compass, Mail, ArrowUpRight } from 'lucide-react';

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
        <footer className="bg-black text-white border-t border-white/[0.08] relative">
            <div className="container mx-auto px-6 md:px-12 py-16 md:py-20">
                {/* Upper Brand & Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand Manifest */}
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
                            <img
                                src="/assets/brand-logo.png"
                                alt="Uncharted Stag"
                                className="h-6 w-auto invert opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <span className="font-display text-2xl tracking-tight text-white">
                                UNCHARTED<sup className="text-[9px] font-sans ml-1 text-white/45">®</sup>
                            </span>
                        </Link>
                        <p className="text-xs text-white/55 leading-relaxed font-sans max-w-sm mb-6">
                            A high-altitude geographic and expedition platform connecting mindful wanderers directly with vetted generational Himalayan masters.
                        </p>
                        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-white/40">
                            <Compass className="w-3.5 h-3.5 text-white/50" />
                            <span>Parvati Valley &middot; 32.0010° N, 77.3150° E</span>
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Expeditions */}
                        <div>
                            <h4 className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-4">
                                01 / Navigation
                            </h4>
                            <ul className="space-y-2.5">
                                <FooterLink href="/destinations">Alpine Routes</FooterLink>
                                <FooterSectionLink targetId="why-us">Pillars & Doctrine</FooterSectionLink>
                                <FooterSectionLink targetId="stories">Founding Guides</FooterSectionLink>
                                <FooterSectionLink targetId="how-it-works">Spatial Workflow</FooterSectionLink>
                            </ul>
                        </div>

                        {/* Network */}
                        <div>
                            <h4 className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-4">
                                02 / Fellowship
                            </h4>
                            <ul className="space-y-2.5">
                                <FooterLink href="/become-a-guide">Become a Guide</FooterLink>
                                <FooterLink href="/community">Explorer Community</FooterLink>
                                <FooterLink href="/about">About Uncharted</FooterLink>
                            </ul>
                        </div>

                        {/* Dispatch */}
                        <div className="col-span-2 sm:col-span-1">
                            <h4 className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-4">
                                03 / Dispatch
                            </h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <a
                                        href="mailto:hello@unchartedtravel.in"
                                        className="text-xs text-white/55 hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5 font-sans"
                                    >
                                        <Mail className="w-3.5 h-3.5 text-white/40" />
                                        <span>hello@unchartedtravel.in</span>
                                    </a>
                                </li>
                                <li className="text-[11px] text-white/40 font-mono pt-2">
                                    Kasol, Parvati Valley<br />
                                    Himachal Pradesh 175105
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] font-mono text-white/40 tracking-wider">
                        &copy; {currentYear} UNCHARTED TRAVEL. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-6 text-[11px] font-mono text-white/40 tracking-wider">
                        <span>ZERO MASS TOURISM</span>
                        <span className="text-white/20">&middot;</span>
                        <span>LEAVE NO TRACE</span>
                        <span className="text-white/20">&middot;</span>
                        <span>VETTED LINEAGE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
