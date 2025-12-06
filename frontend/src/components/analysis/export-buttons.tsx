"use client";

import { FileJson, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadPdf, useDownloadJson } from "@/lib/api/hooks";

interface ExportButtonsProps {
  analysisId: string;
  filename?: string;
  variant?: "default" | "compact";
}

export function ExportButtons({
  analysisId,
  filename,
  variant = "default",
}: ExportButtonsProps) {
  const downloadPdf = useDownloadPdf();
  const downloadJson = useDownloadJson();

  const handleDownloadPdf = () => {
    downloadPdf.mutate({
      id: analysisId,
      filename: filename ? `${filename}.pdf` : undefined,
    });
  };

  const handleDownloadJson = () => {
    downloadJson.mutate({
      id: analysisId,
      filename: filename ? `${filename}.json` : undefined,
    });
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownloadPdf}
          disabled={downloadPdf.isPending}
          title="Export as PDF"
        >
          {downloadPdf.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownloadJson}
          disabled={downloadJson.isPending}
          title="Export as JSON"
        >
          {downloadJson.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileJson className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        onClick={handleDownloadPdf}
        disabled={downloadPdf.isPending}
        className="gap-2"
      >
        {downloadPdf.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        Export PDF
      </Button>
      <Button
        variant="outline"
        onClick={handleDownloadJson}
        disabled={downloadJson.isPending}
        className="gap-2"
      >
        {downloadJson.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileJson className="h-4 w-4" />
        )}
        Export JSON
      </Button>
    </div>
  );
}
