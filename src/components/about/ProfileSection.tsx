"use client";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";

import type { Social } from "@/services/user/types";
import { SocialIcons } from "@/shared/components";

const SectionContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 24,
  padding: "40px 24px",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  "@media (min-width: 768px)": {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 40,
    padding: "48px 40px",
  },
});

const AvatarWrapper = styled(Box)({
  position: "relative",
  flexShrink: 0,
});

const AvatarInner = styled(Box)({
  width: 300,
  height: 300,
  borderRadius: "50%",
  overflow: "hidden",
  backgroundColor: "#0a0a0a",
  position: "relative",
  "@media (min-width: 768px)": {
    width: 180,
    height: 180,
  },
});

const ContentWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  "@media (min-width: 768px)": {
    alignItems: "flex-start",
    textAlign: "left",
  },
});

const Name = styled(Typography)({
  color: "#fff",
  fontWeight: 700,
  fontSize: "1.75rem",
  marginBottom: 8,
  "@media (min-width: 768px)": {
    fontSize: "2rem",
  },
});

const Title = styled(Typography)({
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "1rem",
  marginBottom: 16,
  "@media (min-width: 768px)": {
    fontSize: "1.125rem",
  },
});

const Bio = styled(Box)({
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "0.9375rem",
  lineHeight: 1.8,
  marginBottom: 24,
  maxWidth: 600,
  "& p": {
    margin: "0 0 12px 0",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    color: "#fff",
    fontWeight: 600,
    margin: "0 0 8px 0",
  },
  "& h3": {
    fontSize: "1.25rem",
    "@media (max-width: 767px)": {
      fontSize: "1.1rem",
    },
  },
  "& h6": {
    fontSize: "0.95rem",
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: 500,
  },
});

interface ProfileSectionProps {
  name: string;
  title: string;
  bio: string;
  avatar: string | null;
  socials: Social[];
}

/**
 * Profile section with avatar, name, title, bio and social links.
 */
const ProfileSection = ({
  name,
  title,
  bio,
  avatar,
  socials,
}: ProfileSectionProps) => {
  return (
    <SectionContainer>
      <AvatarWrapper>
        <AvatarInner>
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255, 255, 255, 0.3)",
                fontSize: "4rem",
                fontWeight: 700,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Box>
          )}
        </AvatarInner>
      </AvatarWrapper>

      <ContentWrapper>
        <Name>{name}</Name>
        <Title>{title}</Title>
        <Bio dangerouslySetInnerHTML={{ __html: bio }} />
        <SocialIcons socials={socials} />
      </ContentWrapper>
    </SectionContainer>
  );
};

export default ProfileSection;
