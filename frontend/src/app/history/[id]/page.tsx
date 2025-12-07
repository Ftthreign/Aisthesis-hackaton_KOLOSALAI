"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Loader2,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useAnalysis,
  useDeleteAnalysis,
  getStatusLabel,
  getStatusColor,
} from "@/lib/api/hooks";
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
} from "@/components/analysis";

interface HistoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    data: analysis,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useAnalysis(id);
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

  // Handle PENDING or PROCESSING status
  if (analysis.status === "PENDING" || analysis.status === "PROCESSING") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="icon">
              <Link href="/history">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              Analysis in Progress
            </h1>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {analysis.status === "PENDING" ? (
                  <Clock className="h-16 w-16 text-muted-foreground animate-pulse" />
                ) : (
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                )}
              </div>
              <CardTitle className="text-xl">
                {analysis.status === "PENDING"
                  ? "Queued for Processing"
                  : "Analyzing Your Image"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                {analysis.status === "PENDING"
                  ? "Your image has been uploaded and is waiting to be processed by our AI."
                  : "Our AI is analyzing your image and generating insights. This usually takes 30-60 seconds."}
              </p>

              {analysis.image_url && (
                <div className="flex justify-center py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={analysis.image_url}
                    alt="Uploaded product"
                    className="max-h-48 rounded-lg shadow-md"
                  />
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                <span>Status: {getStatusLabel(analysis.status)}</span>
                {isFetching && <span>• Checking...</span>}
              </div>

              <p className="text-xs text-muted-foreground">
                Analysis ID: {analysis.id}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Handle FAILED status
  if (analysis.status === "FAILED") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="icon">
              <Link href="/history">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              Analysis Failed
            </h1>
          </div>

          <Card className="border-destructive/50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">
                Analysis Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                {analysis.error ||
                  "An error occurred while processing your image. Please try uploading again."}
              </p>

              {analysis.image_url && (
                <div className="flex justify-center py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={analysis.image_url}
                    alt="Uploaded product"
                    className="max-h-48 rounded-lg shadow-md opacity-75"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild>
                  <Link href="/dashboard/upload">Try Again</Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove from History
                </Button>
                <Button asChild variant="outline">
                  <Link href="/history">Back to History</Link>
                </Button>
              </div>

              {showDeleteConfirm && (
                <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-sm text-foreground mb-3">
                    Remove this failed analysis from your history?
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteAnalysis.isPending}
                    >
                      {deleteAnalysis.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        "Yes, Remove"
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

              <p className="text-xs text-muted-foreground">
                Analysis ID: {analysis.id}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // COMPLETED status - show full analysis
  const productName = analysis.story?.product_name || "Product Analysis";

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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {productName}
                </h1>
                <Badge variant={getStatusColor(analysis.status)}>
                  {getStatusLabel(analysis.status)}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Analysis from{" "}
                {new Date(analysis.created_at).toLocaleDateString("en-US", {
                  dateStyle: "long",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setShowDeleteConfirm(true)}
              title="Remove from history"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-foreground mb-3">
              Remove this analysis from your history? The data will still exist
              on the server.
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
                    Removing...
                  </>
                ) : (
                  "Yes, Remove"
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
            {analysis.vision_result && (
              <VisionCard
                vision={analysis.vision_result}
                imageUrl={analysis.image_url}
              />
            )}
            {analysis.story && <StoryCard story={analysis.story} />}
          </div>

          {/* Taste & Pricing Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysis.taste && <TasteCard taste={analysis.taste} />}
            {analysis.pricing && <PricingCard pricing={analysis.pricing} />}
          </div>

          {/* Branding Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysis.brand_theme && (
              <BrandThemeCard brandTheme={analysis.brand_theme} />
            )}
            {analysis.seo && <SEOCard seo={analysis.seo} />}
          </div>

          {/* Marketplace Descriptions */}
          {analysis.marketplace && (
            <MarketplaceCard marketplace={analysis.marketplace} />
          )}

          {/* Persona & Packaging Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysis.persona && <PersonaCard persona={analysis.persona} />}
            {analysis.packaging && (
              <PackagingCard packaging={analysis.packaging} />
            )}
          </div>

          {/* Action Plan */}
          {analysis.action_plan && (
            <ActionPlanCard actionPlan={analysis.action_plan} />
          )}
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
            <Button asChild>
              <Link href="/dashboard/upload">New Analysis</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
