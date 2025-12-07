"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  variant?: "card" | "inline" | "full";
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading the data. Please try again.",
  onRetry,
  retryLabel = "Try Again",
  className,
  variant = "card",
}: ErrorStateProps) {
  const content = (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {retryLabel}
        </Button>
      )}
    </div>
  );

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive",
          className
        )}
      >
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          {message && <p className="text-sm opacity-90">{message}</p>}
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div
        className={cn(
          "min-h-[400px] flex items-center justify-center",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

interface NotFoundStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function NotFoundState({
  title = "Not Found",
  message = "The item you're looking for doesn't exist or has been removed.",
  actionLabel = "Go Back",
  actionHref,
  className,
}: NotFoundStateProps) {
  return (
    <Card className={className}>
      <CardContent className="py-12">
        <div className="text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {message}
          </p>
          {actionHref && (
            <Button asChild variant="outline">
              <a href={actionHref}>{actionLabel}</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
