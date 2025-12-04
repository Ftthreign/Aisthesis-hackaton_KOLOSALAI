import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const tokens = await response.json();
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      accessTokenExpires: Date.now() + 30 * 60 * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/dashboard",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in - exchange Google ID token with backend
      if (account && account.id_token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_token: account.id_token }),
          });

          if (!response.ok) {
            throw new Error("Failed to authenticate with backend");
          }

          const backendTokens = await response.json();

          token.accessToken = backendTokens.access_token;
          token.refreshToken = backendTokens.refresh_token;
          token.accessTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
          token.id = user?.id;
          token.email = user?.email;
          token.name = user?.name;
          token.picture = user?.image;

          return token;
        } catch (error) {
          console.error("Error exchanging token with backend:", error);
          return { ...token, error: "BackendAuthError" };
        }
      }

      // Return token if access token has not expired
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token;
      }

      // Access token has expired, try to refresh it
      if (token.refreshToken) {
        const refreshedTokens = await refreshAccessToken(
          token.refreshToken as string
        );
        if (refreshedTokens) {
          return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken,
            accessTokenExpires: refreshedTokens.accessTokenExpires,
          };
        }
      }

      // Unable to refresh, return token with error
      return { ...token, error: "RefreshAccessTokenError" };
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.error = token.error as string | undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      // Default redirect to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
});
