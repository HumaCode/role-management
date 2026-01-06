import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing protected routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/profile")
  ) {
    // Get session from cookie
    const sessionToken = request.cookies.get("better-auth.session_token");

    if (!sessionToken) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Additional role-based protection for /users route
    // Only admin can access users management
    if (pathname.startsWith("/users")) {
      // Note: You'll need to decode session or make API call to check role
      // For now, we'll handle this on the client side
      // But ideally should be checked here too
    }
  }

  // Redirect to dashboard if already logged in and accessing login/register
  if (pathname === "/login" || pathname === "/register") {
    const sessionToken = request.cookies.get("better-auth.session_token");

    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};