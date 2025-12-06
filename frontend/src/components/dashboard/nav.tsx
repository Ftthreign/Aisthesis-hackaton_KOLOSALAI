"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Upload, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Home",
    icon: <Home className="h-4 w-4" />,
  },
  {
    href: "/dashboard/upload",
    label: "Upload",
    icon: <Upload className="h-4 w-4" />,
  },
  {
    href: "/history",
    label: "History",
    icon: <History className="h-4 w-4" />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = isActiveLink(item.href);
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
          >
            <Link href={item.href}>
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex md:hidden items-center gap-1">
      {navItems.map((item) => {
        const isActive = isActiveLink(item.href);
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
          >
            <Link href={item.href} className={cn(isActive && "text-primary")}>
              {item.icon}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
