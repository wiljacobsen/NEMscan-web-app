import { Suspense } from "react";
import { getDashboardStats, getWhatsNewFeed, getCategoryBreakdown, getScanPeriods, getLatestPeriodId } from "@/actions/dashboard";
import { getAllOrganisations, getAllCategories } from "@/actions/items";
import { HeroStats } from "@/components/dashboard/hero-stats";
import { QuickFilters } from "@/components/dashboard/quick-filters";
import { WhatsNewFeed } from "@/components/dashboard/whats-new-feed";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { PeriodSelector } from "@/components/layout/period-selector";
import type { RegulatoryItemWithRelations, ScanPeriodWithCount } from "@/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; impact?: string; org?: string; cat?: string }>;
}) {
  const params = await searchParams;
  const periodId = params.period || (await getLatestPeriodId()) || undefined;

  const [stats, items, categories, periods, organisations, allCategories] = await Promise.all([
    getDashboardStats(periodId),
    getWhatsNewFeed(periodId, {
      impactLevel: params.impact,
      organisationId: params.org,
      categorySlug: params.cat,
    }),
    getCategoryBreakdown(periodId),
    getScanPeriods(),
    getAllOrganisations(),
    getAllCategories(),
  ]);

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Executive Summary</h1>
          <p className="mt-1 text-sm text-muted-foreground">Regulatory intelligence for the Australian NEM</p>
        </div>
        <PeriodSelector periods={periods as ScanPeriodWithCount[]} currentPeriodId={periodId} />
      </div>

      {/* Hero stats */}
      <HeroStats data={stats} />

      {/* Filters + Feed + Categories */}
      <Suspense fallback={<div className="skeleton h-8 w-full rounded-lg" />}>
        <QuickFilters organisations={organisations} categories={allCategories} />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-muted-foreground">
              What&apos;s New ({(items as RegulatoryItemWithRelations[]).length} items)
            </h2>
          </div>
          <WhatsNewFeed items={items as RegulatoryItemWithRelations[]} />
        </div>

        <aside className="hidden lg:block">
          <CategoryBreakdown categories={categories} />
        </aside>
      </div>
    </div>
  );
}
