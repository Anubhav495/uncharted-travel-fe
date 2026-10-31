import React, { useRef } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import useSwipeNudge from './useSwipeNudge';

let catalogueTop: number;
let pendingFrame: FrameRequestCallback | undefined;
let requestFrame: jest.SpyInstance;
const originalWidth = window.innerWidth;
const originalHeight = window.innerHeight;
const originalViewport = window.visualViewport;

const Catalogue = ({ pageCount = 3 }: { pageCount?: number }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const interactionRef = useRef<HTMLDivElement>(null);
    const { cancelNudge } = useSwipeNudge(scrollRef, interactionRef, pageCount);

    return (
        <div ref={interactionRef}>
            <header className="fixed">Navigation</header>
            <input aria-label="Search treks" onChange={cancelNudge} />
            <div ref={scrollRef} role="region" aria-label="Trek pages">
                <div>
                    {[0, 1, 2].map(index => <a key={index} href="#trek" data-swipe-card={index}>Trek {index}</a>)}
                </div>
            </div>
        </div>
    );
};

beforeEach(() => {
    jest.useFakeTimers();
    catalogueTop = 1000;
    pendingFrame = undefined;
    Object.defineProperties(window, {
        innerWidth: { configurable: true, value: 390 },
        innerHeight: { configurable: true, value: 800 },
        visualViewport: { configurable: true, value: undefined },
        matchMedia: {
            configurable: true,
            writable: true,
            value: jest.fn().mockReturnValue({
                matches: true,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            }),
        },
    });
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
        const top = this.matches('header.fixed') ? 0 : catalogueTop + Number(this.getAttribute('data-swipe-card') ?? 0) * 172;
        const height = this.matches('header.fixed') ? 64 : this.hasAttribute('data-swipe-card') ? 160 : 1200;
        return { top, bottom: top + height, left: 20, right: 370, width: 350, height, x: 20, y: top, toJSON: () => ({}) };
    });
    requestFrame = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
        pendingFrame = callback;
        return 1;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
        pendingFrame = undefined;
    });
});

afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
    Object.defineProperties(window, {
        innerWidth: { value: originalWidth },
        innerHeight: { value: originalHeight },
        visualViewport: { value: originalViewport },
    });
    jest.useRealTimers();
});

const prepareCatalogue = (pageCount = 3) => {
    const result = render(<Catalogue pageCount={pageCount} />);
    const container = screen.getByRole('region', { name: 'Trek pages' });
    Object.defineProperties(container, {
        clientWidth: { value: 390, configurable: true },
        scrollWidth: { value: 1170, configurable: true },
    });
    container.style.scrollSnapType = 'x mandatory';
    container.style.scrollBehavior = 'smooth';
    return { ...result, container };
};

const moveCatalogue = (top: number) => {
    catalogueTop = top;
    fireEvent.scroll(window);
};
const setVisible = (visible: boolean) => moveCatalogue(visible ? 100 : 1000);
const advanceFrame = (time: number) => act(() => {
    const callback = pendingFrame;
    pendingFrame = undefined;
    callback?.(time);
});
const beginNudge = () => {
    setVisible(true);
    act(() => jest.advanceTimersByTime(700));
    advanceFrame(0);
};

it('waits for all three cards, peeks half a page, returns to the start, and never repeats', () => {
    const { container } = prepareCatalogue();
    act(() => jest.advanceTimersByTime(5000));
    expect(requestFrame).not.toHaveBeenCalled();
    for (const top of [600, 400, 300]) {
        moveCatalogue(top);
        act(() => jest.advanceTimersByTime(1000));
        expect(requestFrame).not.toHaveBeenCalled();
    }
    beginNudge();
    expect(container.style.scrollSnapType).toBe('none');
    advanceFrame(600);
    expect(container.scrollLeft).toBe(195);
    advanceFrame(800);
    expect(container.scrollLeft).toBe(195);
    advanceFrame(1125);
    expect(container.scrollLeft).toBeCloseTo(97.5);
    advanceFrame(1450);
    expect(container.scrollLeft).toBe(0);
    expect(container.style.scrollSnapType).toBe('x mandatory');
    expect(container.style.scrollBehavior).toBe('smooth');
    const frameCount = requestFrame.mock.calls.length;
    setVisible(true);
    act(() => jest.advanceTimersByTime(5000));
    expect(requestFrame).toHaveBeenCalledTimes(frameCount);
});

it('still runs after the user scrolls vertically through the catalogue on a touch screen', () => {
    const { container } = prepareCatalogue();
    const pointerDown = new Event('pointerdown', { bubbles: true });
    Object.defineProperty(pointerDown, 'pointerType', { value: 'touch' });
    fireEvent(container, pointerDown);
    fireEvent.touchStart(container, { touches: [{ clientX: 180, clientY: 500 }] });
    fireEvent.touchMove(container, { touches: [{ clientX: 185, clientY: 220 }] });
    setVisible(true);
    act(() => jest.advanceTimersByTime(1000));
    expect(requestFrame).not.toHaveBeenCalled();
    fireEvent.touchEnd(container);
    act(() => jest.advanceTimersByTime(700));
    expect(requestFrame).toHaveBeenCalledTimes(1);
});

it('still runs after vertical mouse-wheel scrolling', () => {
    const { container } = prepareCatalogue();
    fireEvent.wheel(container, { deltaX: 0, deltaY: 200 });
    beginNudge();
    expect(requestFrame).toHaveBeenCalled();
});

