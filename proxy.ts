import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;

// Exporting as middleware for Next.js to recognize it automatically if named middleware.ts
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Authentication & Authorization
  const isProtectedPath = 
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/bookings") ||
    url.pathname.startsWith("/profile") ||
    url.pathname.startsWith("/admin-panel");

  const isAuthPage = url.pathname === "/login" || url.pathname === "/signup" || url.pathname === "/admin-login";

  const token = req.cookies.get("auth_token")?.value;

  // If not a protected path and not an auth page, continue
  if (!isProtectedPath && !isAuthPage) {
    return NextResponse.next();
  }

  // If accessing a protected path without a token
  if (!token && isProtectedPath) {
    const loginUrl = new URL(url.pathname.startsWith("/admin-panel") ? "/admin-login" : "/login", req.url);
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
        return NextResponse.redirect(new URL(role === "admin" ? "/admin-panel" : "/dashboard", req.url));
      }

      // --- Role Based Protection ---
      if (url.pathname.startsWith("/admin-panel") && role !== "admin") {
        // Non-admins trying to access admin panel
        return NextResponse.redirect(new URL("/", req.url)); 
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware Auth Error:", error);
      // Token is invalid/expired
      const loginUrl = new URL(url.pathname.startsWith("/admin-panel") ? "/admin-login" : "/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // Allow access to auth pages if no token is present
  return NextResponse.next();
}

// Fallback export if user renames this file to proxy.ts
export const proxy = middleware;

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico).*)",
  ],
};
