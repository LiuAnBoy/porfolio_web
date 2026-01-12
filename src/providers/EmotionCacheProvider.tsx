"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

/**
 * Emotion cache provider for Next.js App Router.
 * Handles SSR hydration for MUI styles.
 */
const EmotionCacheProvider = ({ children }: { children: ReactNode }) => {
  const [cache] = useState(() => {
    const cache = createCache({ key: "mui" });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) return null;

    const names = entries
      .filter(([, value]) => typeof value !== "boolean")
      .map(([name]) => name)
      .join(" ");

    const styles = entries
      .filter(([, value]) => typeof value !== "boolean")
      .map(([, value]) => value)
      .join("");

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default EmotionCacheProvider;
