"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type RefObject,
} from "react";

interface ScrollContainerContextType {
  scrollContainerRef: RefObject<HTMLElement | null> | null;
  setScrollContainerRef: (ref: RefObject<HTMLElement | null> | null) => void;
}

const ScrollContainerContext = createContext<ScrollContainerContextType>({
  scrollContainerRef: null,
  setScrollContainerRef: () => {},
});

/**
 * Provider for sharing scroll container reference across components.
 * Used by pages to register their scroll container and by Navbar to detect scroll.
 */
export function ScrollContainerProvider({ children }: { children: ReactNode }) {
  const [scrollContainerRef, setScrollContainerRefState] =
    useState<RefObject<HTMLElement | null> | null>(null);

  const setScrollContainerRef = useCallback(
    (ref: RefObject<HTMLElement | null> | null) => {
      setScrollContainerRefState(ref);
    },
    [],
  );

  return (
    <ScrollContainerContext.Provider
      value={{ scrollContainerRef, setScrollContainerRef }}
    >
      {children}
    </ScrollContainerContext.Provider>
  );
}

/**
 * Hook to access scroll container context.
 */
export function useScrollContainer() {
  return useContext(ScrollContainerContext);
}
