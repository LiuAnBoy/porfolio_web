import type { Metadata } from "next";

import { StackTable } from "@/modules/admin/stacks/components/StackTable";

export const metadata: Metadata = {
  title: "技術棧管理",
  robots: "noindex, nofollow",
};

/**
 * Admin stacks management page.
 */
export default function StacksPage() {
  return <StackTable />;
}
