"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { apiClient } from "./client";
import type {
  AnalysisData,
  AnalysisCreateData,
  HistoryItem,
  DeleteResponse,
  AnalysisStatus,
  User,
} from "./types";
import {
  createDummyAnalysisData,
  dummyHistoryItems,
  simulateApiDelay,
  dummyUser,
} from "./dummy-data";

// Flag to use dummy data while backend is in development
// Set to false once backend is ready
const USE_DUMMY_DATA = false;

// Query Keys
export const queryKeys = {
  history: ["history"] as const,
  analysis: (id: string) => ["analysis", id] as const,
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
 * Hook to fetch a specific analysis by ID
 * This will poll if the analysis is still processing
 */
export function useAnalysis(id: string, options?: { poll?: boolean }) {
  const { poll = true } = options || {};

  return useQuery<AnalysisData, Error>({
    queryKey: queryKeys.analysis(id),
    queryFn: async () => {
      if (USE_DUMMY_DATA) {
        await simulateApiDelay(1000);
        return createDummyAnalysisData(id);
      }
      return apiClient.getAnalysis(id);
    },
    enabled: !!id,
    // Poll every 2 seconds if status is PENDING or PROCESSING
    refetchInterval: (query) => {
      if (!poll) return false;
      const data = query.state.data;
      if (data?.status === "PENDING" || data?.status === "PROCESSING") {
        return 2000;
      }
      return false;
    },
  });
}

/**
 * Hook for upload and analysis with async polling support
 * Returns mutation and current status/progress
 */
export function useUploadAnalysis() {
  const queryClient = useQueryClient();
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(
    null,
  );
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const mutation = useMutation<
    AnalysisData,
    Error,
    { file: File; context?: string }
  >({
    mutationFn: async ({ file, context }) => {
      if (USE_DUMMY_DATA) {
        // Simulate async flow
        setAnalysisStatus("PENDING");
        await simulateApiDelay(500);

        const id = `analysis-${Date.now()}`;
        setAnalysisId(id);
        setAnalysisStatus("PROCESSING");

        await simulateApiDelay(2000); // Simulate processing time

        const imageUrl = URL.createObjectURL(file);
        const result = createDummyAnalysisData(id, imageUrl);
        setAnalysisStatus("COMPLETED");

        return result;
      }

      // Step 1: Create analysis (returns immediately with PENDING status)
      setAnalysisStatus("PENDING");
      const createResult: AnalysisCreateData = await apiClient.createAnalysis(
        file,
        context,
      );
      setAnalysisId(createResult.id);

      // Step 2: Poll until completed or failed
      const analysisResult = await apiClient.pollAnalysisUntilComplete(
        createResult.id,
        {
          intervalMs: 2000,
          maxAttempts: 90, // 3 minutes max
          onStatusChange: (status) => {
            setAnalysisStatus(status as AnalysisStatus);
          },
        },
      );

      return analysisResult;
    },
    onSuccess: (data) => {
      // Invalidate history to include new analysis
      queryClient.invalidateQueries({ queryKey: queryKeys.history });
      // Pre-populate the analysis cache
      queryClient.setQueryData(queryKeys.analysis(data.id), data);
    },
    onError: () => {
      setAnalysisStatus("FAILED");
    },
    onSettled: () => {
      // Reset status after a delay to allow UI to show final state
      setTimeout(() => {
        setAnalysisStatus(null);
        setAnalysisId(null);
      }, 1000);
    },
  });

  const reset = useCallback(() => {
    mutation.reset();
    setAnalysisStatus(null);
    setAnalysisId(null);
  }, [mutation]);

  return {
    ...mutation,
    analysisStatus,
    analysisId,
    reset,
  };
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
        old?.filter((item) => item.id !== deletedId),
      );
      // Remove the analysis from cache
      queryClient.removeQueries({ queryKey: queryKeys.analysis(deletedId) });
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
        const data = createDummyAnalysisData(id);
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
 * Hook to get user profile
 */
export function useUserProfile() {
  return useQuery<User, Error>({
    queryKey: queryKeys.user,
    queryFn: async () => {
      if (USE_DUMMY_DATA) {
        await simulateApiDelay(300);
        return dummyUser;
      }
      return apiClient.getProfile();
    },
    retry: false,
  });
}

/**
 * Get analysis status label for UI
 */
export function getStatusLabel(status: AnalysisStatus): string {
  switch (status) {
    case "PENDING":
      return "Queued";
    case "PROCESSING":
      return "Processing";
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
    default:
      return "Unknown";
  }
}

/**
 * Get analysis status color for UI
 */
export function getStatusColor(
  status: AnalysisStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "PROCESSING":
      return "default";
    case "COMPLETED":
      return "outline";
    case "FAILED":
      return "destructive";
    default:
      return "default";
  }
}
