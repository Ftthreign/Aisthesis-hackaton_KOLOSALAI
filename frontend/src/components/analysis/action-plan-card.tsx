"use client";

import { Calendar, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import type { ActionPlan } from "@/lib/api/types";

interface ActionPlanCardProps {
  actionPlan: ActionPlan;
}

interface DayPlanItemProps {
  day: number;
  content: string;
  isActive?: boolean;
}

function DayPlanItem({ day, content, isActive = false }: DayPlanItemProps) {
  return (
    <div
      className={cn(
        "relative flex gap-4 pb-8 last:pb-0",
        "before:absolute before:left-[15px] before:top-8 before:h-full before:w-0.5 before:bg-border last:before:hidden",
      )}
    >
      <div
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
          isActive
            ? "bg-primary border-primary text-primary-foreground"
            : "bg-background border-border text-muted-foreground",
        )}
      >
        {isActive ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <span className="text-xs font-medium">{day}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-foreground mb-1">
            Day {day}
          </h4>
          <CopyButton
            text={content}
            size="icon"
            variant="ghost"
            className="shrink-0 h-6 w-6"
          />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}

export function ActionPlanCard({ actionPlan }: ActionPlanCardProps) {
  const days = [
    { day: 1, content: actionPlan.day_1 },
    { day: 2, content: actionPlan.day_2 },
    { day: 3, content: actionPlan.day_3 },
    { day: 4, content: actionPlan.day_4 },
    { day: 5, content: actionPlan.day_5 },
    { day: 6, content: actionPlan.day_6 },
    { day: 7, content: actionPlan.day_7 },
  ].filter((d) => d.content !== null && d.content !== undefined) as {
    day: number;
    content: string;
  }[];

  const hasContent = days.length > 0;

  const fullPlanText = days
    .map((d) => `Day ${d.day}:\n${d.content}`)
    .join("\n\n");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              7-Day Action Plan
            </CardTitle>
            <CardDescription>
              Step-by-step guide to launch and promote your product
            </CardDescription>
          </div>
          {hasContent && (
            <CopyButton
              text={fullPlanText}
              label="Copy full plan"
              showLabel
              variant="outline"
              size="sm"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasContent ? (
          <div className="space-y-0">
            {days.map((dayItem, index) => (
              <DayPlanItem
                key={dayItem.day}
                day={dayItem.day}
                content={dayItem.content}
                isActive={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No action plan available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
