import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import CardCarousel from './CardCarousel';

const items = ['Kapil', 'Pritam', 'Aatish'].map(name => ({
    id: name,
    label: name,
    content: <article>{name}'s story</article>,
}));

const renderCarousel = () => render(<CardCarousel items={items} label="Guide stories" interval={4000} />);
const expectActive = (name: string) => {
    expect(screen.getByRole('group', { name: new RegExp(name) })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `View ${name}` })).toHaveAttribute('aria-current', 'true');
};

beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: jest.fn().mockReturnValue({
            matches: false,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }),
    });
});

afterEach(() => {
    cleanup();
    jest.useRealTimers();
});

it('centers one accessible slide and wraps through the previous, next, and direct controls', () => {
    renderCarousel();
    expectActive('Kapil');
    expect(screen.getAllByRole('group')).toHaveLength(1);
    expect(screen.getAllByRole('article', { hidden: true })).toHaveLength(3);

    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expectActive('Aatish');
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expectActive('Kapil');
    fireEvent.click(screen.getByRole('button', { name: 'View Pritam' }));
    expectActive('Pritam');
});

it('auto-advances and pauses while hovered or explicitly paused', () => {
    renderCarousel();
    act(() => jest.advanceTimersByTime(4000));
    expectActive('Pritam');

    const carousel = screen.getByRole('region', { name: 'Guide stories' });
    fireEvent.mouseEnter(carousel);
    act(() => jest.advanceTimersByTime(8000));
    expectActive('Pritam');
    fireEvent.mouseLeave(carousel);
    act(() => jest.advanceTimersByTime(4000));
    expectActive('Aatish');

    fireEvent.click(screen.getByRole('button', { name: 'Pause slideshow' }));
    act(() => jest.advanceTimersByTime(8000));
    expectActive('Aatish');
    fireEvent.click(screen.getByRole('button', { name: 'Resume slideshow' }));
    act(() => jest.advanceTimersByTime(4000));
    expectActive('Kapil');
});

it('supports arrow keys and pauses rotation while keyboard focus is inside', () => {
    renderCarousel();
    const carousel = screen.getByRole('region', { name: 'Guide stories' });
    fireEvent.focus(carousel);
    act(() => jest.advanceTimersByTime(8000));
    expectActive('Kapil');
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expectActive('Pritam');
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    expectActive('Kapil');
    fireEvent.blur(carousel, { relatedTarget: null });
    act(() => jest.advanceTimersByTime(4000));
    expectActive('Pritam');
});

it('supports horizontal swipes in both directions without treating vertical scrolling as a swipe', () => {
    renderCarousel();
    const slide = screen.getByRole('group');
    fireEvent.touchStart(slide, { targetTouches: [{ clientX: 150, clientY: 100 }] });
    fireEvent.touchEnd(slide, { changedTouches: [{ clientX: 50, clientY: 110 }] });
    expectActive('Pritam');

    fireEvent.touchStart(slide, { targetTouches: [{ clientX: 0, clientY: 100 }] });
    fireEvent.touchEnd(slide, { changedTouches: [{ clientX: 100, clientY: 100 }] });
    expectActive('Kapil');

    fireEvent.touchStart(slide, { targetTouches: [{ clientX: 150, clientY: 100 }] });
    fireEvent.touchEnd(slide, { changedTouches: [{ clientX: 50, clientY: 350 }] });
    expectActive('Kapil');
});

it('disables automatic rotation for reduced motion while keeping manual navigation', () => {
    (window.matchMedia as jest.Mock).mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    });
    renderCarousel();
    act(() => jest.advanceTimersByTime(12000));
    expectActive('Kapil');
    expect(screen.queryByRole('button', { name: 'Pause slideshow' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expectActive('Pritam');
});
