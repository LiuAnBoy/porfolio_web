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
 * Initial load target count.
 */
const INITIAL_LOAD_COUNT = 15;

/**
 * Page limit for infinite scroll.
 */
const PAGE_LIMIT = 12;

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
  featuredCount: number;
  nonFeaturedLoaded: number;
  nonFeaturedTotal: number;
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
 * Cached function to get initial projects.
 * Fetches all featured projects first, then fills up to INITIAL_LOAD_COUNT with non-featured.
 */
export const getInitialProjects = unstable_cache(
  async (): Promise<InitialProjectsData | null> => {
    try {
      // Step 1: Fetch all featured projects
      const featuredResponse = await getProjects({
        isVisible: true,
        isFeatured: true,
        page: 1,
        limit: 100, // Get all featured
      });

      const featuredProjects = featuredResponse.data;
      const featuredCount = featuredProjects.length;

      // Step 2: Calculate how many non-featured we need
      const nonFeaturedNeeded = Math.max(0, INITIAL_LOAD_COUNT - featuredCount);

      let nonFeaturedProjects: Project[] = [];
      let nonFeaturedTotal = 0;

      if (nonFeaturedNeeded > 0) {
        // Use PAGE_LIMIT for consistent pagination
        const nonFeaturedResponse = await getProjects({
          isVisible: true,
          isFeatured: false,
          page: 1,
          limit: PAGE_LIMIT,
        });

        // Take only what we need for initial display
        nonFeaturedProjects = nonFeaturedResponse.data.slice(
          0,
          nonFeaturedNeeded,
        );
        nonFeaturedTotal = nonFeaturedResponse.total;
      } else {
        // Still need to know total non-featured count
        const nonFeaturedResponse = await getProjects({
          isVisible: true,
          isFeatured: false,
          page: 1,
          limit: 1,
        });
        nonFeaturedTotal = nonFeaturedResponse.total;
      }

      // Step 3: Combine - featured first, then non-featured
      const projects = [...featuredProjects, ...nonFeaturedProjects];

      return {
        projects,
        featuredCount,
        nonFeaturedLoaded: nonFeaturedProjects.length,
        nonFeaturedTotal,
      };
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      return null;
    }
  },
  ["initial-projects"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
