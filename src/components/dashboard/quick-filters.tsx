"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Organisation, Category } from "@prisma/client";

const impactFilters = [
  { label: "All", value: "" },
  { label: "HIGH", value: "HIGH", color: "text-nem-high border-nem-high/30 bg-nem-high/10" },
  { label: "MEDIUM", value: "MEDIUM", color: "text-nem-medium border-nem-medium/30 bg-nem-medium/10" },
  { label: "LOW", value: "LOW", color: "text-nem-low border-nem-low/30 bg-nem-low/10" },
];

export function QuickFilters({
  organisations,
  categories,
}: {
  organisations: Organisation[];
  categories: (Category & { children: Category[] })[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentImpact = searchParams.get("impact") ?? "";
  const currentOrg = searchParams.get("org") ?? "";

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Impact filter pills */}
      <div className="flex items-center gap-1.5">
        {impactFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter("impact", f.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all",
              currentImpact === f.value
                ? f.color || "border-nem-accent bg-nem-accent/10 text-nem-accent"
                : "border-nem-border text-muted-foreground hover:border-white/20 hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Org filter */}
      <select
        value={currentOrg}
        onChange={(e) => setFilter("org", e.target.value)}
        className="h-7 rounded-md border border-nem-border bg-nem-card px-2 text-xs text-foreground focus:border-nem-accent focus:outline-none"
      >
        <option value="">All Organisations</option>
        {organisations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.abbreviation}
          </option>
        ))}
      </select>

      {/* Category filter */}
      {categories.length > 0 && (
        <select
          value={searchParams.get("cat") ?? ""}
          onChange={(e) => setFilter("cat", e.target.value)}
          className="h-7 rounded-md border border-nem-border bg-nem-card px-2 text-xs text-foreground focus:border-nem-accent focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
