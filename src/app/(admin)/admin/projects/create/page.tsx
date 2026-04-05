import type { Metadata } from "next";

import { ProjectForm } from "@/modules/admin/projects/components/ProjectForm";

export const metadata: Metadata = {
  title: "新增專案",
  robots: "noindex, nofollow",
};

/**
 * Admin create project page.
 */
export default function CreateProjectPage() {
  return <ProjectForm mode="create" />;
}
