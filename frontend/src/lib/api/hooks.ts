"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { AnalysisResponse, HistoryItem, DeleteResponse } from "./types";
import {
  createDummyAnalysisResponse,
  dummyHistoryItems,
  simulateApiDelay,
} from "./dummy-data";

// Flag to use dummy data while backend is in development
const USE_DUMMY_DATA = true;

// Query Keys
export const queryKeys = {
  history: ["history"] as const,
  analysisDetail: (id: string) => ["analysis", id] as const,
  user: ["user"] as const,
};

/**
 * Hook to fetch analysis history list
 */
export function useHistory() {
  return useQuery<HistoryItem[], Error>({
    queryKey: queryKeys.history,
    queryFn: async () => {
      if (USE_DUMMY_DATA) {
        await simulateApiDelay(800);
        return dummyHistoryItems;
      }
      return apiClient.getHistory();
    },
  });
}

/**
 * Hook to fetch a specific analysis detail
 */
export function useAnalysisDetail(id: string) {
  return useQuery<AnalysisResponse, Error>({
    queryKey: queryKeys.analysisDetail(id),
    queryFn: async () => {
      if (USE_DUMMY_DATA) {
        await simulateApiDelay(1000);
        return createDummyAnalysisResponse(id);
      }
      return apiClient.getAnalysisDetail(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to upload and analyze an image
 */
export function useUploadAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<AnalysisResponse, Error, File>({
    mutationFn: async (file: File) => {
      if (USE_DUMMY_DATA) {
        await simulateApiDelay(2500); // Simulate longer processing time
        const id = `analysis-${Date.now()}`;
        // Create a local URL for the uploaded file
        const imageUrl = URL.createObjectURL(file);
        return createDummyAnalysisResponse(id, imageUrl);
      }
      return apiClient.uploadAndAnalyze(file);
    },
    onSuccess: (data) => {
      // Invalidate history to include new analysis
      queryClient.invalidateQueries({ queryKey: queryKeys.history });
      // Pre-populate the analysis detail cache
      queryClient.setQueryData(queryKeys.analysisDetail(data.id), data);
    },
  });
}

/**
 * Hook to delete an analysis
 */
export function useDeleteAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: async (id: string) => {
      if (USE_DUMMY_DATA) {
        await simulateApiDelay(500);
        return { message: "Analysis deleted successfully" };
      }
      return apiClient.deleteAnalysis(id);
    },
    onSuccess: (_, deletedId) => {
      // Remove from history cache
      queryClient.setQueryData<HistoryItem[]>(queryKeys.history, (old) =>
        old?.filter((item) => item.id !== deletedId)
      );
      // Remove the analysis detail from cache
      queryClient.removeQueries({ queryKey: queryKeys.analysisDetail(deletedId) });
    },
  });
}

/**
 * Hook to download PDF export
 */
export function useDownloadPdf() {
  return useMutation<void, Error, { id: string; filename?: string }>({
    mutationFn: async ({ id, filename }) => {
      if (USE_DUMMY_DATA) {
        await simulateApiDelay(1000);
        // Create a dummy PDF blob for demo
        const dummyContent = `AISTHESIS Analysis Report\n\nAnalysis ID: ${id}\n\nThis is a placeholder PDF content for demo purposes.\n\nGenerated at: ${new Date().toISOString()}`;
        const blob = new Blob([dummyContent], { type: "application/pdf" });
        apiClient.downloadFile(blob, filename || `analysis-${id}.pdf`);
        return;
      }
      const blob = await apiClient.downloadPdf(id);
      apiClient.downloadFile(blob, filename || `analysis-${id}.pdf`);
    },
  });
}

/**
 * Hook to download JSON export
 */
export function useDownloadJson() {
  return useMutation<void, Error, { id: string; filename?: string }>({
    mutationFn: async ({ id, filename }) => {
      if (USE_DUMMY_DATA) {
        await simulateApiDelay(500);
        const data = createDummyAnalysisResponse(id);
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        apiClient.downloadFile(blob, filename || `analysis-${id}.json`);
        return;
      }
      const data = await apiClient.downloadJson(id);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      apiClient.downloadFile(blob, filename || `analysis-${id}.json`);
    },
  });
}

/**
 * Hook to verify authentication
 */
export function useVerifyAuth() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      if (USE_DUMMY_DATA) {
        await simulateApiDelay(300);
        return {
          id: "user-001",
          email: "demo@example.com",
          name: "Demo User",
          avatar_url: "",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return apiClient.verifyAuth();
    },
    retry: false,
  });
}
