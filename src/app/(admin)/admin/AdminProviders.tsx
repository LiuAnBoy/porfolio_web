"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import type { ReactNode } from "react";

import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AdminLayout } from "@/shared/components/layouts/admin";

/** Props for the AdminProviders component. */
interface AdminProvidersProps {
  /** Page content to render inside the admin shell. */
  children: ReactNode;
  /** Dehydrated React Query state from the server for SSR hydration. */
  dehydratedState: DehydratedState;
  /** Email address of the authenticated user passed to the layout header. */
  userEmail?: string;
}

/**
 * Client-side provider stack for the admin route group.
 * Wraps children with React Query, Notistack, and the AdminLayout shell.
 * This component must be a client component because {@link SnackbarProvider}
 * and {@link ReactQueryProvider} require browser context.
 *
 * @param props - {@link AdminProvidersProps}
 */
export function AdminProviders({
  children,
  dehydratedState,
  userEmail,
}: AdminProvidersProps) {
  return (
    <ReactQueryProvider>
      <HydrationBoundary state={dehydratedState}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <AdminLayout userEmail={userEmail}>{children}</AdminLayout>
        </SnackbarProvider>
      </HydrationBoundary>
    </ReactQueryProvider>
  );
}
