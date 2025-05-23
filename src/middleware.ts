import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtectedRoute) {
    // If no token, redirect to login
    if (!token) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Handle admin routes
    if (pathname.startsWith("/admin")) {
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}; 