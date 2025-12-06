"use client";

import { Wine, Coffee, Utensils } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import type { Taste } from "@/lib/api/types";

interface TasteCardProps {
  taste: Taste;
}

export function TasteCard({ taste }: TasteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wine className="h-5 w-5 text-primary" />
          Taste & Aroma Profile
        </CardTitle>
        <CardDescription>
          Sensory analysis and pairing recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Taste Profile */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Taste Profile
          </h4>
          <ul className="space-y-2">
            {taste.taste_profile.map((taste_item, index) => (
              <li
                key={index}
                className="text-sm text-foreground flex items-start gap-2"
              >
                <span className="text-primary mt-1">•</span>
                {taste_item}
              </li>
            ))}
          </ul>
        </div>

        {/* Aroma Profile */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            Aroma Profile
          </h4>
          <div className="flex flex-wrap gap-2">
            {taste.aroma_profile.map((aroma, index) => (
              <Badge key={index} variant="outline">
                {aroma}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sensory Persona */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Sensory Persona
            </h4>
            <CopyButton text={taste.sensory_persona} />
          </div>
          <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg italic">
            &ldquo;{taste.sensory_persona}&rdquo;
          </p>
        </div>

        {/* Food Pairing */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Recommended Pairings
          </h4>
          <div className="flex flex-wrap gap-2">
            {taste.pairing.map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
