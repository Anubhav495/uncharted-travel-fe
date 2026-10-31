import { RefObject, useEffect, useRef } from 'react';

const useSwipeNudge = (
    scrollRef: RefObject<HTMLDivElement>,
    interactionRef: RefObject<HTMLDivElement>,
    pageCount: number,
) => {
    const hasNudged = useRef(false);
    const isNudging = useRef(false);
    const stopRef = useRef<() => void>(() => {});

    useEffect(() => {
        const container = scrollRef.current;
        const interactionArea = interactionRef.current;
        if (!container || !interactionArea || hasNudged.current || pageCount < 2
            || typeof window.matchMedia !== 'function') return;

        const media = window.matchMedia('(max-width: 767px) and (prefers-reduced-motion: no-preference)');
        const firstPage = container.firstElementChild;
        const cards = Array.from(firstPage?.children ?? []);
        if (!cards.length) return;

        let timer: number | undefined;
        let frame: number | undefined;
        let savedStyles: { snap: string; behavior: string } | undefined;
        let touchStart: { x: number; y: number } | undefined;

        const fullyVisible = () => {
            const viewport = window.visualViewport;
            const viewportTop = viewport?.offsetTop ?? 0;
            const viewportLeft = viewport?.offsetLeft ?? 0;
            const headerBottom = document.querySelector('header.fixed')?.getBoundingClientRect().bottom ?? 0;
            const top = Math.max(viewportTop, headerBottom);
            const bottom = viewportTop + (viewport?.height ?? window.innerHeight);
            const right = viewportLeft + (viewport?.width ?? window.innerWidth);
            return cards.every(card => {
                const rect = card.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && rect.top >= top - 1
                    && rect.bottom <= bottom + 1 && rect.left >= viewportLeft - 1 && rect.right <= right + 1;
            });
        };

        const stop = () => {
            window.clearTimeout(timer);
            timer = undefined;
            if (frame !== undefined) window.cancelAnimationFrame(frame);
            if (savedStyles) {
                container.style.scrollSnapType = savedStyles.snap;
                container.style.scrollBehavior = savedStyles.behavior;
                savedStyles = undefined;
            }
            isNudging.current = false;
        };

        const cancel = () => {
            if (!media.matches && !isNudging.current) return;
            hasNudged.current = true;
            stop();
        };
        stopRef.current = cancel;

        const start = () => {
            timer = undefined;
            if (touchStart || !fullyVisible()) return;
            if (container.scrollLeft > 1 || !media.matches || document.hidden) {
                cancel();
                return;
            }
            const distance = Math.min(container.clientWidth / 2, container.scrollWidth - container.clientWidth);
            if (distance <= 0) {
                cancel();
                return;
            }

            hasNudged.current = true;
            savedStyles = { snap: container.style.scrollSnapType, behavior: container.style.scrollBehavior };
            container.style.scrollSnapType = 'none';
            container.style.scrollBehavior = 'auto';
            isNudging.current = true;
            let startedAt: number | undefined;
            const ease = (progress: number) => (1 - Math.cos(Math.PI * progress)) / 2;

            const animate = (now: number) => {
                startedAt ??= now;
                const elapsed = now - startedAt;
                if (elapsed >= 1450) {
                    container.scrollLeft = 0;
                    stop();
                    return;
                }
                const progress = elapsed < 600
                    ? ease(elapsed / 600)
                    : elapsed < 800 ? 1 : 1 - ease((elapsed - 800) / 650);
                container.scrollLeft = distance * progress;
                frame = window.requestAnimationFrame(animate);
            };
            frame = window.requestAnimationFrame(animate);
        };

        const checkVisibility = () => {
            window.clearTimeout(timer);
            timer = undefined;
            if (!media.matches) {
                stop();
                return;
            }
            if (hasNudged.current && !isNudging.current) return;
            if (!fullyVisible()) {
                if (isNudging.current) stop();
                return;
            }
            if (!hasNudged.current && !touchStart) timer = window.setTimeout(start, 700);
        };

        const onTouchStart = (event: TouchEvent) => {
            const touch = event.touches[0];
            if (touch) touchStart = { x: touch.clientX, y: touch.clientY };
            stop();
        };
        const onTouchMove = (event: TouchEvent) => {
            const touch = event.touches[0];
            if (!touchStart || !touch) return;
            const deltaX = touch.clientX - touchStart.x;
            const deltaY = touch.clientY - touchStart.y;
            if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY)) cancel();
        };
        const onTouchEnd = () => {
            touchStart = undefined;
            checkVisibility();
        };
        const onPointerDown = (event: PointerEvent) => {
            if (event.pointerType !== 'touch') cancel();
        };
        const onWheel = (event: WheelEvent) => {
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) cancel();
            else checkVisibility();
        };
        const onCatalogueScroll = () => {
            if (!isNudging.current && container.scrollLeft > 1) cancel();
        };
        const onVisibilityChange = () => {
            if (document.hidden) cancel();
            else checkVisibility();
        };
        const onMediaChange = () => {
            if (media.matches) checkVisibility();
            else stop();
        };

        const interactions: Array<[string, EventListener]> = [
            ['touchstart', onTouchStart as EventListener],
            ['touchmove', onTouchMove as EventListener],
            ['touchend', onTouchEnd],
            ['touchcancel', onTouchEnd],
            ['pointerdown', onPointerDown as EventListener],
            ['wheel', onWheel as EventListener],
            ['keydown', cancel],
            ['focusin', cancel],
        ];
        interactions.forEach(([event, handler]) => interactionArea.addEventListener(event, handler, { passive: true }));
        container.addEventListener('scroll', onCatalogueScroll, { passive: true });
        window.addEventListener('scroll', checkVisibility, { passive: true });
        window.addEventListener('resize', checkVisibility);
        window.visualViewport?.addEventListener('scroll', checkVisibility);
        window.visualViewport?.addEventListener('resize', checkVisibility);
        media.addEventListener('change', onMediaChange);
        document.addEventListener('visibilitychange', onVisibilityChange);
        const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(checkVisibility);
        resizeObserver?.observe(container);
        checkVisibility();

        return () => {
            stop();
            interactions.forEach(([event, handler]) => interactionArea.removeEventListener(event, handler));
            container.removeEventListener('scroll', onCatalogueScroll);
            window.removeEventListener('scroll', checkVisibility);
            window.removeEventListener('resize', checkVisibility);
            window.visualViewport?.removeEventListener('scroll', checkVisibility);
            window.visualViewport?.removeEventListener('resize', checkVisibility);
            media.removeEventListener('change', onMediaChange);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            resizeObserver?.disconnect();
            stopRef.current = () => {};
        };
    }, [scrollRef, interactionRef, pageCount]);

    return {
        isNudging,
        cancelNudge: () => {
            hasNudged.current = true;
            stopRef.current();
        },
    };
};

export default useSwipeNudge;
