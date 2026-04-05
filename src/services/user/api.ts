import http from "@/services/client";

import type { GetUserProfileResponse } from "./types";

export async function getUserProfile(): Promise<GetUserProfileResponse> {
  return http.get<GetUserProfileResponse>("/v1/user/me");
}
