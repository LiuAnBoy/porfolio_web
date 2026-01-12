import type { ReactNode } from "react";

import { Footer } from "@/shared/layouts";

/**
 * Layout for main pages (profile, projects) with footer.
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
