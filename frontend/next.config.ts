import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  async rewrites() {
    // Use internal Docker network URL if available, otherwise fall back to localhost
    const backendUrl = process.env.INTERNAL_API_URL
      ? process.env.INTERNAL_API_URL.replace("/api/v1", "")
      : "http://localhost:8000";

    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
