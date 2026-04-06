"use server";

import { prisma } from "@/lib/prisma";
import type { DashboardStats, CategoryBreakdown } from "@/types";

export async function getLatestPeriodId(): Promise<string | null> {
  const period = await prisma.scanPeriod.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { endDate: "desc" },
  });
  return period?.id ?? null;
}

export async function getScanPeriods() {
  return prisma.scanPeriod.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { endDate: "desc" },
    include: { _count: { select: { items: true } } },
  });
}

export async function getDashboardStats(periodId?: string): Promise<DashboardStats> {
  const where = periodId ? { scanPeriodId: periodId, status: "published" } : { status: "published" };

  const [total, high, medium, low, orgs, consultations] = await Promise.all([
    prisma.regulatoryItem.count({ where }),
    prisma.regulatoryItem.count({ where: { ...where, impactLevel: "HIGH" } }),
    prisma.regulatoryItem.count({ where: { ...where, impactLevel: "MEDIUM" } }),
    prisma.regulatoryItem.count({ where: { ...where, impactLevel: "LOW" } }),
    prisma.regulatoryItem.findMany({
      where,
      select: { organisationId: true },
      distinct: ["organisationId"],
    }),
    prisma.consultationTimeline.count({
      where: {
        isDeadline: true,
        milestoneDate: { gte: new Date() },
        regulatoryItem: periodId ? { scanPeriodId: periodId } : undefined,
      },
    }),
  ]);

  return {
    totalItems: total,
    highImpact: high,
    mediumImpact: medium,
    lowImpact: low,
    activeOrgs: orgs.length,
    openConsultations: consultations,
  };
}

export async function getWhatsNewFeed(
  periodId?: string,
  filters?: { impactLevel?: string; organisationId?: string; categorySlug?: string }
) {
  const where: Record<string, unknown> = { status: "published" };
  if (periodId) where.scanPeriodId = periodId;
  if (filters?.impactLevel) where.impactLevel = filters.impactLevel;
  if (filters?.organisationId) where.organisationId = filters.organisationId;
  if (filters?.categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: filters.categorySlug } });
    if (cat) where.categoryId = cat.id;
  }

  return prisma.regulatoryItem.findMany({
    where,
    include: {
      organisation: true,
      category: { include: { parent: true } },
      tags: { include: { tag: true } },
      timeline: { orderBy: { milestoneDate: "asc" } },
    },
    orderBy: [{ impactLevel: "asc" }, { createdAt: "desc" }],
  });
}

export async function getCategoryBreakdown(periodId?: string): Promise<CategoryBreakdown[]> {
  const parentCategories = await prisma.category.findMany({
    where: { parentCategoryId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      children: true,
      items: {
        where: periodId ? { scanPeriodId: periodId, status: "published" } : { status: "published" },
        select: { impactLevel: true },
      },
    },
  });

  return parentCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    itemCount: cat.items.length,
    highCount: cat.items.filter((i) => i.impactLevel === "HIGH").length,
  }));
}
