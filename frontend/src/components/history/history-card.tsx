"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Eye, Loader2, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteAnalysis } from "@/lib/api/hooks";
import type { HistoryItem } from "@/lib/api/types";

interface HistoryCardProps {
  item: HistoryItem;
  onDeleted?: () => void;
}

export function HistoryCard({ item, onDeleted }: HistoryCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteAnalysis = useDeleteAnalysis();

  const handleDelete = async () => {
    try {
      await deleteAnalysis.mutateAsync(item.id);
      onDeleted?.();
    } catch (error) {
      console.error("Failed to delete analysis:", error);
    }
  };

  const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = new Date(item.created_at).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt="Analysis preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link href={`/history/${item.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
        </div>

        {/* Menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/history/${item.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${item.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Open in Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-foreground mb-3">
              Are you sure you want to delete this analysis?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteAnalysis.isPending}
              >
                {deleteAnalysis.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteAnalysis.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
