"use client";

import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VisionResult } from "@/lib/api/types";

interface VisionCardProps {
  vision: VisionResult;
  imageUrl?: string;
}

export function VisionCard({ vision, imageUrl }: VisionCardProps) {
  const labels = vision.labels ?? [];
  const objects = vision.objects ?? [];
  const colors = vision.colors ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Vision Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Preview */}
        {imageUrl && (
          <div className="rounded-lg overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Analyzed food"
              className="w-full h-auto max-h-64 object-cover"
            />
          </div>
        )}

        {/* Detected Labels */}
        {labels.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Detected Labels
            </h4>
            <div className="flex flex-wrap gap-2">
              {labels.map((label, index) => (
                <Badge key={index} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Detected Objects */}
        {objects.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Detected Objects
            </h4>
            <div className="flex flex-wrap gap-2">
              {objects.map((obj, index) => (
                <Badge key={index} variant="outline">
                  {obj}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Color Palette */}
        {colors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Dominant Colors
            </h4>
            <div className="flex gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1"
                  title={color}
                >
                  <div
                    className="w-8 h-8 rounded-full border border-border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mood */}
        {vision.mood && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Mood & Atmosphere
            </h4>
            <p className="text-sm text-foreground">{vision.mood}</p>
          </div>
        )}

        {/* Empty State */}
        {labels.length === 0 &&
          objects.length === 0 &&
          colors.length === 0 &&
          !vision.mood && (
            <div className="text-center py-4 text-muted-foreground">
              No vision analysis data available.
            </div>
          )}
      </CardContent>
    </Card>
  );
}
