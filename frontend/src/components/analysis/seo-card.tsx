"use client";

import { Search, Hash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import type { SEO } from "@/lib/api/types";

interface SEOCardProps {
  seo: SEO;
}

export function SEOCard({ seo }: SEOCardProps) {
  const allKeywords = seo.keywords.join(", ");
  const allHashtags = seo.hashtags.join(" ");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          SEO & Hashtags
        </CardTitle>
        <CardDescription>
          Optimized keywords and hashtags for discoverability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Keywords */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Search className="h-4 w-4" />
              Keywords
            </h4>
            <CopyButton text={allKeywords} label="Copy all keywords" showLabel />
          </div>
          <div className="flex flex-wrap gap-2">
            {seo.keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Hashtags
            </h4>
            <CopyButton text={allHashtags} label="Copy all hashtags" showLabel />
          </div>
          <div className="flex flex-wrap gap-2">
            {seo.hashtags.map((hashtag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-muted transition-colors text-primary"
              >
                {hashtag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Copy Section */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Quick Copy
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">All Keywords (comma separated)</span>
              <CopyButton text={allKeywords} size="sm" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">All Hashtags (space separated)</span>
              <CopyButton text={allHashtags} size="sm" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Keywords + Hashtags</span>
              <CopyButton text={`${allKeywords}\n\n${allHashtags}`} size="sm" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
