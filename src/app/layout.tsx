import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { type ReactNode } from "react";

import { getUser, stripHtml } from "@/lib/getData";
import MuiProvider from "@/providers/MuiProvider";
import { Navbar } from "@/shared/layouts";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "An's Portfolio";

/**
 * Generate dynamic metadata based on user profile.
 */
export async function generateMetadata(): Promise<Metadata> {
  const user = await getUser();

  const description = user?.bio
    ? stripHtml(user.bio)
    : "Personal portfolio website";

  return {
    title: {
      default: SITE_NAME,
      template: `${SITE_NAME} | %s`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_NAME,
      description,
      images: [{ url: "/images/logo.png" }],
    },
    twitter: {
      card: "summary",
      title: SITE_NAME,
      description,
      images: ["/images/logo.png"],
    },
  };
}

/**
 * Root layout - fetches initial data via React cache.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Fetch user data using cached function
  const user = await getUser();
  const socials = user?.socials ?? [];

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MuiProvider>
          <Navbar socials={socials} />
          <main>{children}</main>
        </MuiProvider>
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
