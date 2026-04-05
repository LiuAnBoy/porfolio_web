"use client";

import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { PageHeader } from "@/shared/components/common";

import { useUser } from "../hooks/useUserQueries";
import { ExperienceTab } from "./ExperienceTab";
import { ProfileTab } from "./ProfileTab";

/** Tab panel wrapper */
interface TabPanelProps {
  /** Currently active tab index */
  value: number;
  /** This panel's index */
  index: number;
  /** Content to render */
  children: React.ReactNode;
}

/**
 * Tab panel that renders content only when active.
 *
 * @param props - TabPanelProps
 */
function TabPanel({ value, index, children }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
      {value === index && children}
    </Box>
  );
}

/**
 * User management page with tabs for profile and experience.
 * Gets the userId from the current session.
 */
export function UserPage() {
  const { data: session, status: sessionStatus } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";

  const { data: user, isLoading } = useUser(userId);

  const [tabIndex, setTabIndex] = useState(0);

  if (sessionStatus === "loading" || isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userId || !user) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="error">Unable to load user data.</Typography>
      </Box>
    );
  }

  return (
    <>
      <PageHeader title="個人設定" />

      <Tabs
        value={tabIndex}
        onChange={(_, newValue: number) => setTabIndex(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="個人資料" />
        <Tab label="工作經歷" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <ProfileTab user={user} />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <ExperienceTab userId={userId} />
      </TabPanel>
    </>
  );
}
