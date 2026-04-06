"use server";

import { prisma } from "@/lib/prisma";
import type { SearchFilters } from "@/types";

export async function searchItems(filters: SearchFilters) {
  const where: Record<string, unknown> = { status: "published" };

  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query, mode: "insensitive" } },
      { description: { contains: filters.query, mode: "insensitive" } },
      { recommendedActions: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  if (filters.impactLevel) where.impactLevel = filters.impactLevel;
  if (filters.organisationId) where.organisationId = filters.organisationId;
  if (filters.periodId) where.scanPeriodId = filters.periodId;

  if (filters.categorySlug) {
    const cat = await prisma.category.findUnique({
      where: { slug: filters.categorySlug },
      include: { children: true },
    });
    if (cat) {
      where.categoryId = { in: [cat.id, ...cat.children.map((c) => c.id)] };
    }
  }

  if (filters.tagSlug) {
    where.tags = { some: { tag: { slug: filters.tagSlug } } };
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  const [items, total] = await Promise.all([
    prisma.regulatoryItem.findMany({
      where,
      include: {
        organisation: true,
        category: { include: { parent: true } },
        tags: { include: { tag: true } },
        timeline: { orderBy: { milestoneDate: "asc" } },
      },
      orderBy: [{ impactLevel: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.regulatoryItem.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAllTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });
}
