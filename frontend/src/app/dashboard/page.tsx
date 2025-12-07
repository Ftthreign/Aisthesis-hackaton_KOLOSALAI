import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user?.name || session.user?.email}!
          </p>
        </div>

        {/* Empty State */}
        <EmptyState />
      </div>
    </div>
  );
}
