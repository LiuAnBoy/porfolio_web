import http from '@/services/client';
import type { DashboardInitData } from '@/types';

/**
 * Fetch dashboard initialization data including counts and recent items.
 *
 * @returns Promise resolving to DashboardInitData
 */
export async function getDashboardInit(): Promise<DashboardInitData> {
  return http.get<DashboardInitData>('/v1/admin/init');
}
