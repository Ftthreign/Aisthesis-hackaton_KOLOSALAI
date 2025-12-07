"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAnalysisDetail, useDeleteAnalysis } from "@/lib/api/hooks";
import { SkeletonDashboard } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import {
  VisionCard,
  StoryCard,
  TasteCard,
  PricingCard,
  BrandThemeCard,
  SEOCard,
  MarketplaceCard,
  PersonaCard,
  PackagingCard,
  ActionPlanCard,
  ExportButtons,
} from "@/components/analysis";

interface HistoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { data: analysis, isLoading, error, refetch } = useAnalysisDetail(id);
  const deleteAnalysis = useDeleteAnalysis();

  const handleDelete = async () => {
    try {
      await deleteAnalysis.mutateAsync(id);
      router.push("/history");
    } catch (error) {
      console.error("Failed to delete analysis:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ErrorState
            title="Failed to load analysis"
            message={error?.message || "The analysis could not be found."}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/history">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {analysis.story.product_name}
              </h1>
              <p className="text-muted-foreground">
                Analysis from{" "}
                {new Date(analysis.created_at).toLocaleDateString("en-US", {
                  dateStyle: "long",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ExportButtons
              analysisId={analysis.id}
              filename={analysis.story.product_name}
              variant="compact"
            />
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete analysis"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-foreground mb-3">
              Are you sure you want to delete this analysis? This action cannot
              be undone.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteAnalysis.isPending}
              >
                {deleteAnalysis.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteAnalysis.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Analysis Content */}
        <div className="space-y-8">
          {/* Vision & Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisionCard
              vision={analysis.vision_result}
              imageUrl={analysis.image_url}
            />
            <StoryCard story={analysis.story} />
          </div>

          {/* Taste & Pricing Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TasteCard taste={analysis.taste} />
            <PricingCard pricing={analysis.pricing} />
          </div>

          {/* Branding Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BrandThemeCard brandTheme={analysis.brand_theme} />
            <SEOCard seo={analysis.seo} />
          </div>

          {/* Marketplace Descriptions */}
          <MarketplaceCard marketplace={analysis.marketplace} />

          {/* Persona & Packaging Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PersonaCard persona={analysis.persona} />
            <PackagingCard packaging={analysis.packaging} />
          </div>

          {/* Action Plan */}
          <ActionPlanCard actionPlan={analysis.action_plan} />
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button asChild variant="outline">
              <Link href="/history">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Link>
            </Button>
            <ExportButtons
              analysisId={analysis.id}
              filename={analysis.story.product_name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
