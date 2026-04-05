import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';

/**
 * Validate admin session. Returns session user or 401 response.
 *
 * Design note: This project uses a single-admin model — only one admin user
 * exists in the database. A valid NextAuth session therefore implies admin
 * identity; no role-based check is needed.
 */
export async function requireAdminAuth(): Promise<
  { user: { id: string; email: string; name: string } } | NextResponse
> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  return { user: session.user as { id: string; email: string; name: string } };
}

/**
 * Type guard to check if result is an error response
 */
export function isAuthError(
  result: Awaited<ReturnType<typeof requireAdminAuth>>,
): result is NextResponse {
  return result instanceof NextResponse;
}
