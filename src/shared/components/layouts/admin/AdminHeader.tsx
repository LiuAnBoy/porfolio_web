'use client';

import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { signOut } from 'next-auth/react';

/** Props for the AdminHeader component. */
export interface AdminHeaderProps {
  /** Called when the hamburger menu icon is clicked (mobile only). */
  onMenuClick: () => void;
  /** Email address of the currently authenticated user. */
  userEmail?: string;
}

/**
 * Admin dashboard AppBar component.
 * Renders a fixed top navigation bar with a mobile hamburger menu on the left
 * and the current user's email plus a logout button on the right.
 *
 * @param props - {@link AdminHeaderProps}
 */
export function AdminHeader({ onMenuClick, userEmail }: AdminHeaderProps) {
  /** Handles sign-out and redirects to the admin login page. */
  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 3 } }}>
        {/* Mobile hamburger menu */}
        <IconButton
          color="inherit"
          aria-label="open menu"
          edge="start"
          onClick={onMenuClick}
          sx={{
            display: { xs: 'flex', md: 'none' },
            mr: 1,
            color: 'text.secondary',
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* User email + logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {userEmail && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {userEmail}
            </Typography>
          )}

          <Tooltip title="登出">
            <IconButton
              onClick={handleLogout}
              aria-label="logout"
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
