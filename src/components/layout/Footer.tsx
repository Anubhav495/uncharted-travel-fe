import React from 'react';
import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <li>
        <a 
            href={href} 
            className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm sm:text-base py-1 block"
        >
            {children}
        </a>
    </li>
);

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 p-2 rounded-lg hover:bg-gray-800"
        aria-label={label}
    >
        {icon}
    </a>
);

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white">
            <div className="container mx-auto px-4 py-12 sm:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Platform */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">
                            Platform
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="#why-us">Why Us</FooterLink>
                            <FooterLink href="#reviews">Reviews</FooterLink>
                            <FooterLink href="/guides">Find a Guide</FooterLink>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">
                            Company
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/press">Press</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">
                            Community
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink href="/for-guides">Become a Guide</FooterLink>
                            <FooterLink href="/referrals">Refer a Friend</FooterLink>
                            <FooterLink href="/faq">Help Center</FooterLink>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">
                            Get in Touch
                        </h3>
                        <ul className="space-y-2 mb-6">
                            <FooterLink href="mailto:hello@unchartedtravel.com">
                                hello@unchartedtravel.com
                            </FooterLink>
                        </ul>
                        
                        <div className="flex space-x-2">
                            <SocialLink 
                                href="#" 
                                icon={<Twitter size={20} />} 
                                label="Follow us on Twitter"
                            />
                            <SocialLink 
                                href="#" 
                                icon={<Instagram size={20} />} 
                                label="Follow us on Instagram"
                            />
                            <SocialLink 
                                href="#" 
                                icon={<Facebook size={20} />} 
                                label="Follow us on Facebook"
                            />
                            <SocialLink 
                                href="#" 
                                icon={<Linkedin size={20} />} 
                                label="Connect on LinkedIn"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center">
                        <img 
                            src="/assets/brand-logo.png" 
                            alt="UnchartedTravel Logo" 
                            className="h-8 w-auto mr-3"
                        />
                        <span className="font-semibold text-lg text-white">
                            UnchartedTravel
                        </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 text-center sm:text-right">
                        &copy; {currentYear} UnchartedTravel. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;