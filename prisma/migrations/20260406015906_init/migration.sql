-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ScanPeriodStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ANALYST', 'VIEWER');

-- CreateEnum
CREATE TYPE "AlertChannel" AS ENUM ('EMAIL', 'IN_APP', 'BOTH');

-- CreateEnum
CREATE TYPE "AlertFrequency" AS ENUM ('IMMEDIATE', 'DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "ScrapingStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "organisations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "website_url" TEXT,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_category_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_periods" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "ScanPeriodStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_items" (
    "id" TEXT NOT NULL,
    "scan_period_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "source_url" TEXT,
    "description" TEXT NOT NULL,
    "detail_html" TEXT,
    "impact_level" "ImpactLevel" NOT NULL,
    "recommended_actions" TEXT,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "ai_confidence_score" DOUBLE PRECISION,
    "analyst_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "analyst_notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regulatory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_timelines" (
    "id" TEXT NOT NULL,
    "regulatory_item_id" TEXT NOT NULL,
    "milestone_name" TEXT NOT NULL,
    "milestone_date" TIMESTAMP(3) NOT NULL,
    "is_deadline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "consultation_timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_item_tags" (
    "regulatory_item_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "regulatory_item_tags_pkey" PRIMARY KEY ("regulatory_item_id","tag_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "company" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "notification_preferences" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filter_criteria" JSONB NOT NULL,
    "channel" "AlertChannel" NOT NULL DEFAULT 'EMAIL',
    "frequency" "AlertFrequency" NOT NULL DEFAULT 'DAILY',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraping_sources" (
    "id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "scrape_frequency" TEXT NOT NULL,
    "last_scraped_at" TIMESTAMP(3),
    "scrape_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "scraping_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraping_runs" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "status" "ScrapingStatus" NOT NULL DEFAULT 'RUNNING',
    "items_found" INTEGER NOT NULL DEFAULT 0,
    "items_new" INTEGER NOT NULL DEFAULT 0,
    "items_updated" INTEGER NOT NULL DEFAULT 0,
    "error_log" TEXT,

    CONSTRAINT "scraping_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organisations_abbreviation_key" ON "organisations"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "regulatory_items_slug_key" ON "regulatory_items"("slug");

-- CreateIndex
CREATE INDEX "consultation_timelines_regulatory_item_id_milestone_date_idx" ON "consultation_timelines"("regulatory_item_id", "milestone_date");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_periods" ADD CONSTRAINT "scan_periods_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_items" ADD CONSTRAINT "regulatory_items_scan_period_id_fkey" FOREIGN KEY ("scan_period_id") REFERENCES "scan_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_items" ADD CONSTRAINT "regulatory_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_items" ADD CONSTRAINT "regulatory_items_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_timelines" ADD CONSTRAINT "consultation_timelines_regulatory_item_id_fkey" FOREIGN KEY ("regulatory_item_id") REFERENCES "regulatory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_item_tags" ADD CONSTRAINT "regulatory_item_tags_regulatory_item_id_fkey" FOREIGN KEY ("regulatory_item_id") REFERENCES "regulatory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_item_tags" ADD CONSTRAINT "regulatory_item_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraping_sources" ADD CONSTRAINT "scraping_sources_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraping_runs" ADD CONSTRAINT "scraping_runs_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "scraping_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
