import type { ImageRefData } from "./image";

/**
 * Project type enum
 */
export type ProjectType = "WEB" | "APP" | "HYBRID";

export const PROJECT_TYPE_OPTIONS: { label: string; value: ProjectType }[] = [
  { label: "Web", value: "WEB" },
  { label: "App", value: "APP" },
  { label: "Hybrid", value: "HYBRID" },
];

/**
 * Populated tag/stack reference
 */
export interface PopulatedRef {
  id: string;
  label: string;
  slug: string;
}

/**
 * Project data (API response)
 */
export interface ProjectData {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description: string;
  type: ProjectType;
  tags: PopulatedRef[];
  stacks: PopulatedRef[];
  isFeatured: boolean;
  isVisible: boolean;
  link: string | null;
  partner: string | null;
  cover: ImageRefData | null;
  gallery: ImageRefData[];
  createdAt: number;
  updatedAt: number | null;
}

/**
 * Project payload for create/update
 */
export interface ProjectPayload {
  userId?: string;
  title: string;
  description: string;
  type: ProjectType;
  tags?: string[];
  stacks?: string[];
  isFeatured?: boolean;
  isVisible?: boolean;
  link?: string | null;
  partner?: string | null;
  cover?: string | null;
  gallery?: string[];
}

/**
 * Project list query params
 */
export interface ProjectListParams {
  type?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
  tags?: string;
  stacks?: string;
  page?: number;
  limit?: number;
}
