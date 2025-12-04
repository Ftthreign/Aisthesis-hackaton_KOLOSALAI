"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HomeIcon, UploadIcon } from "./icons";
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
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    href: "/dashboard/upload",
    label: "Upload",
    icon: <UploadIcon className="h-4 w-4" />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
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

  return (
    <div className="flex md:hidden items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
          >
            <Link href={item.href}>
              <span className={cn("h-5 w-5", isActive && "text-primary")}>
                {item.icon}
              </span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
