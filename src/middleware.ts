// Middleware runs before requests are processed
// This is where we can check authentication and protect routes

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your middleware

// Define public routes using createRouteMatcher
const isPublicRoute = createRouteMatcher(["/", "/api/restaurants", "/api/bars"]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is not public, protect it
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Matcher tells Next.js which routes to run the middleware on
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
