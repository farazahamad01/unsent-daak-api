import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // Redirect to login if trying to access admin without token
  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Redirect to dashboard if already logged in and visiting login
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
