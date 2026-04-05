import type { Metadata } from "next";

import { getInitialProjects } from "@/lib/getData";
import { ProjectsPage } from "@/modules/public/projects/components";

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
  let initialData = null;
  try {
    initialData = await getInitialProjects();
  } catch (error) {
    console.error("Failed to load projects:", error);
  }
  return <ProjectsPage initialData={initialData} />;
}