it('does not run after the user has already swiped horizontally', () => {
    const { container } = prepareCatalogue();
    fireEvent.touchStart(container, { touches: [{ clientX: 180, clientY: 200 }] });
    fireEvent.touchMove(container, { touches: [{ clientX: 80, clientY: 205 }] });
    fireEvent.touchEnd(container);
    beginNudge();
    expect(requestFrame).not.toHaveBeenCalled();
});

it('stops immediately when a user starts touching an active hint', () => {
    const { container } = prepareCatalogue();
    beginNudge();
    advanceFrame(300);
    const position = container.scrollLeft;
    fireEvent.touchStart(container, { touches: [{ clientX: 180, clientY: 200 }] });
    expect(pendingFrame).toBeUndefined();
    expect(container.style.scrollSnapType).toBe('x mandatory');
    act(() => jest.advanceTimersByTime(5000));
    expect(container.scrollLeft).toBe(position);
});

it('cancels the hint when the user starts searching', () => {
    prepareCatalogue();
    setVisible(true);
    fireEvent.change(screen.getByRole('textbox', { name: 'Search treks' }), { target: { value: 'snow' } });
    act(() => jest.advanceTimersByTime(5000));
    expect(requestFrame).not.toHaveBeenCalled();
});

it('skips the hint on desktop or when reduced motion is preferred', () => {
    (window.matchMedia as jest.Mock).mockReturnValue({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() });
    prepareCatalogue();
    beginNudge();
    expect(requestFrame).not.toHaveBeenCalled();
});

it('can start after switching from desktop into mobile view without a reload', () => {
    const media = { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() };
    (window.matchMedia as jest.Mock).mockReturnValue(media);
    const { container } = prepareCatalogue();
    fireEvent.pointerDown(container);
    setVisible(true);
    act(() => jest.advanceTimersByTime(1000));
    expect(requestFrame).not.toHaveBeenCalled();

    media.matches = true;
    act(() => media.addEventListener.mock.calls[0][1]());
    act(() => jest.advanceTimersByTime(700));
    expect(requestFrame).toHaveBeenCalledTimes(1);
});

it('waits until the first card is below the fixed navigation', () => {
    prepareCatalogue();
    moveCatalogue(50);
    act(() => jest.advanceTimersByTime(1000));
    expect(requestFrame).not.toHaveBeenCalled();
    moveCatalogue(65);
    act(() => jest.advanceTimersByTime(700));
    expect(requestFrame).toHaveBeenCalledTimes(1);
});

it('checks the visible three cards rather than the height of taller neighbouring pages', () => {
    const { container } = prepareCatalogue();
    expect(container.getBoundingClientRect().height).toBe(1200);
    beginNudge();
    expect(requestFrame).toHaveBeenCalledTimes(2);
});

it('uses the actual visual viewport when browser chrome reduces the visible area', () => {
    Object.defineProperty(window, 'visualViewport', {
        value: { offsetTop: 0, offsetLeft: 0, width: 390, height: 600, addEventListener: jest.fn(), removeEventListener: jest.fn() },
    });
    prepareCatalogue();
    moveCatalogue(100);
    act(() => jest.advanceTimersByTime(1000));
    expect(requestFrame).not.toHaveBeenCalled();
    moveCatalogue(80);
    act(() => jest.advanceTimersByTime(700));
    expect(requestFrame).toHaveBeenCalledTimes(1);
});

it('cancels a pending hint when the catalogue leaves view', () => {
    prepareCatalogue();
    setVisible(true);
    setVisible(false);
    act(() => jest.advanceTimersByTime(5000));
    expect(requestFrame).not.toHaveBeenCalled();
});

it('waits for scrolling to settle before starting the hint', () => {
    prepareCatalogue();
    setVisible(true);
    act(() => jest.advanceTimersByTime(400));
    moveCatalogue(120);
    act(() => jest.advanceTimersByTime(699));
    expect(requestFrame).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(requestFrame).toHaveBeenCalledTimes(1);
});

it('stops if any card becomes hidden during the hint', () => {
    const { container } = prepareCatalogue();
    beginNudge();
    advanceFrame(300);
    moveCatalogue(300);
    expect(pendingFrame).toBeUndefined();
    expect(container.style.scrollSnapType).toBe('x mandatory');
    const frameCount = requestFrame.mock.calls.length;
    setVisible(true);
    act(() => jest.advanceTimersByTime(1000));
    expect(requestFrame).toHaveBeenCalledTimes(frameCount);
});

it('restores scroll behavior and cancels the animation when navigating away', () => {
    const { container, unmount } = prepareCatalogue();
    beginNudge();
    unmount();
    expect(pendingFrame).toBeUndefined();
    expect(container.style.scrollSnapType).toBe('x mandatory');
    expect(container.style.scrollBehavior).toBe('smooth');
});

it('skips the hint when there is only one page of treks', () => {
    prepareCatalogue(1);
    beginNudge();
    expect(requestFrame).not.toHaveBeenCalled();
});

it('does not animate when there is no horizontal overflow', () => {
    const { container } = prepareCatalogue();
    Object.defineProperty(container, 'scrollWidth', { value: 390 });
    beginNudge();
    expect(requestFrame).not.toHaveBeenCalled();
    expect(container.style.scrollSnapType).toBe('x mandatory');
});
