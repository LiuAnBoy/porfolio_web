import { apiClient } from "@/services/api/client";

import type { UserResponse } from "./types";

/**
 * Fetch current user profile with experiences and positions.
 */
export const getUserProfile = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>("/user/me");
  return response.data;
};
