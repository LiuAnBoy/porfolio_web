import http from '@/services/client';
import type { TagData, TagPayload } from '@/types';

/**
 * Fetch all tags.
 *
 * @returns Promise resolving to an array of TagData
 */
export async function getTagList(): Promise<TagData[]> {
  return http.get<TagData[]>('/v1/admin/tags');
}

/**
 * Create a new tag.
 *
 * @param payload - Tag creation payload
 * @returns Promise resolving to void
 */
export async function createTag(payload: TagPayload): Promise<void> {
  return http.post<void>('/v1/admin/tags', payload);
}

/**
 * Update an existing tag.
 *
 * @param id - Tag ID
 * @param payload - Tag update payload
 * @returns Promise resolving to void
 */
export async function updateTag(
  id: string,
  payload: TagPayload,
): Promise<void> {
  return http.patch<void>(`/v1/admin/tags/${id}`, payload);
}

/**
 * Delete a tag by ID.
 *
 * @param id - Tag ID
 * @returns Promise resolving to void
 */
export async function deleteTag(id: string): Promise<void> {
  return http.del<void>(`/v1/admin/tags/${id}`);
}
