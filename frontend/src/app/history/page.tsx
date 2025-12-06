"use client";

import Link from "next/link";
import { Upload, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/lib/api/hooks";
import { HistoryCard } from "@/components/history/history-card";
import { SkeletonHistoryGrid } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function HistoryPage() {
  const { data: historyItems, isLoading, error, refetch } = useHistory();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <HistoryIcon className="h-8 w-8 text-primary" />
              Analysis History
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your previous food analyses
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/upload">
              <Upload className="h-4 w-4 mr-2" />
              New Analysis
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && <SkeletonHistoryGrid />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            title="Failed to load history"
            message={error.message || "Could not load your analysis history."}
            onRetry={() => refetch()}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && historyItems?.length === 0 && (
          <EmptyState
            title="No analysis history"
            description="You haven't analyzed any food images yet. Start by uploading your first image!"
            actionLabel="Upload Your First Image"
            actionHref="/dashboard/upload"
          />
        )}

        {/* History Grid */}
        {!isLoading && !error && historyItems && historyItems.length > 0 && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {historyItems.length} {historyItems.length === 1 ? "analysis" : "analyses"} found
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {historyItems.map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
