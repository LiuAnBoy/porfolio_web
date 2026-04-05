import type { Metadata } from 'next';

import { DashboardContent } from '@/modules/admin/dashboard/components/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: 'noindex, nofollow',
};

/**
 * Admin dashboard page.
 */
export default function DashboardPage() {
  return <DashboardContent />;
}
