"use client";

import { useEffect, useRef } from "react";

/**
 * Hook to fix scrolling issues in dropdown components
 * Ensures mouse wheel events are properly handled for nested scrollable containers
 */
export function useScrollFix() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow the wheel event to bubble normally for scrolling
      // But prevent it from being intercepted by parent components
      e.stopPropagation();

      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;

      // Only prevent default if we're trying to scroll beyond bounds
      if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Allow touch scrolling
      e.stopPropagation();
    };

    scrollElement.addEventListener("wheel", handleWheel, { passive: false });
    scrollElement.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      scrollElement.removeEventListener("wheel", handleWheel);
      scrollElement.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return scrollRef;
}
