import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';

interface HeaderProps {
    variant?: 'default' | 'minimal';
}

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    // Reusable NavLink component with dynamic text color and new hover effect
    const NavLink: React.FC<{ href: string; children: React.ReactNode; isMobile?: boolean; onClick?: () => void }> = ({
        href,
        children,
        isMobile = false,
        onClick
    }) => {
        // Mobile links have a simple hover effect
        if (isMobile) {
            return (
                <Link href={href} className="block py-3 px-4 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium" onClick={onClick}>
                    {children}
                </Link>
            );
        }

        // Desktop links get the animated underline
        const linkClasses = `
            font-medium transition-colors duration-300 ease-out relative group py-2
            ${scrolled
                ? 'text-gray-700' // Dark text for scrolled header
                : 'text-white [text-shadow:0_1px_2px_rgb(0_0_0_/_0.3)]' // White text for transparent header
            }
        `;

        return (
            <Link href={href} className={linkClasses} onClick={onClick}>
                {children}
                {/* --- THIS IS THE ANIMATED UNDERLINE --- */}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-yellow-400 transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
        );
    };

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 flex justify-between items-center h-10">
                {/* Brand Logo/Name */}
                <Link
                    href="/"
                    className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity z-10"
                >
                    UnchartedTravel
                </Link>

                {/* Desktop Navigation */}
                {variant === 'default' && (
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink href="/#destinations">Destinations</NavLink>
                        <NavLink href="/become-a-guide">Become a Guide</NavLink>
                    </nav>
                )}

                {/* Mobile Menu Button */}
                {variant === 'default' && (
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="menu-button md:hidden p-2 rounded-lg hover:bg-black/10 transition-colors z-10"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? (
                            <HiX className="h-6 w-6 text-gray-700" />
                        ) : (
                            <HiMenu className={`h-6 w-6 transition-colors duration-300 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
                        )}
                    </button>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && variant === 'default' && (
                <div className="mobile-menu fixed inset-0 top-0 bg-white z-40 md:hidden">
                    <div className="pt-20 pb-8">
                        <nav className="container mx-auto px-4">
                            <div className="space-y-1">
                                <NavLink
                                    href="/#destinations"
                                    isMobile={true}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Destinations
                                </NavLink>
                                <NavLink
                                    href="/become-a-guide"
                                    isMobile={true}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Become a Guide
                                </NavLink>
                                <div className="border-t border-gray-200 my-4"></div>
                                <NavLink
                                    href="#about"
                                    isMobile={true}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About Us
                                </NavLink>
                                <NavLink
                                    href="#contact"
                                    isMobile={true}
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