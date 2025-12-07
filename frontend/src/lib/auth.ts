import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Temporary storage for backend tokens during auth flow
// This is needed because we can't mutate the Account object
const pendingTokens = new Map<
  string,
  { accessToken: string; refreshToken: string }
>();

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
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
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          // Call backend auth endpoint with Google ID token
          const response = await fetch(`${API_BASE_URL}/auth/google/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_token: account.id_token }),
          });

          if (!response.ok) {
            console.error("Backend auth failed:", response.status);
            return false;
          }

          const data = await response.json();

          // Store backend tokens temporarily using user email as key
          if (user?.email) {
            pendingTokens.set(user.email, {
              accessToken: data.data.access_token,
              refreshToken: data.data.refresh_token,
            });
          }

          return true;
        } catch (error) {
          console.error("Error authenticating with backend:", error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user, trigger }) {
      // On initial sign in, retrieve and persist the backend tokens
      if (trigger === "signIn" && user?.email) {
        const tokens = pendingTokens.get(user.email);
        if (tokens) {
          token.backendAccessToken = tokens.accessToken;
          token.backendRefreshToken = tokens.refreshToken;
          // Clean up the temporary storage
          pendingTokens.delete(user.email);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Expose backend access token to the client session
      session.accessToken = token.backendAccessToken as string | undefined;
      session.refreshToken = token.backendRefreshToken as string | undefined;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
