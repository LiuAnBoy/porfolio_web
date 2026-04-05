import type { Metadata } from "next";

import { ProjectTable } from "@/modules/admin/projects/components/ProjectTable";

export const metadata: Metadata = {
  title: "作品管理",
  robots: "noindex, nofollow",
};

/**
 * Admin project management page.
 */
export default function ProjectsPage() {
  return <ProjectTable />;
}
