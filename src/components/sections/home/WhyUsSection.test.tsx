import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WhyUsSection from './WhyUsSection';

jest.mock('gsap', () => ({
    __esModule: true,
    default: {
        registerPlugin: jest.fn(),
        matchMedia: () => ({ add: jest.fn(), revert: jest.fn() }),
    },
}));
jest.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: jest.fn().mockReturnValue({ matches: false }),
    });
});

const renderMobileBenefits = () => {
    render(<WhyUsSection />);
    const rail = screen.getByRole('region', { name: 'Why travel with us benefits' });
    Object.defineProperties(rail, {
        clientWidth: { value: 390 },
        scrollWidth: { value: 1272 },
    });
    Array.from(rail.children).forEach((card, index) => {
        Object.defineProperty(card, 'offsetLeft', { value: 24 + index * 310 });
    });
    const scrollTo = jest.fn(({ left }: ScrollToOptions) => {
        rail.scrollLeft = left ?? 0;
        fireEvent.scroll(rail);
    });
    Object.defineProperty(rail, 'scrollTo', { value: scrollTo, configurable: true });
    return { rail, scrollTo };
};

it('navigates through the benefits and disables arrows at each end', () => {
    const { scrollTo } = renderMobileBenefits();
    const previous = screen.getByRole('button', { name: 'Previous benefit' });
    const next = screen.getByRole('button', { name: 'Next benefit' });
    expect(previous).toBeDisabled();

    fireEvent.click(next);
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 310, behavior: 'smooth' });
    expect(screen.getByRole('button', { name: 'View Curated Expeditions' })).toHaveAttribute('aria-current', 'true');
    expect(previous).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'View Direct Connections' }));
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 882, behavior: 'smooth' });
    expect(next).toBeDisabled();
    fireEvent.click(previous);
    expect(screen.getByRole('button', { name: 'View Trust & Safety First' })).toHaveAttribute('aria-current', 'true');
});

it('updates the selected indicator after a native swipe, including the last card', () => {
    const { rail } = renderMobileBenefits();
    rail.scrollLeft = 600;
    fireEvent.scroll(rail);
    expect(screen.getByRole('button', { name: 'View Trust & Safety First' })).toHaveAttribute('aria-current', 'true');

    rail.scrollLeft = 882;
    fireEvent.scroll(rail);
    expect(screen.getByRole('button', { name: 'View Direct Connections' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Next benefit' })).toBeDisabled();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
});

it('supports keyboard navigation to adjacent cards and both ends', () => {
    const { rail, scrollTo } = renderMobileBenefits();
    fireEvent.keyDown(rail, { key: 'ArrowRight' });
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 310, behavior: 'smooth' });
    fireEvent.keyDown(rail, { key: 'End' });
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 882, behavior: 'smooth' });
    fireEvent.keyDown(rail, { key: 'ArrowLeft' });
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 620, behavior: 'smooth' });
    fireEvent.keyDown(rail, { key: 'Home' });
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'smooth' });
});

it('uses instant navigation when reduced motion is preferred', () => {
    (window.matchMedia as jest.Mock).mockReturnValue({ matches: true });
    const { scrollTo } = renderMobileBenefits();
    fireEvent.click(screen.getByRole('button', { name: 'Next benefit' }));
    expect(scrollTo).toHaveBeenCalledWith({ left: 310, behavior: 'auto' });
});
