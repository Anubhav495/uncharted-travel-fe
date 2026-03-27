

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <li>
        <a
            href={href}
            className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-xs sm:text-base py-0 sm:py-1 block"
        >
            {children}
        </a>
    </li>
);

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white">
            <div className="container mx-auto px-4 pt-4 sm:pt-8 pb-4 sm:pb-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 sm:gap-8 mb-4 sm:mb-12">
                    {/* Platform */}
                    <div className="order-1">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-200 tracking-wider uppercase mb-0.5 sm:mb-4">
                            Platform
                        </h3>
                        <ul className="space-y-0.5 sm:space-y-2">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="#why-us">Why Us</FooterLink>

                        </ul>
                    </div>

                    {/* Company */}
                    <div className="order-3 lg:order-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-200 tracking-wider uppercase mb-0.5 sm:mb-4">
                            Company
                        </h3>
                        <ul className="space-y-0.5 sm:space-y-2">
                            <FooterLink href="/about">About Us</FooterLink>
                        </ul>
                    </div>

                    {/* Community */}
                    <div className="order-2 lg:order-3">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-200 tracking-wider uppercase mb-0.5 sm:mb-4">
                            Community
                        </h3>
                        <ul className="space-y-0.5 sm:space-y-2">
                            <FooterLink href="/for-guides">Become a Guide</FooterLink>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div className="order-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-200 tracking-wider uppercase mb-0.5 sm:mb-4">
                            Get in Touch
                        </h3>
                        <ul className="space-y-0.5 sm:space-y-2 mb-2 sm:mb-6">
                            <FooterLink href="mailto:hello@unchartedtravel.com">
                                hello@unchartedtravel.com
                            </FooterLink>
                        </ul>

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-4 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
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