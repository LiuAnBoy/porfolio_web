import './globals.css';

import type { Metadata } from 'next';
import { type ReactNode } from 'react';

import { getUser, stripHtml } from '@/lib/getData';
import MuiProvider from '@/providers/MuiProvider';
import { ScrollToTop } from '@/shared/components';
import { ScrollContainerProvider } from '@/shared/contexts';

const SITE_NAME = "An's Portfolio";

/**
 * Generate dynamic metadata based on user profile.
 */
export async function generateMetadata(): Promise<Metadata> {
  const user = await getUser();

  const description = user?.bio
    ? stripHtml(user.bio)
    : 'Personal portfolio website';

  return {
    title: {
      default: SITE_NAME,
      template: `${SITE_NAME} | %s`,
    },
    description,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: SITE_NAME,
      description,
      images: [{ url: '/images/logo.png' }],
    },
    twitter: {
      card: 'summary',
      title: SITE_NAME,
      description,
      images: ['/images/logo.png'],
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
  return (
    <html lang="en">
      <body>
        <MuiProvider>
          <ScrollContainerProvider>
            <main style={{ height: '100%' }}>{children}</main>
            <ScrollToTop />
          </ScrollContainerProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
