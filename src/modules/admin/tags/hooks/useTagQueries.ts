import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTag, deleteTag, getTagList, updateTag } from '../services/tag';

/** Query key for the tag list */
const TAG_QUERY_KEY = ['tags'] as const;

/**
 * React Query hook to fetch the tag list.
 *
 * @returns Query result containing TagData[]
 */
export function useTagList() {
  return useQuery({ queryKey: TAG_QUERY_KEY, queryFn: getTagList });
}

/**
 * Mutation hook to create a new tag.
 * Invalidates the tag list on success.
 *
 * @returns Mutation result for createTag
 */
export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEY });
    },
  });
}

/**
 * Mutation hook to update an existing tag.
 * Invalidates the tag list on success.
 *
 * @returns Mutation result for updateTag
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { label: string } }) =>
      updateTag(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEY });
    },
  });
}

/**
 * Mutation hook to delete a tag.
 * Invalidates the tag list on success.
 *
 * @returns Mutation result for deleteTag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEY });
    },
  });
}
