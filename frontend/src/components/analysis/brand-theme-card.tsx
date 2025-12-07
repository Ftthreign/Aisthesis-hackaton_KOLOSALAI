"use client";

import { Palette, Paintbrush } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import type { BrandTheme } from "@/lib/api/types";

interface BrandThemeCardProps {
  brandTheme: BrandTheme;
}

interface ColorSwatchProps {
  color: string;
  label: string;
}

function ColorSwatch({ color, label }: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-lg border border-border shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground font-mono">{color}</p>
      </div>
      <CopyButton
        text={color}
        size="icon"
        variant="ghost"
        className="ml-auto"
      />
    </div>
  );
}

export function BrandThemeCard({ brandTheme }: BrandThemeCardProps) {
  const primaryColor = brandTheme.primary_color ?? "";
  const secondaryColor = brandTheme.secondary_color ?? "";
  const accentColor = brandTheme.accent_color ?? "";
  const tone = brandTheme.tone ?? "";
  const styleSuggestions = brandTheme.style_suggestions ?? [];

  const hasColors = primaryColor || secondaryColor || accentColor;
  const hasContent = hasColors || tone || styleSuggestions.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Brand Theme
        </CardTitle>
        <CardDescription>
          Color palette and visual style recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Palette */}
        {hasColors && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              Color Palette
            </h4>
            <div className="space-y-4">
              {primaryColor && (
                <ColorSwatch color={primaryColor} label="Primary Color" />
              )}
              {secondaryColor && (
                <ColorSwatch color={secondaryColor} label="Secondary Color" />
              )}
              {accentColor && (
                <ColorSwatch color={accentColor} label="Accent Color" />
              )}
            </div>
          </div>
        )}

        {/* Color Preview */}
        {hasColors && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Palette Preview
            </h4>
            <div className="flex rounded-lg overflow-hidden h-16 shadow-sm border border-border">
              {primaryColor && (
                <div
                  className="flex-1"
                  style={{ backgroundColor: primaryColor }}
                />
              )}
              {secondaryColor && (
                <div
                  className="flex-1"
                  style={{ backgroundColor: secondaryColor }}
                />
              )}
              {accentColor && (
                <div
                  className="flex-1"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </div>
          </div>
        )}

        {/* Brand Tone */}
        {tone && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Brand Tone
              </h4>
              <CopyButton text={tone} />
            </div>
            <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
              {tone}
            </p>
          </div>
        )}

        {/* Style Suggestions */}
        {styleSuggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Paintbrush className="h-4 w-4" />
              Style Suggestions
            </h4>
            <ul className="space-y-2">
              {styleSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="text-sm text-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-1">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty State */}
        {!hasContent && (
          <div className="text-center py-4 text-muted-foreground">
            No brand theme data available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
