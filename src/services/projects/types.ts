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
  page_size?: number;
}

export interface GetProjectsResponse {
  payload: Project[];
  total_count: number;
  page_size: number;
  page: number;
}
