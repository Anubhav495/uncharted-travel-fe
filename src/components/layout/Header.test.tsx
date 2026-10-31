import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';

jest.mock('@/context/AuthContext', () => ({ useAuth: jest.fn() }));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a {...props}>{children}</a>
    ),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const loginWithGoogle = jest.fn();
const signOut = jest.fn();

function openMenu() {
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    return screen.getByRole('dialog', { name: 'Navigation menu' });
}

describe('Header mobile menu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
        window.scrollTo = jest.fn();
        mockedUseAuth.mockReturnValue({
            user: null,
            session: null,
            loading: false,
            loginWithGoogle,
            signOut,
        });
    });

    it('keeps the revamped menu outside the blurred header when opened after scrolling', () => {
        render(<Header />);
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
        fireEvent.scroll(window);

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('bg-slate-900/95');

        const menu = openMenu();
        expect(header).not.toContainElement(menu);
        expect(menu.parentElement).toBe(document.body);
        expect(header.querySelector('a[href="/"]')).not.toHaveClass('invisible');
        expect(menu).toHaveClass('fixed', 'inset-0', 'bg-slate-900', 'overflow-y-auto');
        expect(within(menu).getByRole('img', { name: 'UnchartedTravel Logo' })).toHaveAttribute('src', '/assets/brand-logo.png');
        expect(within(menu).getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about');
        expect(within(menu).getByRole('link', { name: 'Destinations' })).toHaveClass(
            'py-3', 'px-4', 'text-white/80', 'font-sans',
        );
        expect(document.body.style.position).toBe('fixed');
        expect(document.body.style.top).toBe('-500px');

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.body.style.position).toBe('');
        expect(document.documentElement.style.overflow).toBe('');
        expect(header).toHaveClass('shadow-2xl');
        expect(header.querySelector('a[href="/"]')).not.toHaveClass('invisible');
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'instant' });
    });

    it('closes the menu when toggled or when navigating to a section', () => {
        render(<Header />);
        const firstMenu = openMenu();
        fireEvent.click(within(firstMenu).getByRole('button', { name: 'Close menu' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        const menu = openMenu();
        fireEvent.click(within(menu).getByRole('link', { name: 'Destinations' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.body.style.position).toBe('');
    });

    it('keeps the sign-in page link and closes the menu when navigating to it', () => {
        render(<Header />);
        const menu = openMenu();
        const signIn = within(menu).getByRole('link', { name: 'Sign In' });
        expect(signIn).toHaveAttribute('href', '/login');
        fireEvent.click(signIn);

        expect(loginWithGoogle).not.toHaveBeenCalled();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows account actions for signed-in users and closes on logout', () => {
        mockedUseAuth.mockReturnValue({
            ...mockedUseAuth(),
            user: { email: 'trekker@example.com', user_metadata: { full_name: 'Trekker' } },
        });
        render(<Header />);
        const menu = openMenu();

        expect(within(menu).getByText('trekker@example.com')).toBeInTheDocument();
        expect(within(menu).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
        expect(within(menu).queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument();
        fireEvent.click(within(menu).getByRole('button', { name: 'Log out' }));

        expect(signOut).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('releases the scroll lock when unmounted with the menu open', () => {
        const { unmount } = render(<Header />);
        openMenu();
        unmount();

        expect(document.body.style.position).toBe('');
        expect(document.body.style.top).toBe('');
        expect(document.body.style.width).toBe('');
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('does not show navigation controls for the minimal header', () => {
        render(<Header variant="minimal" />);

        expect(screen.getByRole('link', { name: 'UnchartedTravel' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Open menu' })).not.toBeInTheDocument();
    });
});
