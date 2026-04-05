import type { ReactNode } from 'react';

import { getUser } from '@/lib/getData';
import { Footer, Navbar } from '@/shared/components/layouts/public';

/**
 * Layout for public pages (home, profile, projects) with navbar and footer.
 */
export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  const socials = user?.socials ?? [];

  return (
    <>
      <Navbar socials={socials} />
      {children}
      <Footer />
    </>
  );
}
