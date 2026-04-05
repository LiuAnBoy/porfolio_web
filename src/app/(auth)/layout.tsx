"use client";

import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

import { adminTheme } from "@/styles/adminTheme";

/** Props for the AuthLayout component. */
interface AuthLayoutProps {
  /** Page content to be centered on screen. */
  children: ReactNode;
}

/**
 * Auth route group layout.
 * Applies the admin theme and provides a full-viewport centered container
 * for unauthenticated pages such as the login page.
 *
 * @param props - {@link AuthLayoutProps}
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ThemeProvider theme={adminTheme}>
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
    </ThemeProvider>
  );
}
