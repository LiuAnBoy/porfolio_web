"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

interface UseHideOnScrollOptions {
  threshold?: number;
}

/**
 * Hook to detect scroll direction and hide/show element.
 * Returns true when scrolling down (should hide), false when scrolling up (should show).
 */
export function useHideOnScroll(
  containerRef: RefObject<HTMLElement | null> | null,
  options: UseHideOnScrollOptions = {},
): boolean {
  const { threshold = 10 } = options;
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const diff = currentScrollY - lastScrollY.current;

      // Only trigger if scroll amount exceeds threshold
      if (Math.abs(diff) < threshold) return;

      // Scrolling down -> hide, scrolling up -> show
      if (diff > 0 && currentScrollY > 100) {
        setHidden(true);
      } else if (diff < 0) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef, threshold]);

  return hidden;
}
