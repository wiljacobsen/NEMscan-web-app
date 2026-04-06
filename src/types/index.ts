import type { RegulatoryItem, Organisation, Category, Tag, ConsultationTimeline, ScanPeriod } from "@prisma/client";

export type RegulatoryItemWithRelations = RegulatoryItem & {
  organisation: Organisation;
  category: Category & { parent?: Category | null };
  tags: { tag: Tag }[];
  timeline: ConsultationTimeline[];
};

export type DashboardStats = {
  totalItems: number;
  highImpact: number;
  mediumImpact: number;
  lowImpact: number;
  activeOrgs: number;
  openConsultations: number;
};

export type CategoryBreakdown = {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  highCount: number;
};

export type SearchFilters = {
  query?: string;
  impactLevel?: string;
  organisationId?: string;
  categorySlug?: string;
  periodId?: string;
  tagSlug?: string;
  page?: number;
  limit?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
};

export type ScanPeriodWithCount = ScanPeriod & {
  _count: { items: number };
};
