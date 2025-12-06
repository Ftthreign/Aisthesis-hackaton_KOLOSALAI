"use client";

import * as React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "default",
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isLoading && onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md mx-4 bg-card rounded-lg shadow-lg border border-border animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div
            className={cn(
              "mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4",
              variant === "destructive"
                ? "bg-destructive/10"
                : "bg-primary/10"
            )}
          >
            <AlertTriangle
              className={cn(
                "h-6 w-6",
                variant === "destructive"
                  ? "text-destructive"
                  : "text-primary"
              )}
            />
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              className="flex-1"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
