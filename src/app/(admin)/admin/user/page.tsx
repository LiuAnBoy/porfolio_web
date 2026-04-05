import type { Metadata } from 'next';

import { UserPage } from '@/modules/admin/user/components/UserPage';

export const metadata: Metadata = {
  title: '個人設定',
  robots: 'noindex, nofollow',
};

/**
 * Admin user management page.
 */
export default function UserPageRoute() {
  return <UserPage />;
}
