import { NextResponse } from "next/server";

/**
 * CORS headers for public APIs
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Handle OPTIONS preflight request
 */
export function handleOptions() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * Create JSON response with CORS headers
 */
export function jsonWithCors<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...corsHeaders,
      ...init?.headers,
    },
  });
}
