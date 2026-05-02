import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  
  // 1. Subdomain Routing
  const isAdminSubdomain = hostname.startsWith("admin.");

  if (isAdminSubdomain) {
    // If requesting the login page on the admin subdomain
    if (url.pathname === "/login") {
      url.pathname = "/admin-login";
      return NextResponse.rewrite(url);
    }

    // Rewrite all other requests to /admin-panel/...
    // Avoid double-rewriting if it already starts with /admin-panel or /admin-login
    if (!url.pathname.startsWith("/admin-panel") && !url.pathname.startsWith("/admin-login")) {
      url.pathname = `/admin-panel${url.pathname === "/" ? "" : url.pathname}`;
    }
  }

  // 2. Authentication & Authorization
  // Define which paths actually need an auth token
  const isProtectedPath = 
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/bookings") ||
    url.pathname.startsWith("/profile") ||
    url.pathname.startsWith("/admin-panel");

  const isAuthPage = url.pathname === "/login" || url.pathname === "/signup" || url.pathname === "/admin-login";

  const token = req.cookies.get("auth_token")?.value;

  // If not a protected path and not an auth page, just rewrite (if admin) or continue
  if (!isProtectedPath && !isAuthPage) {
    if (isAdminSubdomain) {
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // If accessing a protected path without a token
  if (!token && isProtectedPath) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("returnUrl", url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If there is a token, try to verify it
  if (token) {
    try {
      if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
      
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      // If user is logged in and trying to access login/signup, redirect to home
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // --- Role Based Protection ---
      if (url.pathname.startsWith("/admin-panel") && role !== "admin") {
        // Non-admins trying to access admin panel
        return NextResponse.redirect(new URL("/", req.url)); 
      }

      // If everything is fine, rewrite (if admin) or continue
      if (isAdminSubdomain) {
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware Auth Error:", error);
      // Token is invalid/expired
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // Allow access to auth pages if no token is present
  if (isAdminSubdomain) {
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // CRITICAL FIX: Match all routes except API, _next (entirely), favicon
    "/((?!api|_next|favicon.ico).*)",
  ],
};
