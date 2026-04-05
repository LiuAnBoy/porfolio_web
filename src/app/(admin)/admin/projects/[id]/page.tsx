import type { Metadata } from "next";

import { ProjectForm } from "@/modules/admin/projects/components/ProjectForm";

export const metadata: Metadata = {
  title: "編輯專案",
  robots: "noindex, nofollow",
};

/** Route params for the edit project page */
interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Admin edit project page.
 */
export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  return <ProjectForm mode="edit" projectId={id} />;
}
