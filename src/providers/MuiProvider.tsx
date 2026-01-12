"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

import { theme } from "@/shared/styles/theme";

import EmotionCacheProvider from "./EmotionCacheProvider";

/**
 * MUI Theme Provider wrapper for Next.js App Router.
 * Includes Emotion cache for proper SSR hydration.
 */
const MuiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <EmotionCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionCacheProvider>
  );
};

export default MuiProvider;
