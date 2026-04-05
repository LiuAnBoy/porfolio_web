import http from "@/services/client";
import type { ProjectData, ProjectListParams, ProjectPayload } from "@/types";

/** Response shape for paginated project list */
interface ProjectListResponse {
  payload: ProjectData[];
  total_count: number;
  page_size: number;
  page: number;
}

/**
 * Fetch the project list with optional filters.
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to paginated project data
 */
export async function getProjectList(
  params?: ProjectListParams,
): Promise<ProjectListResponse> {
  return http.get<ProjectListResponse>("/v1/admin/projects", { params });
}

/**
 * Fetch a single project by ID.
 *
 * @param id - Project ID
 * @returns Promise resolving to ProjectData
 */
export async function getProjectDetail(id: string): Promise<ProjectData> {
  return http.get<ProjectData>(`/v1/admin/projects/${id}`);
}

/**
 * Create a new project.
 *
 * @param payload - Project creation payload
 * @returns Promise resolving to void
 */
export async function createProject(payload: ProjectPayload): Promise<void> {
  return http.post<void>("/v1/admin/projects", payload);
}

/**
 * Update an existing project.
 *
 * @param id - Project ID
 * @param payload - Project update payload
 * @returns Promise resolving to void
 */
export async function updateProject(
  id: string,
  payload: Partial<ProjectPayload>,
): Promise<void> {
  return http.patch<void>(`/v1/admin/projects/${id}`, payload);
}

/**
 * Delete a project by ID.
 *
 * @param id - Project ID
 * @returns Promise resolving to void
 */
export async function deleteProject(id: string): Promise<void> {
  return http.del<void>(`/v1/admin/projects/${id}`);
}
