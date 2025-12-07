"use client";

import { DollarSign, TrendingUp, Clock, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import type { Pricing } from "@/lib/api/types";

interface PricingCardProps {
  pricing: Pricing;
}

function formatCurrency(value: number | null): string {
  if (value === null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function PricingCard({ pricing }: PricingCardProps) {
  const recommendedPrice = pricing.recommended_price;
  const minPrice = pricing.min_price;
  const maxPrice = pricing.max_price;
  const reasoning = pricing.reasoning ?? "";
  const promoStrategy = pricing.promo_strategy ?? [];
  const bestPostingTime = pricing.best_posting_time ?? "";

  const hasPricing =
    recommendedPrice !== null || minPrice !== null || maxPrice !== null;
  const hasContent =
    hasPricing || reasoning || promoStrategy.length > 0 || bestPostingTime;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Smart Pricing
        </CardTitle>
        <CardDescription>
          AI-powered pricing strategy and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        {hasPricing && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-1">
                Recommended Price
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(recommendedPrice)}
              </p>
            </div>
            {(minPrice !== null || maxPrice !== null) && (
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Min</p>
                  <p className="font-medium">{formatCurrency(minPrice)}</p>
                </div>
                <div className="flex items-center">
                  <div className="h-1 w-24 bg-gradient-to-r from-muted-foreground/30 via-primary to-muted-foreground/30 rounded-full" />
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Max</p>
                  <p className="font-medium">{formatCurrency(maxPrice)}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pricing Reasoning */}
        {reasoning && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Pricing Rationale
              </h4>
              <CopyButton text={reasoning} />
            </div>
            <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
              {reasoning}
            </p>
          </div>
        )}

        {/* Promo Strategy */}
        {promoStrategy.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Promo Strategies
            </h4>
            <ul className="space-y-2">
              {promoStrategy.map((strategy, index) => (
                <li
                  key={index}
                  className="text-sm text-foreground flex items-start gap-2"
                >
                  <Badge variant="outline" className="shrink-0 mt-0.5">
                    {index + 1}
                  </Badge>
                  {strategy}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Best Posting Time */}
        {bestPostingTime && (
          <div className="bg-primary/5 rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Best Posting Time
            </h4>
            <p className="text-sm text-foreground">{bestPostingTime}</p>
          </div>
        )}

        {/* Empty State */}
        {!hasContent && (
          <div className="text-center py-4 text-muted-foreground">
            No pricing data available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
