"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ImagePlus,
  ClipboardCheck,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadAnalysis, getStatusLabel } from "@/lib/api/hooks";

export function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [context, setContext] = useState<string>("");

  const uploadAnalysis = useUploadAnalysis();

  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFileChange(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      const result = await uploadAnalysis.mutateAsync({
        file,
        context: context.trim() || undefined,
      });
      // Redirect to the analysis result page after successful upload
      router.push(`/dashboard/${result.id}`);
    } catch (error) {
      console.error("Upload failed:", error);
      // Error is handled by the mutation state
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setContext("");
    uploadAnalysis.reset();
  };

  // Get status display info
  const getStatusInfo = () => {
    if (!uploadAnalysis.analysisStatus) return null;

    switch (uploadAnalysis.analysisStatus) {
      case "PENDING":
        return {
          label: "Queued for processing...",
          description:
            "Your image has been uploaded and is waiting to be processed.",
        };
      case "PROCESSING":
        return {
          label: "Analyzing your image...",
          description:
            "Our AI is generating insights for your product. This may take a moment.",
        };
      case "COMPLETED":
        return {
          label: "Analysis complete!",
          description: "Redirecting to your results...",
        };
      case "FAILED":
        return {
          label: "Analysis failed",
          description:
            "There was an error processing your image. Please try again.",
        };
      default:
        return {
          label: getStatusLabel(uploadAnalysis.analysisStatus),
          description: "Processing...",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Upload Image</CardTitle>
        <CardDescription>
          Upload a food image to analyze and get AI-powered insights and
          recommendations for your business.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {uploadAnalysis.isError && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Upload failed
                </p>
                <p className="text-sm text-destructive/80">
                  {uploadAnalysis.error?.message ||
                    "An error occurred while analyzing your image. Please try again."}
                </p>
              </div>
            </div>
          )}

          {/* Upload Progress Indicator with Status */}
          {uploadAnalysis.isPending && statusInfo && (
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {statusInfo.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {statusInfo.description}
                </p>
                {uploadAnalysis.analysisId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Analysis ID: {uploadAnalysis.analysisId}
                  </p>
                )}
              </div>
            </div>
          )}

          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
              preview && "p-4",
              uploadAnalysis.isPending && "opacity-50 pointer-events-none",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              id="file-input"
              onChange={handleInputChange}
              disabled={uploadAnalysis.isPending}
            />

            {preview ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 rounded-lg mx-auto"
                  />
                  {!uploadAnalysis.isPending && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{file?.name}</p>
              </div>
            ) : (
              <label htmlFor="file-input" className="cursor-pointer block">
                <div className="flex justify-center mb-4">
                  <ImagePlus className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="text-foreground font-medium mb-2">
                  Click to upload or drag and drop
                </div>
                <div className="text-sm text-muted-foreground">
                  PNG, JPG, WEBP up to 10MB
                </div>
              </label>
            )}
          </div>

          {/* Optional Context Input */}
          {preview && (
            <div className="space-y-2">
              <label
                htmlFor="context"
                className="text-sm font-medium text-foreground"
              >
                Additional Context (Optional)
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add any additional information about your product (e.g., target market, price range, brand values)..."
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                disabled={uploadAnalysis.isPending}
              />
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!file || uploadAnalysis.isPending}
            >
              {uploadAnalysis.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploadAnalysis.analysisStatus === "PENDING"
                    ? "Queued..."
                    : uploadAnalysis.analysisStatus === "PROCESSING"
                      ? "Analyzing..."
                      : "Processing..."}
                </>
              ) : (
                <>
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Upload & Analyze
                </>
              )}
            </Button>
            <Button
              asChild
              variant="outline"
              disabled={uploadAnalysis.isPending}
            >
              <Link href="/dashboard">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function UploadTips() {
  const tips = [
    "Use high-quality images with good lighting",
    "Capture the entire dish in the frame",
    "Avoid blurry or dark images",
    "Show the plating and presentation clearly",
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Tips for Best Results</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
