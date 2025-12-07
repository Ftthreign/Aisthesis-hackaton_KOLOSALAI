"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { apiClient } from "./client";
import type {
  AnalysisData,
  AnalysisCreateData,
  AnalysisStatus,
  User,
} from "./types";
import {
  createDummyAnalysisData,
  simulateApiDelay,
  dummyUser,
} from "./dummy-data";
import {
  getHistoryEntries,
  addHistoryEntry,
  updateHistoryEntry,
  removeHistoryEntry,
} from "./history-storage";

// Flag to use dummy data while backend is in development
// Set to false once backend is ready
const USE_DUMMY_DATA = false;

// Query Keys
export const queryKeys = {
  analysis: (id: string) => ["analysis", id] as const,
  user: ["user"] as const,
  history: ["history"] as const,
};

/**
 * Hook to fetch analysis history from localStorage and get data from backend
 */
export function useHistory() {
  const queryClient = useQueryClient();

  // Fetch analysis data for all history entries
  const query = useQuery<AnalysisData[], Error>({
    queryKey: queryKeys.history,
    queryFn: async () => {
      const entries = getHistoryEntries();
      if (entries.length === 0) {
        return [];
      }

      // Fetch all analyses in parallel
      const results = await Promise.allSettled(
        entries.map(async (entry) => {
          try {
            const analysis = await apiClient.getAnalysis(entry.id);
            // Update localStorage entry with latest status and info
            updateHistoryEntry(entry.id, {
              status: analysis.status,
              imageUrl: analysis.image_url,
              productName: analysis.story?.product_name || undefined,
            });
            return analysis;
          } catch (error) {
            // If analysis not found (404), remove from history
            if (
              error instanceof apiClient.ApiClientError &&
              error.status === 404
            ) {
              removeHistoryEntry(entry.id);
              return null;
            }
            throw error;
          }
        }),
      );

      // Filter out failed requests and null values
      const analyses = results
        .filter(
          (result): result is PromiseFulfilledResult<AnalysisData | null> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value)
        .filter((analysis): analysis is AnalysisData => analysis !== null);

      // Sort by created_at descending (newest first)
      return analyses.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    },
    // Refetch when window gains focus to keep data fresh
    refetchOnWindowFocus: true,
  });

  // Refresh history from localStorage
  const refreshHistory = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.history });
  }, [queryClient]);

  return {
    ...query,
    refreshHistory,
  };
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
      const analysis = await apiClient.getAnalysis(id);

      // Update localStorage entry with latest status
      updateHistoryEntry(id, {
        status: analysis.status,
        imageUrl: analysis.image_url,
        productName: analysis.story?.product_name || undefined,
      });

      return analysis;
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
 * Saves analysis ID to localStorage for history tracking
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

        // Save to localStorage
        addHistoryEntry({
          id: result.id,
          createdAt: result.created_at,
          status: result.status,
          imageUrl: result.image_url,
          productName: result.story?.product_name || undefined,
        });

        return result;
      }

      // Step 1: Create analysis (returns immediately with PENDING status)
      setAnalysisStatus("PENDING");
      const createResult: AnalysisCreateData = await apiClient.createAnalysis(
        file,
        context,
      );
      setAnalysisId(createResult.id);

      // Save to localStorage immediately with PENDING status
      addHistoryEntry({
        id: createResult.id,
        createdAt: new Date().toISOString(),
        status: createResult.status,
      });

      // Step 2: Poll until completed or failed
      const analysisResult = await apiClient.pollAnalysisUntilComplete(
        createResult.id,
        {
          intervalMs: 2000,
          maxAttempts: 90, // 3 minutes max
          onStatusChange: (status) => {
            setAnalysisStatus(status as AnalysisStatus);
            // Update localStorage with new status
            updateHistoryEntry(createResult.id, {
              status: status as AnalysisStatus,
            });
          },
        },
      );

      // Update localStorage with final result
      updateHistoryEntry(createResult.id, {
        status: analysisResult.status,
        imageUrl: analysisResult.image_url,
        productName: analysisResult.story?.product_name || undefined,
      });

      return analysisResult;
    },
    onSuccess: (data) => {
      // Pre-populate the analysis cache
      queryClient.setQueryData(queryKeys.analysis(data.id), data);
      // Invalidate history to include new analysis
      queryClient.invalidateQueries({ queryKey: queryKeys.history });
    },
    onError: () => {
      setAnalysisStatus("FAILED");
      // Update localStorage if we have an ID
      if (analysisId) {
        updateHistoryEntry(analysisId, { status: "FAILED" });
      }
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
 * Hook to delete an analysis from local history
 * Note: This only removes from localStorage, not from backend
 */
export function useDeleteAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (id: string) => {
      // Remove from localStorage
      removeHistoryEntry(id);
      return { message: "Analysis removed from history" };
    },
    onSuccess: (_, deletedId) => {
      // Remove the analysis from cache
      queryClient.removeQueries({ queryKey: queryKeys.analysis(deletedId) });
      // Invalidate history to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.history });
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
