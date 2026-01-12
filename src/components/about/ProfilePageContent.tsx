"use client";

import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { User } from "@/services/user/types";

import ExperienceList from "./ExperienceList";
import ProfileSection from "./ProfileSection";

interface ProfilePageContentProps {
  user: User | null;
}

const PageContainer = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#0a0a0a",
  paddingTop: 80,
  paddingBottom: 60,
  "@media (max-width: 767px)": {
    paddingTop: 72,
  },
});

const PageHeader = styled(Box)({
  marginBottom: 40,
});

const PageTitle = styled(Typography)({
  color: "#fff",
  fontWeight: 700,
  fontSize: "2.5rem",
  marginBottom: 12,
});

const ErrorContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 400,
  textAlign: "center",
});

/**
 * Profile page content - Client component for UI rendering.
 */
export default function ProfilePageContent({ user }: ProfilePageContentProps) {
  if (!user) {
    return (
      <PageContainer>
        <Container maxWidth="md">
          <ErrorContainer>
            <Typography
              variant="h6"
              sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 1 }}
            >
              Failed to load profile
            </Typography>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.3)" }}>
              Please try again later
            </Typography>
          </ErrorContainer>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="md">
        <PageHeader>
          <PageTitle>Brief Introduction</PageTitle>
        </PageHeader>

        <ProfileSection
          name={user.name}
          title={user.title}
          bio={user.bio}
          avatar={user.avatar}
          socials={user.socials}
        />

        <ExperienceList experiences={user.experiences} />
      </Container>
    </PageContainer>
  );
}
