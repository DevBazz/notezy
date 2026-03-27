import { NextRequest, NextResponse } from "next/server";

// Only these origins can call the API
// EXTENSION_ORIGIN is set in .env.local as the chrome-extension:// URL
// It is never exposed to the client — only read server-side
const ALLOWED_ORIGINS = [
  process.env.EXTENSION_ORIGIN,                                    // chrome-extension://<id>
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, ""),             // strip trailing slash
  "http://localhost:3000",                                         // local dev
].filter(Boolean) as string[];

export function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : "";

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Cookie",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Reusable preflight handler for every route
export function handlePreflight(request: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

// Wrap a JSON response with CORS headers
export function corsJson(
  request: NextRequest,
  body: unknown,
  init?: ResponseInit
): NextResponse {
  const headers = {
    ...getCorsHeaders(request),
    "Content-Type": "application/json",
  };
  return NextResponse.json(body, { ...init, headers });
}
