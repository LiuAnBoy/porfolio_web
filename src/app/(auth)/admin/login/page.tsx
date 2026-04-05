import type { Metadata } from "next";

import { LoginForm } from "@/modules/admin/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: "noindex, nofollow",
};

/**
 * Admin login page.
 * Renders the {@link LoginForm} inside the centered auth layout.
 */
export default function LoginPage() {
  return <LoginForm />;
}
