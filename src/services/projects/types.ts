/**
 * Project type enum.
 */
export type ProjectType = "WEB" | "APP" | "HYBRID";

/**
 * Tag associated with a project.
 */
export interface Tag {
  id: string;
  label: string;
  slug: string;
}

/**
 * Technology stack used in a project.
 */
export interface Stack {
  id: string;
  label: string;
  slug: string;
}

/**
 * Project entity.
 */
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ProjectType;
  tags: Tag[];
  stacks: Stack[];
  isFeatured: boolean;
  isVisible: boolean;
  link: string | null;
  partner: string | null;
  cover: string | null;
  gallery: string[];
}

/**
 * Query parameters for fetching projects.
 */
export interface ProjectsParams {
  type?: ProjectType;
  isFeatured?: boolean;
  isVisible?: boolean;
  tags?: string;
  stacks?: string;
  page?: number;
  limit?: number;
}

/**
 * Paginated response for projects.
 */
export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  page: number;
  limit: number;
  total: number;
}

/**
 * Error response format.
 */
export interface ApiError {
  success: false;
  message: string;
}
