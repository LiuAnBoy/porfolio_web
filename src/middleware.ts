import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/v1/projects") ||
    pathname.startsWith("/api/v1/user/me")
  ) {
    if (pathname.startsWith("/api/v1/admin")) {
      return NextResponse.next();
    }

    const rateLimitResponse = checkRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/v1/:path*"],
};
