"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Search,
  FolderOpen,
  Shield,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Search", href: "/search", icon: Search },
  {
    label: "Categories",
    icon: FolderOpen,
    children: [
      { label: "Policy & Rule Changes", href: "/categories/policy-direction-rule-changes" },
      { label: "AEMO, NSP & Licensing", href: "/categories/aemo-nsp-licensing" },
      { label: "Network Projects", href: "/categories/network-projects" },
    ],
  },
  { label: "Admin", href: "/admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Categories"]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-nem-border bg-sidebar transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-nem-border px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-nem-accent" />
              <span className="font-heading text-lg font-bold text-white">NEMScan</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <Zap className="h-6 w-6 text-nem-accent" />
            </Link>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="text-muted-foreground hover:text-white">
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = "href" in item && pathname === item.href;
              const hasChildren = "children" in item && item.children;
              const isExpanded = expandedItems.includes(item.label);
              const childActive = hasChildren && item.children?.some((c) => pathname === c.href);

              if (hasChildren) {
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        childActive
                          ? "bg-nem-accent/10 text-nem-accent"
                          : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </>
                      )}
                    </button>
                    {!collapsed && isExpanded && (
                      <ul className="ml-7 mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "block rounded-lg px-3 py-1.5 text-xs transition-colors",
                                pathname === child.href
                                  ? "bg-nem-accent/10 text-nem-accent"
                                  : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link
                    href={(item as { href: string }).href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-nem-accent/10 text-nem-accent"
                        : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-nem-border p-3">
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="mx-auto block text-muted-foreground hover:text-white">
              <PanelLeft className="h-4 w-4" />
            </button>
          ) : (
            <div className="text-xs text-muted-foreground">
              <span className="font-heading">&copy; 2026 Symphony</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
