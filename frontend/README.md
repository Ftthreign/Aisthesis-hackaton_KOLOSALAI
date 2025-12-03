This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. Create a `.env.local` file in the root of the frontend directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

3. Generate a NextAuth secret:

```bash
openssl rand -base64 32
```

4. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret to your `.env.local` file

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js App Router pages
  - `page.tsx` - Landing page
  - `/upload` - Upload page
  - `/dashboard` - Dashboard page (empty state)
  - `/api/auth/[...nextauth]` - NextAuth API routes
- `/src/auth.ts` - NextAuth configuration
- `/src/lib/api-client.ts` - API client service for backend communication
- `/src/types` - TypeScript type definitions
- `/src/middleware.ts` - Next.js middleware for auth

## Features

- **NextAuth with Google OAuth**: Secure authentication using Google OAuth 2.0
- **API Client Service**: Reusable service for making API calls to the backend
- **Landing Page**: Welcome page with sign-in functionality
- **Upload Page**: Page for uploading images (protected route)
- **Dashboard**: User dashboard (currently empty)

## API Client Usage

The API client is located at `/src/lib/api-client.ts` and can be used in your components:

```typescript
import { apiClient } from "@/lib/api-client";

// GET request
const data = await apiClient.get("/endpoint", token);

// POST request
const result = await apiClient.post("/endpoint", { key: "value" }, token);

// File upload
const response = await apiClient.uploadFile("/upload", file, token);
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [NextAuth.js Documentation](https://next-auth.js.org/) - learn about NextAuth.js authentication
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
