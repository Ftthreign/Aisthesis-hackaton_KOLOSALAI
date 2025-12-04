import Link from "next/link";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "Your dashboard is empty",
  description = "Start by uploading your first food image to get AI-powered analysis and recommendations.",
  actionLabel = "Upload Your First Image",
  actionHref = "/dashboard/upload",
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-16">
        <div className="text-center">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {description}
          </p>
          <Button asChild size="lg">
            <Link href={actionHref}>
              <Upload className="h-5 w-5 mr-2" />
              {actionLabel}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
