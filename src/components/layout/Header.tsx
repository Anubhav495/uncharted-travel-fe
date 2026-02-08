import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenu, HiX, HiUserCircle } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    variant?: 'default' | 'minimal';
}

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
    const { user, loginWithGoogle, signOut } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showPulse, setShowPulse] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Control the pulse animation: run whenever header is transparent (not scrolled)
    useEffect(() => {
        setShowPulse(!scrolled);
    }, [scrolled]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const headerClasses = `
        fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out
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
                    className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors z-10"
                >
                    UnchartedTravel
                </Link>

                {/* Desktop Navigation */}
                {variant === 'default' && (
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink href="/about">About Us</NavLink>
                        <NavLink href="/destinations">Destinations</NavLink>
                        <NavLink href="/community">Community</NavLink>
                        <NavLink href="/become-a-guide">Become a Guide</NavLink>

                        {user ? (
                            <div className="relative ml-4 group">
                                <button className="flex items-center space-x-2 focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden border-2 border-white shadow-md">
                                        {user.user_metadata.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-bold">{user.email?.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm text-gray-900 font-medium truncate">{user.user_metadata.full_name || 'User'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Log out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => loginWithGoogle()}
                                className="ml-4 px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md bg-blue-600 text-white shadow-blue-500/25 hover:bg-blue-700 border border-transparent"
                            >
                                Login
                            </button>
                        )}
                    </nav>
                )}

                {/* Mobile Menu Button */}
                {variant === 'default' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className={`menu-button md:hidden p-3 relative rounded-lg hover:bg-black/10 transition-colors z-50 ${!isMenuOpen && showPulse ? 'animate-glow-pulse' : ''}`}
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
                                    href="/destinations"
                                    isMobile={true}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Destinations
                                </NavLink>
                                <NavLink
                                    href="/community"
                                    isMobile={true}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Community
                                </NavLink>
                                <NavLink
                                    href="/become-a-guide"
                                    isMobile={true}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Become a Guide
                                </NavLink>

                                <div className="border-t border-gray-200 my-4"></div>

                                {user ? (
                                    <>
                                        <div className="px-4 py-2">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">{user.email}</div>
                                            </div>
                                            <NavLink href="/dashboard" isMobile={true} onClick={() => setIsMenuOpen(false)}>
                                                Dashboard
                                            </NavLink>
                                            <button
                                                onClick={() => {
                                                    signOut();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="block w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-md font-medium"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            loginWithGoogle();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-3 px-4 text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                                    >
                                        Login
                                    </button>
                                )}

                                <div className="border-t border-gray-200 my-4"></div>
                                <NavLink
                                    href="/about"
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