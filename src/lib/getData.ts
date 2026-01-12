import { unstable_cache } from "next/cache";

import { getProjects } from "@/services/projects/api";
import type { Project } from "@/services/projects/types";
import { getUserProfile } from "@/services/user/api";
import type { User } from "@/services/user/types";

/**
 * Cache revalidation time in seconds.
 * Data will be cached for 5 minutes.
 */
const CACHE_REVALIDATE_SECONDS = 60 * 5;

/**
 * Strip HTML tags from string.
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, "").trim();
};

/**
 * Initial projects data structure.
 */
export interface InitialProjectsData {
  projects: Project[];
  page: number;
  total: number;
  limit: number;
}

/**
 * Cached function to get user profile.
 * Data is cached across requests and revalidates every 5 minutes.
 */
export const getUser = unstable_cache(
  async (): Promise<User | null> => {
    try {
      const response = await getUserProfile();
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  },
  ["user-profile"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);

/**
 * Cached function to get initial projects (first page).
 * Data is cached across requests and revalidates every 5 minutes.
 */
export const getInitialProjects = unstable_cache(
  async (): Promise<InitialProjectsData | null> => {
    try {
      const response = await getProjects({
        isVisible: true,
        page: 1,
        limit: 12,
      });
      return {
        projects: response.data,
        page: response.page,
        total: response.total,
        limit: response.limit,
      };
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      return null;
    }
  },
  ["initial-projects"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
