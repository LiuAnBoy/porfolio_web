"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";

/** Props for the AuthLayout component. */
interface AuthLayoutProps {
  /** Page content to be centered on screen. */
  children: ReactNode;
}

/**
 * Auth route group layout.
 * Provides a full-viewport centered container for unauthenticated pages
 * such as the login page. No sidebar or navigation is rendered.
 *
 * @param props - {@link AuthLayoutProps}
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      {children}
    </Box>
  );
}
