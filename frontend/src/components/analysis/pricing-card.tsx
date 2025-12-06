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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function PricingCard({ pricing }: PricingCardProps) {
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
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">
              Recommended Price
            </p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(pricing.recommended_price)}
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Min</p>
              <p className="font-medium">{formatCurrency(pricing.min_price)}</p>
            </div>
            <div className="flex items-center">
              <div className="h-1 w-24 bg-gradient-to-r from-muted-foreground/30 via-primary to-muted-foreground/30 rounded-full" />
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Max</p>
              <p className="font-medium">{formatCurrency(pricing.max_price)}</p>
            </div>
          </div>
        </div>

        {/* Pricing Reasoning */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Pricing Rationale
            </h4>
            <CopyButton text={pricing.reasoning} />
          </div>
          <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
            {pricing.reasoning}
          </p>
        </div>

        {/* Promo Strategy */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Promo Strategies
          </h4>
          <ul className="space-y-2">
            {pricing.promo_strategy.map((strategy, index) => (
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

        {/* Best Posting Time */}
        <div className="bg-primary/5 rounded-lg p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Best Posting Time
          </h4>
          <p className="text-sm text-foreground">{pricing.best_posting_time}</p>
        </div>
      </CardContent>
    </Card>
  );
}
