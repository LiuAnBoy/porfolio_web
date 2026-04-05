import type { Metadata } from "next";

import { TagTable } from "@/modules/admin/tags/components/TagTable";

export const metadata: Metadata = {
  title: "標籤管理",
  robots: "noindex, nofollow",
};

/**
 * Admin tags management page.
 */
export default function TagsPage() {
  return <TagTable />;
}
