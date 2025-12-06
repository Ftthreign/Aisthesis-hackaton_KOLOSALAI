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
                {story.product_name}
              </h3>
              <p className="text-lg text-muted-foreground italic flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {story.tagline}
              </p>
            </div>
            <CopyButton
              text={`${story.product_name}\n${story.tagline}`}
              label="Copy name & tagline"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Short Description
              </h4>
              <CopyButton text={story.short_desc} />
            </div>
            <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
              {story.short_desc}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Long Description
              </h4>
              <CopyButton text={story.long_desc} />
            </div>
            <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg leading-relaxed">
              {story.long_desc}
            </p>
          </div>
        </div>

        {/* Instagram Captions */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Instagram Captions
          </h4>
          <Tabs defaultValue="casual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="casual">Casual</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="storytelling">Storytelling</TabsTrigger>
            </TabsList>
            <TabsContent value="casual">
              <CopyBlock text={story.caption_casual} />
            </TabsContent>
            <TabsContent value="professional">
              <CopyBlock text={story.caption_professional} />
            </TabsContent>
            <TabsContent value="storytelling">
              <CopyBlock text={story.caption_storytelling} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
