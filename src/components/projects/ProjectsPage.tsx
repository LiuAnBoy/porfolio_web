"use client";

import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";

import { getProjects } from "@/services/projects/api";
import type { Project, ProjectType } from "@/services/projects/types";

import ProjectDrawer from "./ProjectDrawer";
import ProjectFilters from "./ProjectFilters";
import ProjectGrid from "./ProjectGrid";

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
  page: number;
  total: number;
  limit: number;
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
  const [currentPage, setCurrentPage] = useState(initialData?.page ?? 1);
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const [selectedType, setSelectedType] = useState<ProjectType | undefined>(
    undefined,
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasNextPage = projects.length < total;

  /**
   * Fetch projects from API.
   */
  const fetchProjects = useCallback(
    async (page: number, type?: ProjectType, reset = false) => {
      try {
        const response = await getProjects({
          isVisible: true,
          type,
          page,
          limit: PAGE_LIMIT,
        });

        if (reset) {
          setProjects(response.data);
        } else {
          setProjects((prev) => [...prev, ...response.data]);
        }
        setCurrentPage(response.page);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    },
    [],
  );

  /**
   * Load next page of projects.
   */
  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) return;

    setIsFetchingNextPage(true);
    await fetchProjects(currentPage + 1, selectedType);
    setIsFetchingNextPage(false);
  }, [
    isFetchingNextPage,
    hasNextPage,
    currentPage,
    selectedType,
    fetchProjects,
  ]);

  /**
   * Handle filter type change.
   */
  const handleTypeChange = useCallback(
    async (type: ProjectType | undefined) => {
      setSelectedType(type);
      setIsLoading(true);
      setProjects([]);
      await fetchProjects(1, type, true);
      setIsLoading(false);
    },
    [fetchProjects],
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
      fetchProjects(1).then(() => setIsLoading(false));
    }
  }, [initialData, fetchProjects]);

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
