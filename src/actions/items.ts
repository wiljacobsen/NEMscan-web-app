"use server";

import { prisma } from "@/lib/prisma";
import type { RegulatoryItemWithRelations } from "@/types";

const includeRelations = {
  organisation: true,
  category: { include: { parent: true } },
  tags: { include: { tag: true } },
  timeline: { orderBy: { milestoneDate: "asc" as const } },
};

export async function getItemBySlug(slug: string): Promise<RegulatoryItemWithRelations | null> {
  return prisma.regulatoryItem.findUnique({
    where: { slug },
    include: includeRelations,
  }) as Promise<RegulatoryItemWithRelations | null>;
}

export async function getRelatedItems(itemId: string, categoryId: string, organisationId: string, limit = 4) {
  return prisma.regulatoryItem.findMany({
    where: {
      status: "published",
      id: { not: itemId },
      OR: [{ categoryId }, { organisationId }],
    },
    include: {
      organisation: true,
      category: { include: { parent: true } },
      tags: { include: { tag: true } },
      timeline: { orderBy: { milestoneDate: "asc" } },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getItemsByCategory(
  categorySlug: string,
  filters?: { impactLevel?: string; organisationId?: string; periodId?: string; sort?: string; page?: number }
) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: { children: true },
  });

  if (!category) return { items: [], total: 0, category: null, subCategories: [] };

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const where: Record<string, unknown> = {
    categoryId: { in: categoryIds },
    status: "published",
  };
  if (filters?.impactLevel) where.impactLevel = filters.impactLevel;
  if (filters?.organisationId) where.organisationId = filters.organisationId;
  if (filters?.periodId) where.scanPeriodId = filters.periodId;

  const orderBy =
    filters?.sort === "impact"
      ? { impactLevel: "asc" as const }
      : filters?.sort === "alpha"
        ? { title: "asc" as const }
        : { createdAt: "desc" as const };

  const page = filters?.page ?? 1;
  const limit = 20;

  const [items, total] = await Promise.all([
    prisma.regulatoryItem.findMany({
      where,
      include: includeRelations,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.regulatoryItem.count({ where }),
  ]);

  return {
    items,
    total,
    category,
    subCategories: category.children,
  };
}

export async function getAllOrganisations() {
  return prisma.organisation.findMany({ orderBy: { abbreviation: "asc" } });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    where: { parentCategoryId: null },
    include: { children: true },
    orderBy: { sortOrder: "asc" },
  });
}
