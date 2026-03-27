import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Only these routes require a signed-in session at the middleware level
const isProtectedRoute = createRouteMatcher([
  '/note/(.*)',
  '/notifications',
  '/shared',
]);

// API routes handle their own auth inside the route handler
const isPublicApiRoute = createRouteMatcher([
  '/api/notes(.*)',
  '/api/auth/session',
]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicApiRoute(request)) return;
  if (isProtectedRoute(request)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
