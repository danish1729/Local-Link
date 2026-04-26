import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // ⚡️ Use 'jose', not 'jsonwebtoken'

// Encode the secret for the Edge Runtime
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  // 🔍 FIX 1: Look for "auth_token" (matches your Login API), not "token"
  const token = req.cookies.get("auth_token")?.value;

  const loginUrl = new URL("/login", req.url);

  // If no token exists, kick them back to login
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 🔍 FIX 2: Use jwtVerify from 'jose' for Edge compatibility
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Extract role from the verified token
    const role = payload.role as string;
    const pathname = req.nextUrl.pathname;

    // --- Role Based Protection ---

    // Protect Admin Routes
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }


    // Protect Customer Routes
    if (pathname.startsWith("/customer") && role !== "customer") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If everything is fine, let them pass
    return NextResponse.next();
  } catch (error) {
    // If token is tampered with or expired
    console.error("Middleware Auth Error:", error);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  // Protect dashboard and role-specific paths
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/provider/:path*",
    "/customer/:path*",
  ],
};
