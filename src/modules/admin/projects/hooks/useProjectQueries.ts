import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ProjectListParams, ProjectPayload } from "@/types";

import {
  createProject,
  deleteProject,
  getProjectDetail,
  getProjectList,
  updateProject,
} from "../services/project";

/** Query key for the project list */
const PROJECT_LIST_KEY = ["projects"] as const;

/**
 * Build query key for a single project detail.
 *
 * @param id - Project ID
 * @returns Tuple query key
 */
const projectDetailKey = (id: string) => ["projects", id] as const;

/**
 * React Query hook to fetch the project list.
 *
 * @param params - Optional filter and pagination parameters
 * @returns Query result with { data, total }
 */
export function useProjectList(params?: ProjectListParams) {
  return useQuery({
    queryKey: [...PROJECT_LIST_KEY, params],
    queryFn: () => getProjectList(params),
  });
}

/**
 * React Query hook to fetch a single project detail.
 *
 * @param id - Project ID (empty string disables the query)
 * @returns Query result with ProjectData
 */
export function useProjectDetail(id: string) {
  return useQuery({
    queryKey: projectDetailKey(id),
    queryFn: () => getProjectDetail(id),
    enabled: Boolean(id),
  });
}

/**
 * Mutation hook to create a new project.
 * Invalidates the project list on success.
 *
 * @returns Mutation result for createProject
 */
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProjectPayload) => createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_LIST_KEY });
    },
  });
}

/**
 * Mutation hook to update an existing project.
 * Invalidates both the project list and detail on success.
 *
 * @returns Mutation result for updateProject
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ProjectPayload>;
    }) => updateProject(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_LIST_KEY });
      queryClient.invalidateQueries({
        queryKey: projectDetailKey(variables.id),
      });
    },
  });
}

/**
 * Mutation hook to delete a project.
 * Invalidates the project list on success.
 *
 * @returns Mutation result for deleteProject
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_LIST_KEY });
    },
  });
}

/**
 * Mutation hook to toggle project featured status.
 * Invalidates the project list on success.
 *
 * @returns Mutation result for toggling isFeatured
 */
export function useToggleFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      updateProject(id, { isFeatured } as Partial<ProjectPayload>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_LIST_KEY });
    },
  });
}

/**
 * Mutation hook to toggle project visibility.
 * Invalidates the project list on success.
 *
 * @returns Mutation result for toggling isVisible
 */
export function useToggleVisible() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      updateProject(id, { isVisible } as Partial<ProjectPayload>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_LIST_KEY });
    },
  });
}
