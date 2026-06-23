import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtectedRoute) {
    // If no token, redirect to login
    if (!token) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Non-admins cannot access /admin
    if (pathname.startsWith("/admin")) {
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Admins are redirected away from user-facing pages
    if (token.role === "admin") {
      const userOnlyPaths = ["/dashboard/deposit", "/dashboard/withdraw", "/dashboard/referrals"];
      if (userOnlyPaths.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      // Redirect admin from /dashboard to /admin
      if (pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
