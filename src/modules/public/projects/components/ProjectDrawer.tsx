"use client";

import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";
import StarIcon from "@mui/icons-material/Star";
import { Box, Chip, Drawer, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";

import type { Project } from "@/services/projects/types";

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
  padding: "0",
});

const CoverSection = styled(Box)({
  position: "relative",
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
});

const ContentSection = styled(Box)({
  padding: "32px 24px",
  maxWidth: 900,
  margin: "0 auto",
});

const Title = styled(Typography)({
  color: "#fff",
  fontWeight: 700,
  fontSize: "2rem",
  lineHeight: 1.3,
  marginBottom: 16,
});

const FeaturedBadge = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 10px",
  borderRadius: 16,
  backgroundColor: "rgba(251, 191, 36, 0.15)",
  border: "1px solid rgba(251, 191, 36, 0.3)",
  color: "#fbbf24",
  fontSize: "0.75rem",
  fontWeight: 600,
  marginBottom: 16,
});

const FeaturedIcon = styled(StarIcon)({
  fontSize: "0.875rem",
});

const Description = styled(Box)({
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "1rem",
  lineHeight: 1.8,
  marginBottom: 24,
  "& p": {
    margin: "0 0 16px 0",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  "& a": {
    color: "rgba(165, 180, 252, 1)",
    textDecoration: "underline",
  },
  "& ul, & ol": {
    paddingLeft: 24,
    margin: "0 0 16px 0",
  },
  "& li": {
    marginBottom: 8,
  },
});

const SectionTitle = styled(Typography)({
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 12,
});

const TagsContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 24,
});

const StacksContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 24,
});

const TagChip = styled(Chip)({
  height: 28,
  fontSize: "0.8rem",
  backgroundColor: "rgba(99, 102, 241, 0.2)",
  color: "rgba(165, 180, 252, 1)",
  border: "1px solid rgba(99, 102, 241, 0.3)",
});

const StackChip = styled(Chip)({
  height: 28,
  fontSize: "0.8rem",
  backgroundColor: "rgba(16, 185, 129, 0.15)",
  color: "rgba(110, 231, 183, 1)",
  border: "1px solid rgba(16, 185, 129, 0.25)",
});

const MetaInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginBottom: 32,
  padding: 20,
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  borderRadius: 12,
  border: "1px solid rgba(255, 255, 255, 0.06)",
});

const MetaRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

const MetaLabel = styled(Typography)({
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "0.875rem",
  minWidth: 80,
});

const MetaValue = styled(Typography)({
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "0.875rem",
});

const LinkButton = styled("a")({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  borderRadius: 8,
  padding: "10px 20px",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
});

interface ProjectDrawerProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen drawer displaying project details.
 */
const ProjectDrawer = ({ project, open, onClose }: ProjectDrawerProps) => {
  if (!project) return null;

  const projectTypeLabels = {
    WEB: "Web Application",
    APP: "Mobile App",
    HYBRID: "Hybrid App",
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose}>
      <DrawerContainer>
        <DrawerHeader>
          <Typography
            variant="h6"
            sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}
          >
            Project Details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <DrawerContent>
          {/* Cover Image */}
          <CoverSection>
            {project.cover ? (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  maxHeight: "65vh",
                }}
              >
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  maxHeight: "65vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255, 255, 255, 0.1)",
                  fontSize: "6rem",
                  fontWeight: 700,
                }}
              >
                {project.title.charAt(0).toUpperCase()}
              </Box>
            )}
          </CoverSection>

          <ContentSection>
            <Title>{project.title}</Title>
            {project.isFeatured && (
              <FeaturedBadge>
                <FeaturedIcon />
                Featured
              </FeaturedBadge>
            )}
            <Description
              dangerouslySetInnerHTML={{ __html: project.description }}
            />

            {/* Meta Info */}
            <MetaInfo>
              <MetaRow>
                <MetaLabel>Type</MetaLabel>
                <MetaValue>{projectTypeLabels[project.type]}</MetaValue>
              </MetaRow>
              {project.partner && (
                <MetaRow>
                  <MetaLabel>Partner</MetaLabel>
                  <MetaValue>{project.partner}</MetaValue>
                </MetaRow>
              )}
            </MetaInfo>

            {/* Tags */}
            {project.tags.length > 0 && (
              <>
                <SectionTitle>Tags</SectionTitle>
                <TagsContainer>
                  {project.tags.map((tag) => (
                    <TagChip key={tag.id} label={tag.label} />
                  ))}
                </TagsContainer>
              </>
            )}

            {/* Stacks */}
            {project.stacks.length > 0 && (
              <>
                <SectionTitle>Tech Stack</SectionTitle>
                <StacksContainer>
                  {project.stacks.map((stack) => (
                    <StackChip key={stack.id} label={stack.label} />
                  ))}
                </StacksContainer>
              </>
            )}

            {/* Project Link */}
            {project.link && (
              <Box sx={{ mt: 4 }}>
                <LinkButton
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project
                  <LaunchIcon sx={{ fontSize: "1rem" }} />
                </LinkButton>
              </Box>
            )}
          </ContentSection>
        </DrawerContent>
      </DrawerContainer>
    </StyledDrawer>
  );
};

export default ProjectDrawer;
