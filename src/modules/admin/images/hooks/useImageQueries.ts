import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ImageListParams } from "@/types";

import { deleteImage, getImageList, updateImage } from "../services/image";

/**
 * Build the query key for the image list.
 *
 * @param params - Current filter/pagination params
 * @returns Tuple query key
 */
const imageQueryKey = (params: ImageListParams) => ["images", params] as const;

/**
 * React Query hook to fetch the paginated image list.
 *
 * @param params - Filter and pagination parameters
 * @returns Query result with { data, total }
 */
export function useImageList(params: ImageListParams) {
  return useQuery({
    queryKey: imageQueryKey(params),
    queryFn: () => getImageList(params),
  });
}

/**
 * Mutation hook to update image metadata.
 * Invalidates the image list on success.
 *
 * @returns Mutation result for updateImage
 */
export function useUpdateImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { alt?: string } }) =>
      updateImage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
}

/**
 * Mutation hook to delete an image.
 * Invalidates the image list on success.
 *
 * @returns Mutation result for deleteImage
 */
export function useDeleteImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
}
