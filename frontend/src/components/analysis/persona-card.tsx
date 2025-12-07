"use client";

import { User, Target, Heart, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import type { Persona } from "@/lib/api/types";

interface PersonaCardProps {
  persona: Persona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Buyer Persona
        </CardTitle>
        <CardDescription>
          Understand your ideal customer profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Persona Identity */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {persona.name}
                </h3>
                <CopyButton
                  text={`${persona.name}\n\n${persona.bio}`}
                  size="sm"
                />
              </div>
              <p className="text-sm text-muted-foreground">{persona.bio}</p>
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Demographics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Age Range</p>
              <p className="text-sm font-medium text-foreground">
                {persona.demographics.age_range}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Location</p>
              <p className="text-sm font-medium text-foreground">
                {persona.demographics.location}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Gender</p>
              <p className="text-sm font-medium text-foreground">
                {persona.demographics.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Motivations */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Motivations
          </h4>
          <ul className="space-y-2">
            {persona.motivations.map((motivation, index) => (
              <li
                key={index}
                className="text-sm text-foreground flex items-start gap-2"
              >
                <Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {motivation}
              </li>
            ))}
          </ul>
        </div>

        {/* Pain Points */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Pain Points
          </h4>
          <div className="flex flex-wrap gap-2">
            {persona.pain_points.map((painPoint, index) => (
              <Badge key={index} variant="outline" className="text-destructive border-destructive/30">
                {painPoint}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
