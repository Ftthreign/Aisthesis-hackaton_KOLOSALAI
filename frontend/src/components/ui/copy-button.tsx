"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  showLabel?: boolean;
}

export function CopyButton({
  text,
  className,
  variant = "outline",
  size = "sm",
  label = "Copy",
  showLabel = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, [text]);

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn("gap-2", className)}
      title={copied ? "Copied!" : label}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          {showLabel && <span>Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {showLabel && <span>{label}</span>}
        </>
      )}
    </Button>
  );
}

interface CopyBlockProps {
  text: string;
  className?: string;
  maxHeight?: string;
}

export function CopyBlock({ text, className, maxHeight = "200px" }: CopyBlockProps) {
  return (
    <div className={cn("relative group", className)}>
      <div
        className="bg-muted rounded-lg p-4 pr-12 text-sm overflow-auto"
        style={{ maxHeight }}
      >
        <pre className="whitespace-pre-wrap break-words font-mono text-muted-foreground">
          {text}
        </pre>
      </div>
      <CopyButton
        text={text}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        size="icon"
        variant="ghost"
      />
    </div>
  );
}
