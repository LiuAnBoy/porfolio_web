"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Slide,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { keyframes, styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { Social } from "@/services/user/types";
import { useScrollContainer } from "@/shared/contexts";
import { useHideOnScroll } from "@/shared/hooks";
import { SocialIcons } from "@/shared/components";
import { NAV_ITEMS } from "@/shared/constants/navigation";

/**
 * Border drawing animations - clockwise from top-right.
 */
const drawRight = keyframes`
  0% { transform: scaleY(0); }
  100% { transform: scaleY(1); }
`;

const drawBottom = keyframes`
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
`;

const drawLeft = keyframes`
  0% { transform: scaleY(0); }
  100% { transform: scaleY(1); }
`;

const drawTop = keyframes`
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
`;

const NavLinkWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive: boolean }>(({ isActive }) => ({
  position: "relative",
  display: "inline-block",

  "& .nav-link": {
    display: "block",
    width: 108,
    padding: "8px 0",
    textAlign: "center",
    color: isActive ? "#fff" : "rgba(255, 255, 255, 0.7)",
    fontWeight: 500,
    fontSize: "0.875rem",
    textDecoration: "none",
    position: "relative",
    zIndex: 1,
    transition: "color 0.3s ease",
  },

  // Border container
  "& .border-box": {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },

  // Individual border lines
  "& .border-line": {
    position: "absolute",
    backgroundColor: "#fff",
  },

  // Right border (top to bottom)
  "& .border-right": {
    top: 0,
    right: 0,
    width: "1.5px",
    height: "100%",
    transformOrigin: "top",
    transform: isActive ? "scaleY(1)" : "scaleY(0)",
  },

  // Bottom border (right to left)
  "& .border-bottom": {
    bottom: 0,
    right: 0,
    width: "100%",
    height: "1.5px",
    transformOrigin: "right",
    transform: isActive ? "scaleX(1)" : "scaleX(0)",
  },

  // Left border (bottom to top)
  "& .border-left": {
    bottom: 0,
    left: 0,
    width: "1.5px",
    height: "100%",
    transformOrigin: "bottom",
    transform: isActive ? "scaleY(1)" : "scaleY(0)",
  },

  // Top border (left to right)
  "& .border-top": {
    top: 0,
    left: 0,
    width: "100%",
    height: "1.5px",
    transformOrigin: "left",
    transform: isActive ? "scaleX(1)" : "scaleX(0)",
  },

  "&:hover .nav-link": {
    color: "#fff",
  },

  // Hover animations (sequential timing)
  "&:hover .border-right": {
    animation: isActive ? "none" : `${drawRight} 0.15s ease-out forwards`,
  },

  "&:hover .border-bottom": {
    animation: isActive ? "none" : `${drawBottom} 0.2s ease-out 0.15s forwards`,
  },

  "&:hover .border-left": {
    animation: isActive ? "none" : `${drawLeft} 0.15s ease-out 0.35s forwards`,
  },

  "&:hover .border-top": {
    animation: isActive ? "none" : `${drawTop} 0.2s ease-out 0.5s forwards`,
  },
}));

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    width: "100%",
    backgroundColor: "#0a0a0a",
    backgroundImage: "none",
    overflow: "hidden",
  },
});

const DrawerContainer = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const DrawerHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 24px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  flexShrink: 0,
});

const DrawerContent = styled(Box)({
  flex: 1,
  overflow: "auto",
  padding: "24px 0",
});

const DrawerNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive: boolean }>(({ isActive }) => ({
  padding: "16px 32px",
  borderLeft: isActive ? "3px solid #22d3ee" : "3px solid transparent",
  backgroundColor: isActive ? "rgba(255, 255, 255, 0.03)" : "transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
}));

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

/**
 * Navigation link with animated border effect.
 * Border draws clockwise starting from top-right corner.
 */
const NavLink = ({ href, label, isActive }: NavLinkProps) => {
  return (
    <NavLinkWrapper isActive={isActive}>
      <Link href={href} className="nav-link">
        {label}
      </Link>
      <span className="border-box">
        <span className="border-line border-right" />
        <span className="border-line border-bottom" />
        <span className="border-line border-left" />
        <span className="border-line border-top" />
      </span>
    </NavLinkWrapper>
  );
};

interface NavbarProps {
  socials: Social[];
}

/**
 * Main navigation bar component.
 * Icon on the left, navigation links on the right.
 * Includes mobile drawer for smaller screens.
 */
const Navbar = ({ socials }: NavbarProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { scrollContainerRef } = useScrollContainer();
  const hidden = useHideOnScroll(scrollContainerRef);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <Slide appear={false} direction="down" in={!hidden}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            px: { xs: 1, md: 3 },
          }}
        >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo / Icon */}
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
            <Stack direction="column">
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: "1rem",
                  lineHeight: "1",
                }}
              >
                An&apos;s
              </Typography>
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: "1rem",
                  lineHeight: "1",
                }}
              >
                Portfolio
              </Typography>
            </Stack>
          </Link>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box component="nav" sx={{ display: "flex", gap: 2 }}>
              {NAV_ITEMS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    isActive={isActive}
                  />
                );
              })}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
        </AppBar>
      </Slide>

      {/* Mobile Drawer */}
      <StyledDrawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <DrawerContainer>
          <DrawerHeader>
            <Typography
              variant="h6"
              sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}
            >
              Menu
            </Typography>
            <IconButton
              onClick={handleDrawerClose}
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              <CloseIcon />
            </IconButton>
          </DrawerHeader>

          <DrawerContent>
            <List disablePadding>
              {NAV_ITEMS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <ListItem key={href} disablePadding>
                    <Link
                      href={href}
                      style={{ width: "100%", textDecoration: "none" }}
                      onClick={handleDrawerClose}
                    >
                      <DrawerNavItem isActive={isActive}>
                        <ListItemText
                          primary={label}
                          primaryTypographyProps={{
                            sx: {
                              color: isActive
                                ? "#fff"
                                : "rgba(255, 255, 255, 0.7)",
                              fontWeight: isActive ? 600 : 400,
                              fontSize: "1.125rem",
                            },
                          }}
                        />
                      </DrawerNavItem>
                    </Link>
                  </ListItem>
                );
              })}
            </List>

            {socials.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  mx: 3,
                  pt: 3,
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <SocialIcons socials={socials} size="small" />
              </Box>
            )}
          </DrawerContent>
        </DrawerContainer>
      </StyledDrawer>
    </>
  );
};

export default Navbar;
