"use client";

import { BookOpen, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton, CopyBlock } from "@/components/ui/copy-button";
import type { Story } from "@/lib/api/types";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const productName = story.product_name ?? "Untitled Product";
  const tagline = story.tagline ?? "";
  const shortDesc = story.short_desc ?? "";
  const longDesc = story.long_desc ?? "";
  const captionCasual = story.caption_casual ?? "";
  const captionProfessional = story.caption_professional ?? "";
  const captionStorytelling = story.caption_storytelling ?? "";

  const hasDescriptions = shortDesc || longDesc;
  const hasCaptions =
    captionCasual || captionProfessional || captionStorytelling;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Product Story
        </CardTitle>
        <CardDescription>
          AI-generated branding and marketing content for your product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Name & Tagline */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground">
                {productName}
              </h3>
              {tagline && (
                <p className="text-lg text-muted-foreground italic flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {tagline}
                </p>
              )}
            </div>
            <CopyButton
              text={tagline ? `${productName}\n${tagline}` : productName}
              label="Copy name & tagline"
            />
          </div>
        </div>

        {/* Descriptions */}
        {hasDescriptions && (
          <div className="space-y-4">
            {shortDesc && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Short Description
                  </h4>
                  <CopyButton text={shortDesc} />
                </div>
                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                  {shortDesc}
                </p>
              </div>
            )}

            {longDesc && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Long Description
                  </h4>
                  <CopyButton text={longDesc} />
                </div>
                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg leading-relaxed">
                  {longDesc}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instagram Captions */}
        {hasCaptions && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Instagram Captions
            </h4>
            <Tabs defaultValue="casual" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="casual" disabled={!captionCasual}>
                  Casual
                </TabsTrigger>
                <TabsTrigger
                  value="professional"
                  disabled={!captionProfessional}
                >
                  Professional
                </TabsTrigger>
                <TabsTrigger
                  value="storytelling"
                  disabled={!captionStorytelling}
                >
                  Storytelling
                </TabsTrigger>
              </TabsList>
              {captionCasual && (
                <TabsContent value="casual">
                  <CopyBlock text={captionCasual} />
                </TabsContent>
              )}
              {captionProfessional && (
                <TabsContent value="professional">
                  <CopyBlock text={captionProfessional} />
                </TabsContent>
              )}
              {captionStorytelling && (
                <TabsContent value="storytelling">
                  <CopyBlock text={captionStorytelling} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {!hasDescriptions && !hasCaptions && !tagline && (
          <div className="text-center py-4 text-muted-foreground">
            No story content available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
