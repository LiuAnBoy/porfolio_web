"use client";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ImageIcon from "@mui/icons-material/Image";
import LabelIcon from "@mui/icons-material/Label";
import LayersIcon from "@mui/icons-material/Layers";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DRAWER_WIDTH = 240;

/** Navigation menu item definition. */
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "儀表板",
    icon: <DashboardIcon />,
  },
  {
    href: "/admin/projects",
    label: "作品管理",
    icon: <WorkIcon />,
  },
  {
    href: "/admin/tags",
    label: "標籤管理",
    icon: <LabelIcon />,
  },
  {
    href: "/admin/stacks",
    label: "技術棧管理",
    icon: <LayersIcon />,
  },
  {
    href: "/admin/images",
    label: "圖片管理",
    icon: <ImageIcon />,
  },
  {
    href: "/admin/user",
    label: "使用者管理",
    icon: <PersonIcon />,
  },
];

/** Props for the AdminSidebar component. */
export interface AdminSidebarProps {
  /** Whether the mobile drawer is open. */
  open: boolean;
  /** Callback to close the mobile drawer. */
  onClose: () => void;
}

/**
 * Sidebar content shared between desktop and mobile drawer.
 * Renders logo/title at the top followed by navigation items.
 *
 * @param pathname - Current route pathname for active highlight.
 * @param onClose - Called when a nav item is clicked (mobile only).
 */
function SidebarContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Logo / Title */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            fontSize: "1rem",
            letterSpacing: 0.5,
          }}
        >
          Portfolio Admin
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List component="nav" sx={{ flex: 1, px: 1, py: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{ textDecoration: "none", display: "block" }}
              onClick={onClose}
            >
              <ListItemButton
                selected={isActive}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: isActive ? "primary.main" : "text.secondary",
                  "&.Mui-selected": {
                    bgcolor: "rgba(144, 202, 249, 0.08)",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "rgba(144, 202, 249, 0.12)",
                    },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "inherit",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </Link>
          );
        })}
      </List>
    </Box>
  );
}

/**
 * Admin sidebar component.
 * Renders as a fixed 240px panel on desktop and a collapsible MUI Drawer on mobile.
 *
 * @param props - {@link AdminSidebarProps}
 */
export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: (theme) => theme.zIndex.drawer,
        }}
      >
        <SidebarContent pathname={pathname} />
      </Box>

      {/* Mobile drawer — collapsible */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "background.paper",
          },
        }}
      >
        <SidebarContent pathname={pathname} onClose={onClose} />
      </Drawer>
    </>
  );
}
