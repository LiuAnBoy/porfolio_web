import { useQuery } from '@tanstack/react-query';

import { getDashboardInit } from '../services/dashboard';

/**
 * React Query hook for fetching dashboard init data.
 *
 * @returns Query result containing DashboardInitData
 */
export function useDashboardQuery() {
  return useQuery({ queryKey: ['dashboard'], queryFn: getDashboardInit });
}
