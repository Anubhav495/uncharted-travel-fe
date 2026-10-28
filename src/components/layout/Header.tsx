import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    variant?: 'default' | 'minimal';
}

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
    const { user, signOut } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        fixed top-0 left-0 right-0 z-[100] transition-all duration-200 ease-out border-none
        ${scrolled
            ? 'bg-slate-900/95 backdrop-blur-2xl py-3 shadow-2xl border-b border-slate-800'
            : 'bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent py-4 sm:py-5'
        }
    `;

    const NavLink: React.FC<{ href: string; children: React.ReactNode; isMobile?: boolean; onClick?: () => void }> = ({
        href,
        children,
        isMobile = false,
        onClick
    }) => {
        if (isMobile) {
            return (
                <Link
                    href={href}
                    className="block py-3 px-4 text-white/80 hover:text-white rounded-none border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors duration-150 text-sm tracking-wider uppercase font-sans"
                    onClick={onClick}
                >
                    {children}
                </Link>
            );
        }

        return (
            <Link
                href={href}
                className="text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors duration-200 relative group py-1 font-sans font-medium"
                onClick={onClick}
            >
                {children}
                <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-white transition-all duration-200 ease-out group-hover:w-full opacity-80" />
            </Link>
        );
    };

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                {/* Brand Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group cursor-pointer z-10"
                >
                    <img
                        src="/assets/brand-logo.png"
                        alt="UnchartedTravel Logo"
                        className="h-6 w-auto opacity-90 group-hover:opacity-100 transition-opacity invert"
                    />
                    <span className="font-display text-2xl tracking-tight text-white group-hover:text-white/90 transition-colors">
                        UnchartedTravel
                    </span>
                </Link>

                {/* Desktop Navigation */}
                {variant === 'default' && (
                    <nav className="hidden lg:flex items-center space-x-8">
                        <NavLink href="/destinations">Destinations</NavLink>
                        <NavLink href="/become-a-guide">Become a Guide</NavLink>
                        <NavLink href="/community">Community</NavLink>
                        <NavLink href="/about">About Us</NavLink>

                        {user ? (
                            <div className="relative ml-4 group">
                                <button className="flex items-center space-x-2 focus:outline-none p-1 border border-white/15 bg-white/[0.04] hover:border-white/30 transition duration-150">
                                    <div className="w-7 h-7 bg-neutral-900 flex items-center justify-center text-white overflow-hidden text-xs">
                                        {user.user_metadata.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-medium">{user.email?.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-white/75 px-1 truncate max-w-[100px]">
                                        {user.user_metadata.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform origin-top-right backdrop-blur-xl">
                                    <div className="px-4 py-3 border-b border-slate-800">
                                        <p className="text-xs text-white font-medium truncate">{user.user_metadata.full_name || 'Traveler'}</p>
                                        <p className="text-xs text-slate-400 truncate font-sans mt-0.5">{user.email}</p>
                                    </div>
                                    <Link href="/dashboard" className="block px-4 py-2 text-xs uppercase tracking-wider text-slate-200 hover:bg-slate-800 hover:text-white font-sans">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 font-sans"
                                    >
                                        Log out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="ml-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold transition-all duration-200 text-xs uppercase tracking-widest font-sans shadow-md"
                            >
                                Sign In
                            </Link>
                        )}
                    </nav>
                )}

                {/* Mobile Navigation Controls */}
                {variant === 'default' && (
                    <div className="flex items-center gap-2 lg:hidden">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="px-2.5 py-1.5 border border-white/20 bg-neutral-900/90 text-white text-[11px] font-sans uppercase tracking-wider hover:border-white/40 transition-all backdrop-blur-md"
                            >
                                {user.user_metadata.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Account'}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-[11px] font-sans uppercase tracking-wider backdrop-blur-md transition-all shadow-sm active:scale-95"
                            >
                                Sign In
                            </Link>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className={`menu-button p-2.5 border transition-all duration-150 z-50 flex items-center justify-center active:scale-95 ${
                                isMenuOpen
                                    ? 'bg-white text-black border-white shadow-xl'
                                    : 'bg-neutral-900/90 hover:bg-neutral-900 border-white/20 hover:border-white/40 text-white backdrop-blur-md shadow-lg'
                            }`}
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMenuOpen ? (
                                <HiX className="h-5 w-5 text-black" />
                            ) : (
                                <HiMenu className="h-5 w-5 text-white" />
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Menu Portal */}
            {mounted && isMenuOpen && variant === 'default' && createPortal(
                <div
                    className="mobile-menu fixed inset-0 w-screen h-screen min-h-screen bg-slate-900 z-[99999] lg:hidden flex flex-col overflow-y-auto overscroll-contain"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0f172a' }}
                >
                    {/* Header bar inside menu */}
                    <div className="h-16 px-5 sm:px-8 flex items-center justify-between border-b border-slate-800 shrink-0 bg-slate-900">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2.5"
                        >
                            <img
                                src="/assets/brand-logo.png"
                                alt="UnchartedTravel Logo"
                                className="h-6 w-auto invert"
                            />
                            <span className="font-display text-2xl tracking-tight text-white">
                                UnchartedTravel
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2.5 bg-white text-black border border-white transition-transform active:scale-95 flex items-center justify-center cursor-pointer shadow-lg"
                            aria-label="Close menu"
                        >
                            <HiX className="h-5 w-5 text-black" />
                        </button>
                    </div>

                    {/* Nav links with Sign In together */}
                    <div className="flex-1 px-6 py-6 max-w-lg w-full mx-auto flex flex-col">
                        <nav className="space-y-1">
                            <NavLink href="/destinations" isMobile={true} onClick={() => setIsMenuOpen(false)}>
                                Destinations
                            </NavLink>
                            <NavLink href="/become-a-guide" isMobile={true} onClick={() => setIsMenuOpen(false)}>
                                Become a Guide
                            </NavLink>
                            <NavLink href="/community" isMobile={true} onClick={() => setIsMenuOpen(false)}>
                                Community
                            </NavLink>
                            <NavLink href="/about" isMobile={true} onClick={() => setIsMenuOpen(false)}>
                                About Us
                            </NavLink>

                            {/* Sign In / User Tabs kept right above with all tabs */}
                            {user ? (
                                <div className="pt-3 border-t border-white/10 mt-3 space-y-1">
                                    <div className="px-4 py-1.5 text-xs text-white/50 font-sans">
                                        Signed in as <span className="text-white">{user.email}</span>
                                    </div>
                                    <NavLink href="/dashboard" isMobile={true} onClick={() => setIsMenuOpen(false)}>
                                        Dashboard
                                    </NavLink>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-3 px-4 text-xs uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-colors font-sans"
                                    >
                                        Log out
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-3.5 bg-yellow-400 text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all text-center block shadow-lg font-sans"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>,
                document.body
            )}
        </header>
    );
};

export default Header;
