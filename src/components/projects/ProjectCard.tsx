"use client";

import StarIcon from "@mui/icons-material/Star";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";

import type { Project } from "@/services/projects/types";

/**
 * Strip HTML tags from string.
 */
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

const StyledCard = styled(Card)({
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 16,
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    transform: "translateY(-4px)",
  },
});

const CoverWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  aspectRatio: "4 / 3",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  overflow: "hidden",
});

const StyledCardContent = styled(CardContent)({
  padding: 20,
  "&:last-child": {
    paddingBottom: 20,
  },
});

const TitleWrapper = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: 6,
  marginBottom: 8,
});

const Title = styled(Typography)({
  color: "#fff",
  fontWeight: 600,
  fontSize: "1.125rem",
  lineHeight: 1.4,
});

const FeaturedIcon = styled(StarIcon)({
  color: "#fbbf24",
  fontSize: "1rem",
  flexShrink: 0,
  marginTop: 3,
});

const Description = styled(Typography)({
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  marginBottom: 12,
});

const TagsContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  marginBottom: 8,
});

const StacksContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
});

const TagChip = styled(Chip)({
  height: 24,
  fontSize: "0.75rem",
  backgroundColor: "rgba(99, 102, 241, 0.2)",
  color: "rgba(165, 180, 252, 1)",
  border: "1px solid rgba(99, 102, 241, 0.3)",
  "& .MuiChip-label": {
    padding: "0 8px",
  },
});

const StackChip = styled(Chip)({
  height: 24,
  fontSize: "0.75rem",
  backgroundColor: "rgba(16, 185, 129, 0.15)",
  color: "rgba(110, 231, 183, 1)",
  border: "1px solid rgba(16, 185, 129, 0.25)",
  "& .MuiChip-label": {
    padding: "0 8px",
  },
});

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

/**
 * Project card component displaying cover, title, description, tags and stacks.
 */
const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const handleClick = () => {
    onClick(project);
  };

  return (
    <StyledCard elevation={0} onClick={handleClick}>
      <CoverWrapper>
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255, 255, 255, 0.2)",
              fontSize: "3rem",
            }}
          >
            {project.title.charAt(0).toUpperCase()}
          </Box>
        )}
      </CoverWrapper>

      <StyledCardContent>
        <TitleWrapper>
          {project.isFeatured && <FeaturedIcon />}
          <Title>{project.title}</Title>
        </TitleWrapper>
        <Description>{stripHtml(project.description)}</Description>

        {project.tags.length > 0 && (
          <TagsContainer>
            {project.tags.slice(0, 3).map((tag) => (
              <TagChip key={tag.id} label={tag.label} size="small" />
            ))}
          </TagsContainer>
        )}

        {project.stacks.length > 0 && (
          <StacksContainer>
            {project.stacks.slice(0, 4).map((stack) => (
              <StackChip key={stack.id} label={stack.label} size="small" />
            ))}
          </StacksContainer>
        )}
      </StyledCardContent>
    </StyledCard>
  );
};

export default ProjectCard;
