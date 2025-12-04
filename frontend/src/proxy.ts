import { auth } from "@/lib/auth";
import type { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const publicRoutes = ["/"];
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isApiRoute = pathname.startsWith("/api");

  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const signInUrl = new URL("/", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
