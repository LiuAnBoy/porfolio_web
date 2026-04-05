import http from '@/services/client';
import type {
  ExperiencePayload,
  ExperienceWithPositions,
  UserData,
  UserPayload,
} from '@/types';

/**
 * Fetch a user by ID.
 *
 * @param id - User ID
 * @returns Promise resolving to UserData
 */
export async function getUser(id: string): Promise<UserData> {
  return http.get<UserData>(`/v1/admin/user/${id}`);
}

/**
 * Update a user profile.
 *
 * @param id - User ID
 * @param payload - User update payload
 * @returns Promise resolving to void
 */
export async function updateUser(
  id: string,
  payload: UserPayload,
): Promise<void> {
  return http.patch<void>(`/v1/admin/user/${id}`, payload);
}

/**
 * Fetch experiences for a user.
 *
 * @param userId - User ID
 * @returns Promise resolving to an array of ExperienceWithPositions
 */
export async function getExperiences(
  userId: string,
): Promise<ExperienceWithPositions[]> {
  return http.get<ExperienceWithPositions[]>(
    `/v1/admin/user/${userId}/experiences`,
  );
}

/**
 * Create a new experience for a user.
 *
 * @param userId - User ID
 * @param payload - Experience creation payload
 * @returns Promise resolving to void
 */
export async function createExperience(
  userId: string,
  payload: ExperiencePayload,
): Promise<void> {
  return http.post<void>(`/v1/admin/user/${userId}/experiences`, payload);
}

/**
 * Update an existing experience.
 *
 * @param userId - User ID
 * @param expId - Experience ID
 * @param payload - Experience update payload
 * @returns Promise resolving to void
 */
export async function updateExperience(
  userId: string,
  expId: string,
  payload: ExperiencePayload,
): Promise<void> {
  return http.patch<void>(
    `/v1/admin/user/${userId}/experiences/${expId}`,
    payload,
  );
}

/**
 * Delete an experience.
 *
 * @param userId - User ID
 * @param expId - Experience ID
 * @returns Promise resolving to void
 */
export async function deleteExperience(
  userId: string,
  expId: string,
): Promise<void> {
  return http.del<void>(`/v1/admin/user/${userId}/experiences/${expId}`);
}

/**
 * Reorder experiences by updating their sort numbers.
 *
 * @param userId - User ID
 * @param payload - Ordered array of experience IDs
 * @returns Promise resolving to void
 */
export async function reorderExperiences(
  userId: string,
  payload: { sn: string[] },
): Promise<void> {
  return http.patch<void>(`/v1/admin/user/${userId}/experiences/sn`, payload);
}
