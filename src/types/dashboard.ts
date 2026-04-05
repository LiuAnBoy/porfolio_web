/**
 * Dashboard stats counts
 */
export interface DashboardCounts {
  projects: number;
  tags: number;
  stacks: number;
  images: number;
}

/**
 * Recent project item
 */
export interface RecentProject {
  id: string;
  name: string;
  updatedAt: number;
}

/**
 * Recent image item
 */
export interface RecentImage {
  id: string;
  url: string;
  updatedAt: number;
}

/**
 * Recent tag item
 */
export interface RecentTag {
  id: string;
  label: string;
  slug: string;
  updatedAt: number;
}

/**
 * Recent stack item
 */
export interface RecentStack {
  id: string;
  label: string;
  slug: string;
  updatedAt: number;
}

/**
 * Dashboard init response
 */
export interface DashboardInitData {
  counts: DashboardCounts;
  recentProjects: RecentProject[];
  recentImages: RecentImage[];
  recentTags: RecentTag[];
  recentStacks: RecentStack[];
}
