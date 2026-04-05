import type { ReactNode } from "react";

import { Footer } from "@/shared/components/layouts/public";

/**
 * Layout for public pages (profile, projects) with footer.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
