import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ExperiencePayload, UserPayload } from '@/types';

import {
  createExperience,
  deleteExperience,
  getExperiences,
  getUser,
  reorderExperiences,
  updateExperience,
  updateUser,
} from '../services/user';

/** Query key for user data */
const userKey = (id: string) => ['user', id] as const;

/** Query key for user experiences */
const experienceKey = (userId: string) =>
  ['user', userId, 'experiences'] as const;

/**
 * React Query hook to fetch user data.
 *
 * @param id - User ID (empty string disables the query)
 * @returns Query result with UserData
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKey(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  });
}

/**
 * Mutation hook to update user profile.
 * Invalidates user data on success.
 *
 * @returns Mutation result for updateUser
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserPayload }) =>
      updateUser(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKey(variables.id) });
    },
  });
}

/**
 * React Query hook to fetch user experiences.
 *
 * @param userId - User ID (empty string disables the query)
 * @returns Query result with ExperienceWithPositions[]
 */
export function useExperiences(userId: string) {
  return useQuery({
    queryKey: experienceKey(userId),
    queryFn: () => getExperiences(userId),
    enabled: Boolean(userId),
  });
}

/**
 * Mutation hook to create a new experience.
 * Invalidates the experience list on success.
 *
 * @returns Mutation result for createExperience
 */
export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: ExperiencePayload;
    }) => createExperience(userId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: experienceKey(variables.userId),
      });
    },
  });
}

/**
 * Mutation hook to update an existing experience.
 * Invalidates the experience list on success.
 *
 * @returns Mutation result for updateExperience
 */
export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      expId,
      payload,
    }: {
      userId: string;
      expId: string;
      payload: ExperiencePayload;
    }) => updateExperience(userId, expId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: experienceKey(variables.userId),
      });
    },
  });
}

/**
 * Mutation hook to delete an experience.
 * Invalidates the experience list on success.
 *
 * @returns Mutation result for deleteExperience
 */
export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, expId }: { userId: string; expId: string }) =>
      deleteExperience(userId, expId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: experienceKey(variables.userId),
      });
    },
  });
}

/**
 * Mutation hook to reorder experiences.
 * Invalidates the experience list on success.
 *
 * @returns Mutation result for reorderExperiences
 */
export function useReorderExperiences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: { sn: string[] };
    }) => reorderExperiences(userId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: experienceKey(variables.userId),
      });
    },
  });
}
