import type { Metadata } from "next";

import { ProfilePageContent } from "@/components/about";
import { getUser, stripHtml } from "@/lib/getData";

/**
 * Generate dynamic metadata for profile page.
 */
export async function generateMetadata(): Promise<Metadata> {
  const user = await getUser();

  const description = user?.bio ? stripHtml(user.bio) : "About me";

  return {
    title: "Profile",
    description,
    openGraph: {
      title: user ? `${user.name} - Profile` : "Profile",
      description,
      ...(user?.avatar && { images: [{ url: user.avatar }] }),
    },
  };
}

/**
 * Profile page - SSR with cached data.
 */
export default async function Profile() {
  const user = await getUser();

  return <ProfilePageContent user={user} />;
}
