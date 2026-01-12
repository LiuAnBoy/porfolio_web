import { apiClient } from "@/services/api/client";

import type { ProjectsParams, ProjectsResponse } from "./types";

/**
 * Fetch projects with optional filters and pagination.
 */
export const getProjects = async (
  params?: ProjectsParams,
): Promise<ProjectsResponse> => {
  const response = await apiClient.get<ProjectsResponse>("/projects", {
    params,
  });
  return response.data;
};
