import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
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
        fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out
        ${scrolled
            ? 'bg-black/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5 border-b border-transparent'
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
                {/* Brand Logo with Editorial Typography */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group cursor-pointer z-10"
                >
                    <img
                        src="/assets/brand-logo.png"
                        alt="Uncharted Stag"
                        className="h-6 w-auto opacity-90 group-hover:opacity-100 transition-opacity invert"
                    />
                    <span className="font-display text-2xl tracking-tight text-white group-hover:text-white/90 transition-colors">
                        UNCHARTED<sup className="text-[9px] font-sans ml-1 text-white/45 tracking-normal font-normal">®</sup>
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
                                <div className="absolute right-0 mt-2 w-52 bg-neutral-950 border border-white/15 shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform origin-top-right backdrop-blur-xl">
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-xs text-white font-medium truncate">{user.user_metadata.full_name || 'Explorer'}</p>
                                        <p className="text-[11px] text-white/50 truncate font-mono mt-0.5">{user.email}</p>
                                    </div>
                                    <Link href="/dashboard" className="block px-4 py-2 text-xs uppercase tracking-wider text-white/80 hover:bg-white/[0.06] hover:text-white">
                                        Explorer Dashboard
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-rose-400 hover:bg-rose-500/10"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="ml-2 px-5 py-2 border border-white/20 bg-white/[0.04] text-white hover:bg-white hover:text-black transition-all duration-200 text-xs uppercase tracking-widest font-medium"
                            >
                                Sign In
                            </Link>
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
                        className="menu-button lg:hidden p-2 text-white border border-white/15 bg-white/[0.04] hover:border-white/30 transition-colors z-50"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? (
                            <HiX className="h-5 w-5 text-white" />
                        ) : (
                            <HiMenu className="h-5 w-5 text-white" />
                        )}
                    </button>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && variant === 'default' && (
                <div className="mobile-menu fixed inset-0 top-0 bg-neutral-950/95 backdrop-blur-2xl z-40 lg:hidden border-b border-white/10">
                    <div className="pt-24 pb-8 container mx-auto px-6">
                        <div className="flex items-center justify-between pb-6 mb-4 border-b border-white/10">
                            <span className="font-display text-2xl tracking-tight text-white">
                                UNCHARTED<sup className="text-[9px] font-sans ml-1 text-white/45">®</sup>
                            </span>
                            <span className="text-xs text-white/40 uppercase tracking-widest font-mono">Alpine Archive</span>
                        </div>

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

                            <div className="pt-6 mt-4">
                                {user ? (
                                    <div className="border border-white/10 bg-white/[0.02] p-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-8 h-8 border border-white/20 bg-neutral-900 flex items-center justify-center text-white text-xs font-medium">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-xs text-white/80 font-mono truncate">{user.email}</div>
                                        </div>
                                        <NavLink href="/dashboard" isMobile={true} onClick={() => setIsMenuOpen(false)}>
                                            Dashboard
                                        </NavLink>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left py-2.5 px-4 text-xs uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-colors mt-2"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-3 border border-white/30 bg-white text-black font-medium text-xs uppercase tracking-widest hover:bg-white/90 transition-all text-center block"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
