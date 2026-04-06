import Link from "next/link";
import { searchItems, getAllTags } from "@/actions/search";
import { getAllOrganisations, getAllCategories } from "@/actions/items";
import { getScanPeriods } from "@/actions/dashboard";
import { ItemCard } from "@/components/items/item-card";
import { SearchInput } from "@/components/search/search-input";
import { Badge } from "@/components/ui/badge";
import type { RegulatoryItemWithRelations, ScanPeriodWithCount } from "@/types";
import { cn } from "@/lib/utils";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    impact?: string;
    org?: string;
    cat?: string;
    tag?: string;
    period?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const [result, organisations, categories, periods, tags] = await Promise.all([
    searchItems({
      query: params.q,
      impactLevel: params.impact,
      organisationId: params.org,
      categorySlug: params.cat,
      tagSlug: params.tag,
      periodId: params.period,
      page: params.page ? parseInt(params.page) : 1,
    }),
    getAllOrganisations(),
    getAllCategories(),
    getScanPeriods(),
    getAllTags(),
  ]);

  const activeTags = tags.filter((t) => t._count.items > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Search & Discovery</h1>
        <p className="mt-1 text-sm text-muted-foreground">Search across all regulatory items and periods</p>
      </div>

      {/* Search input */}
      <SearchInput defaultValue={params.q} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Impact */}
        <div className="flex items-center gap-1.5">
          {["", "HIGH", "MEDIUM", "LOW"].map((level) => (
            <Link
              key={level}
              href={`/search?${new URLSearchParams({ ...params, impact: level, page: "" }).toString()}`}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                (params.impact ?? "") === level
                  ? level === "HIGH"
                    ? "border-nem-high/30 bg-nem-high/10 text-nem-high"
                    : level === "MEDIUM"
                      ? "border-nem-medium/30 bg-nem-medium/10 text-nem-medium"
                      : level === "LOW"
                        ? "border-nem-low/30 bg-nem-low/10 text-nem-low"
                        : "border-nem-accent bg-nem-accent/10 text-nem-accent"
                  : "border-nem-border text-muted-foreground hover:text-white"
              )}
            >
              {level || "All"}
            </Link>
          ))}
        </div>

        {/* Org filter */}
        <select
          defaultValue={params.org ?? ""}
          className="h-7 rounded-md border border-nem-border bg-nem-card px-2 text-xs text-foreground"
        >
          <option value="">All Orgs</option>
          {organisations.map((org) => (
            <option key={org.id} value={org.id}>{org.abbreviation}</option>
          ))}
        </select>

        {/* Category filter */}
        <select
          defaultValue={params.cat ?? ""}
          className="h-7 rounded-md border border-nem-border bg-nem-card px-2 text-xs text-foreground"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Popular tags */}
      <div className="flex flex-wrap gap-1.5">
        {activeTags.slice(0, 15).map((tag) => (
          <Link
            key={tag.id}
            href={`/search?tag=${tag.slug}`}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition-colors",
              params.tag === tag.slug
                ? "border-nem-accent bg-nem-accent/10 text-nem-accent"
                : "border-nem-border text-muted-foreground hover:border-nem-accent/30 hover:text-white"
            )}
          >
            {tag.name}
            <span className="ml-1 opacity-50">{tag._count.items}</span>
          </Link>
        ))}
      </div>

      {/* Results */}
      <div>
        <p className="mb-3 text-sm text-muted-foreground">
          {result.total} result{result.total !== 1 ? "s" : ""}
          {params.q && <> for &quot;<span className="text-foreground">{params.q}</span>&quot;</>}
        </p>

        <div className="space-y-3">
          {(result.items as RegulatoryItemWithRelations[]).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {result.items.length === 0 && (
          <div className="rounded-xl border border-nem-border bg-nem-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No items match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/search?${new URLSearchParams({ ...params, page: String(page) }).toString()}`}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors",
                page === result.page
                  ? "bg-nem-accent text-nem-bg font-bold"
                  : "border border-nem-border text-muted-foreground hover:text-white"
              )}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
