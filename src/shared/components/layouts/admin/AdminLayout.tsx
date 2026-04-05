"use client";

import { Box } from "@mui/material";
import { type ReactNode, useState } from "react";

import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

/** Props for the AdminLayout component. */
export interface AdminLayoutProps {
  /** Page content rendered inside the main content area. */
  children: ReactNode;
  /** Email address of the currently authenticated user. */
  userEmail?: string;
}

/**
 * Admin dashboard shell layout.
 * Composes the {@link AdminSidebar} and {@link AdminHeader} around a scrollable
 * content area. On desktop the sidebar is always visible (240px wide); on mobile
 * it is hidden behind a collapsible MUI Drawer that is toggled by the header
 * hamburger button.
 *
 * @param props - {@link AdminLayoutProps}
 */
export function AdminLayout({ children, userEmail }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  /** Opens the mobile sidebar drawer. */
  const handleMenuClick = () => setMobileOpen(true);

  /** Closes the mobile sidebar drawer. */
  const handleSidebarClose = () => setMobileOpen(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminSidebar open={mobileOpen} onClose={handleSidebarClose} />

      {/* Header */}
      <AdminHeader onMenuClick={handleMenuClick} userEmail={userEmail} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          marginLeft: { xs: 0, md: "240px" },
          marginTop: "64px",
          padding: { xs: 2, md: 3 },
          minHeight: "calc(100vh - 64px)",
          overflowY: "auto",
          bgcolor: "background.default",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
