"use client";

import type { AnalysisStatus } from "./types";

const HISTORY_STORAGE_KEY = "aisthesis_analysis_history";

export interface HistoryEntry {
  id: string;
  createdAt: string;
  status: AnalysisStatus;
  imageUrl?: string;
  productName?: string;
}

/**
 * Get all history entries from localStorage
 */
export function getHistoryEntries(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const entries = JSON.parse(stored) as HistoryEntry[];
    // Sort by createdAt descending (newest first)
    return entries.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Failed to parse history from localStorage:", error);
    return [];
  }
}

/**
 * Add a new analysis ID to history
 */
export function addHistoryEntry(entry: HistoryEntry): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const entries = getHistoryEntries();
    // Check if entry already exists
    const existingIndex = entries.findIndex((e) => e.id === entry.id);
    if (existingIndex >= 0) {
      // Update existing entry
      entries[existingIndex] = { ...entries[existingIndex], ...entry };
    } else {
      // Add new entry at the beginning
      entries.unshift(entry);
    }
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
}

/**
 * Update an existing history entry
 */
export function updateHistoryEntry(
  id: string,
  updates: Partial<Omit<HistoryEntry, "id">>
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const entries = getHistoryEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index >= 0) {
      entries[index] = { ...entries[index], ...updates };
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
    }
  } catch (error) {
    console.error("Failed to update history in localStorage:", error);
  }
}

/**
 * Remove an analysis from history
 */
export function removeHistoryEntry(id: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const entries = getHistoryEntries();
    const filtered = entries.filter((e) => e.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to remove history from localStorage:", error);
  }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear history from localStorage:", error);
  }
}

/**
 * Get a single history entry by ID
 */
export function getHistoryEntry(id: string): HistoryEntry | null {
  const entries = getHistoryEntries();
  return entries.find((e) => e.id === id) || null;
}

/**
 * Check if an analysis ID exists in history
 */
export function hasHistoryEntry(id: string): boolean {
  const entries = getHistoryEntries();
  return entries.some((e) => e.id === id);
}
