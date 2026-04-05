"use client";

import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useRef } from "react";

import type { Project } from "@/services/projects/types";

import ProjectCard from "./ProjectCard";

const GridContainer = styled(Box)({
  width: "100%",
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 0",
});

const EmptyState = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 20px",
  textAlign: "center",
});

const LoadMoreTrigger = styled(Box)({
  height: 20,
  width: "100%",
});

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  onProjectClick: (project: Project) => void;
}

/**
 * Project grid with infinite scroll functionality.
 */
const ProjectGrid = ({
  projects,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onProjectClick,
}: ProjectGridProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "800px",
      threshold: 0,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
      </LoadingContainer>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState>
        <Typography
          variant="h6"
          sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 1 }}
        >
          No projects found
        </Typography>
        <Typography sx={{ color: "rgba(255, 255, 255, 0.3)" }}>
          Try adjusting your filters
        </Typography>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProjectCard
              project={project}
              onClick={() => onProjectClick(project)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Infinite scroll trigger */}
      <LoadMoreTrigger ref={loadMoreRef} />

      {isFetchingNextPage && (
        <LoadingContainer>
          <CircularProgress
            size={32}
            sx={{ color: "rgba(255, 255, 255, 0.5)" }}
          />
        </LoadingContainer>
      )}
    </GridContainer>
  );
};

export default ProjectGrid;
