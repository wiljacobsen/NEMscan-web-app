"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ImpactLevel } from "@prisma/client";

export async function createItem(data: {
  title: string;
  description: string;
  categoryId: string;
  organisationId: string;
  impactLevel: ImpactLevel;
  sourceUrl?: string;
  recommendedActions?: string;
  detailHtml?: string;
  scanPeriodId: string;
}) {
  return prisma.regulatoryItem.create({
    data: {
      ...data,
      slug: slugify(data.title),
      status: "published",
      aiGenerated: false,
      analystReviewed: true,
    },
  });
}

export async function updateItem(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    categoryId: string;
    organisationId: string;
    impactLevel: ImpactLevel;
    sourceUrl: string;
    recommendedActions: string;
    detailHtml: string;
    status: string;
    analystReviewed: boolean;
    analystNotes: string;
  }>
) {
  return prisma.regulatoryItem.update({ where: { id }, data });
}

export async function publishPeriod(id: string) {
  return prisma.scanPeriod.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}

export async function getAdminStats() {
  const [totalItems, unreviewedCount, periods, sources] = await Promise.all([
    prisma.regulatoryItem.count(),
    prisma.regulatoryItem.count({ where: { analystReviewed: false } }),
    prisma.scanPeriod.findMany({ orderBy: { endDate: "desc" }, include: { _count: { select: { items: true } } } }),
    prisma.scrapingSource.findMany({ include: { organisation: true, _count: { select: { runs: true } } } }),
  ]);

  return { totalItems, unreviewedCount, periods, sources };
}
