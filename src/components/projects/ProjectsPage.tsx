"use client";

import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";

import { getProjects } from "@/services/projects/api";
import type { Project, ProjectType } from "@/services/projects/types";

import ProjectDrawer from "./ProjectDrawer";
import ProjectFilters from "./ProjectFilters";
import ProjectGrid from "./ProjectGrid";

const INITIAL_LOAD_COUNT = 15;
const PAGE_LIMIT = 12;

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

const PageDescription = styled(Typography)({
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: "1.125rem",
});

interface InitialData {
  projects: Project[];
  featuredCount: number;
  nonFeaturedPage: number;
  nonFeaturedTotal: number;
}

interface ProjectsPageProps {
  initialData: InitialData | null;
}

/**
 * Projects page client component with filters, grid and drawer.
 */
const ProjectsPage = ({ initialData }: ProjectsPageProps) => {
  const [projects, setProjects] = useState<Project[]>(
    initialData?.projects ?? [],
  );
  const [featuredCount] = useState(initialData?.featuredCount ?? 0);
  const [nonFeaturedPage, setNonFeaturedPage] = useState(
    initialData?.nonFeaturedPage ?? 0,
  );
  const [nonFeaturedTotal, setNonFeaturedTotal] = useState(
    initialData?.nonFeaturedTotal ?? 0,
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const [selectedType, setSelectedType] = useState<ProjectType | undefined>(
    undefined,
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Calculate if there are more non-featured projects to load
  const nonFeaturedLoaded = projects.length - featuredCount;
  const hasNextPage = nonFeaturedLoaded < nonFeaturedTotal;

  /**
   * Fetch initial projects (featured + non-featured).
   */
  const fetchInitialProjects = useCallback(
    async (type?: ProjectType) => {
      try {
        // Step 1: Fetch all featured projects
        const featuredResponse = await getProjects({
          isVisible: true,
          isFeatured: true,
          type,
          page: 1,
          limit: 100,
        });

        const featuredProjects = featuredResponse.data;
        const newFeaturedCount = featuredProjects.length;

        // Step 2: Calculate how many non-featured we need
        const nonFeaturedNeeded = Math.max(
          0,
          INITIAL_LOAD_COUNT - newFeaturedCount,
        );

        let nonFeaturedProjects: Project[] = [];
        let newNonFeaturedTotal = 0;

        if (nonFeaturedNeeded > 0) {
          const nonFeaturedResponse = await getProjects({
            isVisible: true,
            isFeatured: false,
            type,
            page: 1,
            limit: nonFeaturedNeeded,
          });

          nonFeaturedProjects = nonFeaturedResponse.data;
          setNonFeaturedPage(nonFeaturedResponse.page);
          newNonFeaturedTotal = nonFeaturedResponse.total;
        } else {
          const nonFeaturedResponse = await getProjects({
            isVisible: true,
            isFeatured: false,
            type,
            page: 1,
            limit: 1,
          });
          newNonFeaturedTotal = nonFeaturedResponse.total;
          setNonFeaturedPage(0);
        }

        setNonFeaturedTotal(newNonFeaturedTotal);
        setProjects([...featuredProjects, ...nonFeaturedProjects]);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    },
    [],
  );

  /**
   * Load next page of non-featured projects.
   */
  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const response = await getProjects({
        isVisible: true,
        isFeatured: false,
        type: selectedType,
        page: nonFeaturedPage + 1,
        limit: PAGE_LIMIT,
      });

      setProjects((prev) => [...prev, ...response.data]);
      setNonFeaturedPage(response.page);
    } catch (error) {
      console.error("Failed to fetch next page:", error);
    }
    setIsFetchingNextPage(false);
  }, [isFetchingNextPage, hasNextPage, nonFeaturedPage, selectedType]);

  /**
   * Handle filter type change.
   */
  const handleTypeChange = useCallback(
    async (type: ProjectType | undefined) => {
      setSelectedType(type);
      setIsLoading(true);
      setProjects([]);
      await fetchInitialProjects(type);
      setIsLoading(false);
    },
    [fetchInitialProjects],
  );

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  /**
   * Fetch initial data if not provided via SSR.
   */
  useEffect(() => {
    if (!initialData) {
      fetchInitialProjects().then(() => setIsLoading(false));
    }
  }, [initialData, fetchInitialProjects]);

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <PageHeader>
          <PageTitle>Projects</PageTitle>
          <PageDescription>
            A collection of projects I&apos;ve worked on
          </PageDescription>
        </PageHeader>

        <ProjectFilters type={selectedType} onTypeChange={handleTypeChange} />

        <ProjectGrid
          projects={projects}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          onProjectClick={handleProjectClick}
        />
      </Container>

      <ProjectDrawer
        project={selectedProject}
        open={drawerOpen}
        onClose={handleDrawerClose}
      />
    </PageContainer>
  );
};

export default ProjectsPage;
