"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"

/**
 * Custom hook that handles authentication errors.
 * Automatically signs out the user if there's a token refresh error.
 */
export function useAuthErrorHandler() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      // Token refresh failed, sign out the user
      signOut({ callbackUrl: "/auth/signin" })
    }
  }, [session?.error])

  return session
}

/**
 * Get the access token from the session for API calls.
 * Returns null if no session or token is available.
 */
export function getAccessToken(session: { accessToken?: string } | null): string | null {
  return session?.accessToken ?? null
}
