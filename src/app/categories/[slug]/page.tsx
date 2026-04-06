import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getItemsByCategory, getAllOrganisations } from "@/actions/items";
import { getScanPeriods } from "@/actions/dashboard";
import { QuickFilters } from "@/components/dashboard/quick-filters";
import { ItemCard } from "@/components/items/item-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RegulatoryItemWithRelations } from "@/types";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ impact?: string; org?: string; sort?: string; page?: string; period?: string }>;
}) {
  const { slug } = await params;
  const filters = await searchParams;

  const [result, organisations, periods] = await Promise.all([
    getItemsByCategory(slug, {
      impactLevel: filters.impact,
      organisationId: filters.org,
      sort: filters.sort,
      periodId: filters.period,
      page: filters.page ? parseInt(filters.page) : 1,
    }),
    getAllOrganisations(),
    getScanPeriods(),
  ]);

  if (!result.category) notFound();

  const { items, total, category, subCategories } = result;
  const currentPage = filters.page ? parseInt(filters.page) : 1;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          <ArrowLeft className="inline h-3 w-3" /> Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold">{category.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{total} items in this category</p>
      </div>

      {/* Sub-category tabs */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/categories/${slug}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              !filters.impact ? "border-nem-accent bg-nem-accent/10 text-nem-accent" : "border-nem-border text-muted-foreground hover:text-white"
            )}
          >
            All
          </Link>
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/categories/${sub.slug}`}
              className="rounded-full border border-nem-border px-3 py-1 text-xs text-muted-foreground hover:border-nem-accent/30 hover:text-white transition-colors"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <QuickFilters organisations={organisations} categories={[]} />

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort:</span>
          {[
            { label: "Newest", value: "" },
            { label: "Impact", value: "impact" },
            { label: "A–Z", value: "alpha" },
          ].map((s) => (
            <Link
              key={s.value}
              href={`/categories/${slug}?${new URLSearchParams({ ...filters, sort: s.value }).toString()}`}
              className={cn(
                "text-xs transition-colors",
                (filters.sort ?? "") === s.value ? "text-nem-accent" : "text-muted-foreground hover:text-white"
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {(items as RegulatoryItemWithRelations[]).map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-nem-border bg-nem-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No items found in this category with the current filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/categories/${slug}?${new URLSearchParams({ ...filters, page: String(page) }).toString()}`}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors",
                page === currentPage
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
