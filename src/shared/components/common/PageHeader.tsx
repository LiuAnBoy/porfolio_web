"use client";

import { Box, Divider, Typography } from "@mui/material";
import { ReactNode } from "react";

/** Props for PageHeader component */
interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional action element displayed on the right */
  action?: ReactNode;
}

/**
 * Page header with title typography, optional right-aligned action, and a divider.
 *
 * @param props - PageHeaderProps
 */
export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h5" component="h1" fontWeight={600}>
          {title}
        </Typography>
        {action && <Box>{action}</Box>}
      </Box>
      <Divider />
    </Box>
  );
}
