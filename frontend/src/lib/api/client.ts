"use client";

import type {
  AnalysisResponse,
  HistoryItem,
  DeleteResponse,
  User,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  options: RequestInit = {}
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
      detail = errorData.detail || detail;
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
   * Verify token and get user data
   */
  verifyAuth: async (): Promise<User> => {
    const response = await fetchWithAuth("/auth/verify");
    return response.json();
  },

  /**
   * Upload an image and run AI analysis
   */
  uploadAndAnalyze: async (file: File): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append("file", file);

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
   * Download analysis as PDF
   */
  downloadPdf: async (id: string): Promise<Blob> => {
    const response = await fetchWithAuth(`/export/pdf/${id}`);
    return response.blob();
  },

  /**
   * Download analysis as JSON
   */
  downloadJson: async (id: string): Promise<AnalysisResponse> => {
    const response = await fetchWithAuth(`/export/json/${id}`);
    return response.json();
  },

  /**
   * Helper function to trigger file download
   */
  downloadFile,

  /**
   * Error class for API errors
   */
  ApiClientError,
};
