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
import { ImageIcon, AnalyzeIcon, CheckIcon } from "./icons";
import { cn } from "@/lib/utils";

export function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

    setIsUploading(true);
    try {
      // TODO: Implement actual upload logic with API
      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file:", file.name);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to dashboard after successful upload
      router.push("/dashboard");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

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
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
              preview && "p-4"
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
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{file?.name}</p>
              </div>
            ) : (
              <label htmlFor="file-input" className="cursor-pointer block">
                <div className="flex justify-center mb-4">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
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

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <AnalyzeIcon className="h-4 w-4 mr-2" />
                  Upload & Analyze
                </>
              )}
            </Button>
            <Button asChild variant="outline">
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
              <CheckIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
