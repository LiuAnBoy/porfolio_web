import http from '@/services/client';

import type { GetProjectsParams, GetProjectsResponse } from './types';

export async function getProjects(
  params?: GetProjectsParams,
): Promise<GetProjectsResponse> {
  return http.get<GetProjectsResponse>('/v1/projects', { params });
}
