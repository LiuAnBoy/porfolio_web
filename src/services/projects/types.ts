export type ProjectType = "WEB" | "APP" | "HYBRID";

export interface ProjectRef {
  id: string;
  label: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ProjectType;
  tags: ProjectRef[];
  stacks: ProjectRef[];
  isFeatured: boolean;
  isVisible: boolean;
  link: string | null;
  partner: string | null;
  cover: string | null;
  gallery: string[];
}

export interface GetProjectsParams {
  type?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
  tags?: string;
  stacks?: string;
  page?: number;
  limit?: number;
}

export interface GetProjectsResponse {
  success: boolean;
  data: Project[];
  page: number;
  limit: number;
  total: number;
  message?: string;
}
