"use client";

import { Package, Recycle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Packaging } from "@/lib/api/types";

interface PackagingCardProps {
  packaging: Packaging;
}

export function PackagingCard({ packaging }: PackagingCardProps) {
  const suggestions = packaging.suggestions ?? [];
  const materialRecommendations = packaging.material_recommendations ?? [];

  const hasContent =
    suggestions.length > 0 || materialRecommendations.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Packaging Tips
        </CardTitle>
        <CardDescription>
          Recommendations for product packaging and presentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Packaging Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Design Suggestions
            </h4>
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="text-sm text-foreground flex items-start gap-3 bg-muted/30 rounded-lg p-3"
                >
                  <Badge
                    variant="secondary"
                    className="shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center"
                  >
                    {index + 1}
                  </Badge>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Material Recommendations */}
        {materialRecommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Recycle className="h-4 w-4" />
              Material Recommendations
            </h4>
            <div className="flex flex-wrap gap-2">
              {materialRecommendations.map((material, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                >
                  <Recycle className="h-3 w-3 mr-1" />
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Eco-friendly Note */}
        {hasContent && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Recycle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                  Eco-Friendly Packaging
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  Consider sustainable packaging options to appeal to
                  environmentally conscious consumers and reduce your carbon
                  footprint.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasContent && (
          <div className="text-center py-4 text-muted-foreground">
            No packaging recommendations available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
