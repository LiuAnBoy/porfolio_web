import type { Metadata } from "next";

import { getUser, stripHtml } from "@/lib/getData";
import { ProfilePageContent } from "@/modules/public/about/components";

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
  let user = null;
  try {
    user = await getUser();
  } catch (error) {
    console.error("Failed to load profile:", error);
  }
  return <ProfilePageContent user={user} />;
}
