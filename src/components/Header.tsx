import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const headerClasses = `
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out
        ${scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
            : 'bg-transparent py-4'
        }
    `;

    const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void }> = ({ 
        href, 
        children, 
        onClick 
    }) => (
        <a
            href={href}
            className="block py-3 px-4 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            onClick={onClick}
        >
            {children}
        </a>
    );

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Brand */}
                <a 
                    href="/" 
                    className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity z-10"
                >
                    UnchartedTravel
                </a>

                {/* Desktop Navigation - Hidden on mobile */}
                <nav className="hidden md:flex items-center space-x-8">
                    <NavLink href="#destinations">Destinations</NavLink>
                    <NavLink href="#become-guide">Become a Guide</NavLink>
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="menu-button md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors z-10"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? (
                        <HiX className="h-6 w-6 text-gray-700" />
                    ) : (
                        <HiMenu className="h-6 w-6 text-gray-700" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="mobile-menu fixed inset-0 top-0 bg-white z-40 md:hidden">
                    <div className="pt-20 pb-8">
                        <nav className="container mx-auto px-4">
                            <div className="space-y-1">
                                <NavLink 
                                    href="#destinations" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Destinations
                                </NavLink>
                                <NavLink 
                                    href="#become-guide" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Become a Guide
                                </NavLink>
                                <div className="border-t border-gray-200 my-4"></div>
                                <NavLink 
                                    href="#about" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About Us
                                </NavLink>
                                <NavLink 
                                    href="#contact" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Contact
                                </NavLink>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;