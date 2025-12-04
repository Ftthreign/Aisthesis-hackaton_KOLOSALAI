import "server-only";

import { auth } from "@/lib/auth";
import type {
  AnalysisResponse,
  HistoryItem,
  DeleteResponse,
  User,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  options: RequestInit = {}
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
      detail = errorData.detail || detail;
    } catch {
      detail = response.statusText;
    }
    throw new ApiServerError(detail, response.status, detail);
  }

  return response;
}

export const apiServer = {
  /**
   * Verify token and get user data
   */
  verifyAuth: async (): Promise<User> => {
    const response = await fetchWithAuth("/auth/verify");
    return response.json();
  },

  /**
   * Upload an image and run AI analysis
   */
  uploadAndAnalyze: async (formData: FormData): Promise<AnalysisResponse> => {
    const response = await fetchWithAuth("/analysis", {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  /**
   * Get list of user's analysis history
   */
  getHistory: async (): Promise<HistoryItem[]> => {
    const response = await fetchWithAuth("/history");
    return response.json();
  },

  /**
   * Get detail of a specific analysis
   */
  getAnalysisDetail: async (id: string): Promise<AnalysisResponse> => {
    const response = await fetchWithAuth(`/history/${id}`);
    return response.json();
  },

  /**
   * Delete an analysis
   */
  deleteAnalysis: async (id: string): Promise<DeleteResponse> => {
    const response = await fetchWithAuth(`/history/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  /**
   * Get PDF export (returns raw response for streaming)
   */
  exportPdf: async (id: string): Promise<Response> => {
    return fetchWithAuth(`/export/pdf/${id}`);
  },

  /**
   * Download analysis as JSON
   */
  exportJson: async (id: string): Promise<AnalysisResponse> => {
    const response = await fetchWithAuth(`/export/json/${id}`);
    return response.json();
  },

  /**
   * Error class for API errors
   */
  ApiServerError,
};
