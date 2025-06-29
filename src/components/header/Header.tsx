import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // We only need to know if we've scrolled more than a pixel.
            setScrolled(window.scrollY > 0); 
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- MODIFICATION: Sticky positioning and explicit color change ---
    const headerClasses = `
        sticky top-0 z-50 transition-colors duration-300 ease-in-out
        ${scrolled ? 'bg-sky-100 shadow-md py-3' : 'bg-white py-4'}
    `;

    // Wrapper for nav links to keep code DRY
    const NavLink: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({ href, children, className = '' }) => (
        <li>
            <a
                href={href}
                className={`text-gray-700 hover:text-blue-600 transition-colors duration-300 ${className}`}
                onClick={() => setIsMenuOpen(false)}
            >
                {children}
            </a>
        </li>
    );

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Brand */}
                <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    UnchartedTravel
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <ul className="flex items-center space-x-6">
                        <NavLink href="/destinations">Destinations</NavLink>
                        <NavLink href="/become-a-guide">Become a Guide</NavLink>
                    </ul>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
                        <HiMenu className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;