import http from "@/services/client";
import type { ImageData, ImageListParams } from "@/types";

/** Response shape for paginated image list */
interface ImageListResponse {
  payload: ImageData[];
  total_count: number;
  page_size: number;
  page: number;
}

/**
 * Fetch paginated image list with optional filters.
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to paginated image data
 */
export async function getImageList(
  params: ImageListParams,
): Promise<ImageListResponse> {
  return http.get<ImageListResponse>("/v1/admin/images", { params });
}

/**
 * Update image metadata (alt text).
 *
 * @param id - Image ID
 * @param payload - Fields to update
 * @returns Promise resolving to void
 */
export async function updateImage(
  id: string,
  payload: { alt?: string },
): Promise<void> {
  return http.patch<void>(`/v1/admin/images/${id}`, payload);
}

/**
 * Delete an image by ID.
 *
 * @param id - Image ID
 * @returns Promise resolving to void
 */
export async function deleteImage(id: string): Promise<void> {
  return http.del<void>(`/v1/admin/images/${id}`);
}
