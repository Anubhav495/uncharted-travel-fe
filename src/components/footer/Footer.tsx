import React from 'react';
import brandLogo from '../../assets/placeholder-app-mockup.png';
import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <li>
        <a href={href} className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
            {children}
        </a>
    </li>
);

const SocialLink: React.FC<{ href: string; icon: React.ReactNode }> = ({ href, icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
        {icon}
    </a>
);

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white">
            <div className="container mx-auto px-4 py-16">
                {/* --- RESPONSIVE CHANGE: Grid columns --- */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {/* The columns will now stack 2x2 on small screens and 4x1 on larger screens */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="#why-us">Why Us</FooterLink>
                            <FooterLink href="#reviews">Reviews</FooterLink>
                            <FooterLink href="/guides">Find a Guide</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Company</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/press">Press</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Community</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/for-guides">Become a Guide</FooterLink>
                            <FooterLink href="/referrals">Refer a Friend</FooterLink>
                            <FooterLink href="/faq">Help Center</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Get in Touch</h3>
                        <ul className="space-y-2 mb-6">
                            <FooterLink href="mailto:hello@unchartedtravel.com">hello@unchartedtravel.com</FooterLink>
                        </ul>
                        <div className="flex space-x-4">
                            <SocialLink href="#" icon={<Twitter size={20} />} />
                            <SocialLink href="#" icon={<Instagram size={20} />} />
                            <SocialLink href="#" icon={<Facebook size={20} />} />
                            <SocialLink href="#" icon={<Linkedin size={20} />} />
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <img src={brandLogo} alt="UnchartedTravel Logo" className="h-8 w-auto mr-3" />
                        <span className="font-semibold text-lg text-white">UnchartedTravel</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        &copy; {currentYear} UnchartedTravel. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;