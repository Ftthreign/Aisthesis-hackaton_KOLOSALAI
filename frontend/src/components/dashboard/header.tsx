import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { DashboardNav, DashboardMobileNav } from "./nav";

export function DashboardHeader() {
  return (
    <header className="border-b border-border shrink-0">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-foreground"
          >
            Aisthesis
          </Link>
          <DashboardNav />
        </div>
        <div className="flex items-center gap-2">
          <DashboardMobileNav />
          <ModeToggle />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
