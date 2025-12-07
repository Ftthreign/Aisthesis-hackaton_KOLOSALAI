import "server-only";

import { auth } from "@/lib/auth";
import type { AnalysisData, AnalysisCreateData, User } from "./types";

// Use INTERNAL_API_URL for server-side calls (inside Docker network)
// Falls back to NEXT_PUBLIC_API_URL for local development
const API_BASE_URL =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

class ApiServerError extends Error {
  status: number;
  detail: string;

  constructor(message: string, status: number, detail: string) {
    super(message);
    this.name = "ApiServerError";
    this.status = status;
    this.detail = detail;
  }
}

async function getAccessToken(): Promise<string | null> {
  const session = await auth();
  return session?.accessToken || null;
}

async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getAccessToken();

  if (!token) {
    throw new ApiServerError("No access token available", 401, "Unauthorized");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = "An error occurred";
    try {
      const errorData = await response.json();
      // Handle both string detail and validation error array
      if (typeof errorData.detail === "string") {
        detail = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        detail = errorData.detail.map((e: { msg: string }) => e.msg).join(", ");
      }
    } catch {
      detail = response.statusText;
    }
    throw new ApiServerError(detail, response.status, detail);
  }

  return response;
}

export const apiServer = {
  /**
   * Get current user profile (requires authentication)
   * GET /auth/profile
   */
  getProfile: async (): Promise<User> => {
    const response = await fetchWithAuth("/auth/profile");
    const json = await response.json();
    return json.data; // Unwrap { data: ... }
  },

  /**
   * Upload an image and start async AI analysis
   * Returns immediately with analysis ID and PENDING status
   * POST /analysis
   */
  createAnalysis: async (formData: FormData): Promise<AnalysisCreateData> => {
    const response = await fetchWithAuth("/analysis", {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    return json.data; // Unwrap { data: { id, status } }
  },

  /**
   * Get analysis status and results
   * Poll this endpoint until status is COMPLETED or FAILED
   * GET /analysis/{id}
   */
  getAnalysis: async (id: string): Promise<AnalysisData> => {
    const response = await fetchWithAuth(`/analysis/${id}`);
    const json = await response.json();
    return json.data; // Unwrap { data: AnalysisData }
  },

  /**
   * Error class for API errors
   */
  ApiServerError,
};
