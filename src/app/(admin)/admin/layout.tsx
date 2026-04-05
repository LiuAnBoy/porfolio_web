import { dehydrate, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { auth } from '@/lib/auth';

import { AdminProviders } from './AdminProviders';

/** Props for the AdminRootLayout component. */
interface AdminRootLayoutProps {
  /** Protected admin page content. */
  children: ReactNode;
}

/**
 * Admin route group server layout.
 * Verifies the user session via NextAuth and redirects unauthenticated
 * visitors to the login page. Dehydrates React Query state and passes it
 * to the client provider stack along with the user's email.
 *
 * @param props - {@link AdminRootLayoutProps}
 */
export default async function AdminRootLayout({
  children,
}: AdminRootLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <AdminProviders
      dehydratedState={dehydratedState}
      userEmail={session.user?.email ?? undefined}
      session={session}
    >
      {children}
    </AdminProviders>
  );
}
