import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenu, HiX, HiChevronRight } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    variant?: 'default' | 'minimal';
}

const mobileLinks = [
    { href: '/destinations', label: 'Destinations' },
    { href: '/become-a-guide', label: 'Become a Guide' },
    { href: '/community', label: 'Community' },
    { href: '/about', label: 'About Us' },
    { href: '#contact', label: 'Contact' },
];

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
    const { user, loginWithGoogle, signOut } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showPulse, setShowPulse] = useState(false);

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

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsMenuOpen(false);
        };

        let scrollY = 0;
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
            // Lock page scroll. `overflow: hidden` alone doesn't stop iOS Safari from scrolling the page behind.
            scrollY = window.scrollY;
            document.documentElement.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            if (isMenuOpen) {
                document.documentElement.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior });
            }
        };
    }, [isMenuOpen]);

    const headerClasses = `
        fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out
        ${isMenuOpen
            ? 'bg-transparent py-2'
            : scrolled
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
        <>
        <header className={headerClasses}>
            <div className="container mx-auto px-4 flex justify-between items-center h-10">
                {/* Brand Logo/Name */}
                <Link
                    href="/"
                    className={`text-xl sm:text-2xl font-bold transition-colors z-10 ${
                        isMenuOpen || scrolled
                            ? 'text-yellow-600 hover:text-yellow-700' 
                            : 'text-yellow-400 hover:text-yellow-300 drop-shadow-md'
                    }`}
                >
                    UnchartedTravel
                </Link>

                {/* Desktop Navigation */}
                {variant === 'default' && (
                    <nav className="hidden lg:flex items-center space-x-8">
                        <NavLink href="/about">About Us</NavLink>
                        <NavLink href="/destinations">Destinations</NavLink>
                        <NavLink href="/become-a-guide">Become a Guide</NavLink>
                        <NavLink href="/community">Community</NavLink>

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
                        className={`menu-button lg:hidden p-3 relative rounded-lg hover:bg-black/10 transition-colors z-50 ${!isMenuOpen && showPulse ? 'animate-glow-pulse' : ''}`}
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
        </header>

            {/* Mobile Menu Overlay: kept outside <header> because its backdrop-filter would otherwise clip this fixed element to the header's height */}
            <AnimatePresence>
                {isMenuOpen && variant === 'default' && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mobile-menu fixed inset-0 z-40 lg:hidden bg-white/70 backdrop-blur-2xl overflow-y-auto overscroll-contain"
                    >
                        <nav className="container mx-auto px-6 pt-28 pb-10 min-h-full flex flex-col">
                            <ul className="space-y-1">
                                {mobileLinks.map((link, i) => (
                                    <motion.li
                                        key={link.href}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 + i * 0.05, duration: 0.25 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-between py-4 border-b border-gray-900/10 text-2xl font-semibold text-gray-800 hover:text-yellow-600 transition-colors"
                                        >
                                            {link.label}
                                            <HiChevronRight className="h-5 w-5 text-gray-400" />
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>

                            <motion.div
                                className="mt-auto pt-10"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 + mobileLinks.length * 0.05, duration: 0.25 }}
                            >
                                {user ? (
                                    <div className="rounded-2xl bg-white/70 border border-gray-900/10 p-4 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                                                {user.user_metadata?.avatar_url ? (
                                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    user.email?.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user.user_metadata?.full_name || 'Welcome back'}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-center py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    signOut();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            loginWithGoogle();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full py-4 rounded-full bg-blue-600 text-white text-lg font-medium shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-colors"
                                    >
                                        Login
                                    </button>
                                )}
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
