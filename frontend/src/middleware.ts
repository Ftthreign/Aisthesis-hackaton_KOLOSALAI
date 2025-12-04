import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/signin", "/"]
  const isPublicRoute = publicRoutes.some((route) => pathname === route)
  const isApiRoute = pathname.startsWith("/api")

  // Allow public routes and API routes
  if (isPublicRoute || isApiRoute) {
    // If logged in and on signin page, redirect to dashboard
    if (isLoggedIn && pathname === "/auth/signin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  }

  // Protect all other routes - redirect to signin if not logged in
  if (!isLoggedIn) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

