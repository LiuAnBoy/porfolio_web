import type { Metadata } from "next";

import { ProjectsPage } from "@/components/projects";
import { getInitialProjects } from "@/lib/getData";

const PROJECTS_DESCRIPTION =
  "A showcase of web development projects featuring React, Next.js, TypeScript, and modern frontend technologies.";

/**
 * Generate metadata for projects page.
 */
export const metadata: Metadata = {
  title: "Projects",
  description: PROJECTS_DESCRIPTION,
  openGraph: {
    title: "Projects",
    description: PROJECTS_DESCRIPTION,
    images: [{ url: "/images/logo.png" }],
  },
};

/**
 * Projects page - SSR with cached data.
 */
export default async function Projects() {
  try {
    const initialData = await getInitialProjects();
    return <ProjectsPage initialData={initialData} />;
  } catch (error) {
    console.error("Failed to load projects:", error);
    return <ProjectsPage initialData={null} />;
  }
}
