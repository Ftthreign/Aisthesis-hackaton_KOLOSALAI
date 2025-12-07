"use client";

import type {
  AnalysisData,
  AnalysisCreateData,
  HistoryItem,
  DeleteResponse,
  User,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) throw new Error("MANA ENV VAR API_BASE_URL COKK");

class ApiClientError extends Error {
  status: number;
  detail: string;

  constructor(message: string, status: number, detail: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.detail = detail;
  }
}

async function getAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/session");
    const session = await response.json();
    return session?.accessToken || null;
  } catch {
    return null;
  }
}

async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getAccessToken();

  if (!token) {
    throw new ApiClientError("No access token available", 401, "Unauthorized");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
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
    throw new ApiClientError(detail, response.status, detail);
  }

  return response;
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const apiClient = {
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
  createAnalysis: async (
    file: File,
    context?: string,
  ): Promise<AnalysisCreateData> => {
    const formData = new FormData();
    formData.append("file", file);
    if (context) {
      formData.append("context", context);
    }

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
   * Get list of user's analysis history
   * Note: This endpoint may not be implemented in backend yet
   * GET /analysis (list endpoint TBD)
   */
  getHistory: async (): Promise<HistoryItem[]> => {
    const response = await fetchWithAuth("/analysis");
    const json = await response.json();
    return json.data; // Unwrap { data: HistoryItem[] }
  },

  /**
   * Delete an analysis
   * Note: This endpoint may not be implemented in backend yet
   * DELETE /analysis/{id}
   */
  deleteAnalysis: async (id: string): Promise<DeleteResponse> => {
    const response = await fetchWithAuth(`/analysis/${id}`, {
      method: "DELETE",
    });
    const json = await response.json();
    return json.data || { message: "Deleted successfully" };
  },

  /**
   * Download analysis as PDF
   * Note: This endpoint may not be implemented in backend yet
   * GET /export/pdf/{id}
   */
  downloadPdf: async (id: string): Promise<Blob> => {
    const response = await fetchWithAuth(`/export/pdf/${id}`);
    return response.blob();
  },

  /**
   * Download analysis as JSON
   * Note: This endpoint may not be implemented in backend yet
   * GET /export/json/{id}
   */
  downloadJson: async (id: string): Promise<AnalysisData> => {
    const response = await fetchWithAuth(`/export/json/${id}`);
    const json = await response.json();
    return json.data || json;
  },

  /**
   * Helper function to trigger file download
   */
  downloadFile,

  /**
   * Error class for API errors
   */
  ApiClientError,

  /**
   * Poll analysis until completed or failed
   * @param id Analysis ID
   * @param options Polling options
   * @returns Completed analysis data
   */
  pollAnalysisUntilComplete: async (
    id: string,
    options: {
      intervalMs?: number;
      maxAttempts?: number;
      onStatusChange?: (status: string) => void;
    } = {},
  ): Promise<AnalysisData> => {
    const { intervalMs = 2000, maxAttempts = 60, onStatusChange } = options;

    let attempts = 0;

    while (attempts < maxAttempts) {
      const analysis = await apiClient.getAnalysis(id);

      if (onStatusChange) {
        onStatusChange(analysis.status);
      }

      if (analysis.status === "COMPLETED") {
        return analysis;
      }

      if (analysis.status === "FAILED") {
        throw new ApiClientError(
          analysis.error || "Analysis failed",
          500,
          analysis.error || "Analysis processing failed",
        );
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      attempts++;
    }

    throw new ApiClientError(
      "Analysis timed out",
      408,
      "Analysis took too long to complete",
    );
  },
};
