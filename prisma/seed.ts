import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { organisations } from "./data/organisations";
import { categories } from "./data/categories";
import { tags } from "./data/tags";
import { scanPeriod1Items } from "./data/scan-period-1";
import { scanPeriod2Items } from "./data/scan-period-2";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");
  await prisma.regulatoryItemTag.deleteMany();
  await prisma.consultationTimeline.deleteMany();
  await prisma.regulatoryItem.deleteMany();
  await prisma.scanPeriod.deleteMany();
  await prisma.scrapingRun.deleteMany();
  await prisma.scrapingSource.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.organisation.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating organisations...");
  const orgMap: Record<string, string> = {};
  for (const org of organisations) {
    const created = await prisma.organisation.create({ data: org });
    orgMap[created.abbreviation] = created.id;
  }

  console.log("Creating categories...");
  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
      },
    });
    catMap[cat.slug] = parent.id;

    for (const child of cat.children) {
      const created = await prisma.category.create({
        data: {
          name: child.name,
          slug: child.slug,
          sortOrder: child.sortOrder,
          parentCategoryId: parent.id,
        },
      });
      catMap[child.slug] = created.id;
    }
  }

  console.log("Creating tags...");
  const tagMap: Record<string, string> = {};
  for (const tag of tags) {
    const created = await prisma.tag.create({ data: tag });
    tagMap[created.slug] = created.id;
  }

  console.log("Creating admin user...");
  await prisma.user.create({
    data: {
      email: "admin@symphony.com.au",
      passwordHash: hashSync("admin123", 10),
      name: "Symphony Admin",
      company: "Symphony",
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      email: "analyst@symphony.com.au",
      passwordHash: hashSync("analyst123", 10),
      name: "Symphony Analyst",
      company: "Symphony",
      role: "ANALYST",
    },
  });

  console.log("Creating Scan Period 1 (7 Feb – 20 Feb 2026)...");
  const period1 = await prisma.scanPeriod.create({
    data: {
      startDate: new Date("2026-02-07"),
      endDate: new Date("2026-02-20"),
      status: "PUBLISHED",
      publishedAt: new Date("2026-02-21"),
    },
  });

  for (const item of scanPeriod1Items) {
    const orgId = orgMap[item.org];
    const catId = catMap[item.category];
    if (!orgId || !catId) {
      console.warn(`Skipping "${item.title}" — org: ${item.org} (${orgId}), cat: ${item.category} (${catId})`);
      continue;
    }

    const created = await prisma.regulatoryItem.create({
      data: {
        scanPeriodId: period1.id,
        categoryId: catId,
        organisationId: orgId,
        title: item.title,
        slug: item.slug,
        sourceUrl: item.sourceUrl,
        description: item.description,
        detailHtml: item.detailHtml ?? null,
        impactLevel: item.impactLevel,
        recommendedActions: item.recommendedActions,
        aiGenerated: item.aiGenerated ?? false,
        aiConfidenceScore: item.aiConfidenceScore ?? null,
        analystReviewed: item.analystReviewed ?? false,
        status: "published",
      },
    });

    // Create tags
    if (item.tags) {
      for (const tagName of item.tags) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
        const tagId = tagMap[tagSlug];
        if (tagId) {
          await prisma.regulatoryItemTag.create({
            data: { regulatoryItemId: created.id, tagId },
          });
        }
      }
    }

    // Create timeline entries
    if ("timeline" in item && item.timeline) {
      for (const entry of item.timeline) {
        await prisma.consultationTimeline.create({
          data: {
            regulatoryItemId: created.id,
            milestoneName: entry.milestoneName,
            milestoneDate: new Date(entry.milestoneDate),
            isDeadline: entry.isDeadline,
          },
        });
      }
    }
  }

  console.log("Creating Scan Period 2 (21 Feb – 6 Mar 2026)...");
  const period2 = await prisma.scanPeriod.create({
    data: {
      startDate: new Date("2026-02-21"),
      endDate: new Date("2026-03-06"),
      status: "PUBLISHED",
      publishedAt: new Date("2026-03-07"),
    },
  });

  for (const item of scanPeriod2Items) {
    const orgId = orgMap[item.org];
    const catId = catMap[item.category];
    if (!orgId || !catId) {
      console.warn(`Skipping "${item.title}" — org: ${item.org} (${orgId}), cat: ${item.category} (${catId})`);
      continue;
    }

    const created = await prisma.regulatoryItem.create({
      data: {
        scanPeriodId: period2.id,
        categoryId: catId,
        organisationId: orgId,
        title: item.title,
        slug: item.slug,
        sourceUrl: item.sourceUrl,
        description: item.description,
        detailHtml: item.detailHtml ?? null,
        impactLevel: item.impactLevel,
        recommendedActions: item.recommendedActions,
        aiGenerated: item.aiGenerated ?? false,
        aiConfidenceScore: item.aiConfidenceScore ?? null,
        analystReviewed: item.analystReviewed ?? false,
        status: "published",
      },
    });

    if (item.tags) {
      for (const tagName of item.tags) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
        const tagId = tagMap[tagSlug];
        if (tagId) {
          await prisma.regulatoryItemTag.create({
            data: { regulatoryItemId: created.id, tagId },
          });
        }
      }
    }

    if ("timeline" in item && item.timeline) {
      for (const entry of item.timeline) {
        await prisma.consultationTimeline.create({
          data: {
            regulatoryItemId: created.id,
            milestoneName: entry.milestoneName,
            milestoneDate: new Date(entry.milestoneDate),
            isDeadline: entry.isDeadline,
          },
        });
      }
    }
  }

  // Create scraping sources
  console.log("Creating scraping sources...");
  const scrapingSources = [
    { name: "AEMC Rule Changes", org: "AEMC", url: "https://www.aemc.gov.au/rule-changes", frequency: "daily" },
    { name: "AER Publications", org: "AER", url: "https://www.aer.gov.au/publications", frequency: "daily" },
    { name: "AEMO Consultations", org: "AEMO", url: "https://aemo.com.au/consultations", frequency: "daily" },
    { name: "AEMO NEM Publications", org: "AEMO", url: "https://aemo.com.au/energy-systems/electricity/national-electricity-market-nem", frequency: "daily" },
    { name: "Transgrid Projects", org: "Transgrid", url: "https://www.transgrid.com.au/projects-innovation", frequency: "weekly" },
    { name: "Powerlink Projects", org: "Powerlink", url: "https://www.powerlink.com.au/projects", frequency: "weekly" },
    { name: "ElectraNet Projects", org: "ElectraNet", url: "https://www.electranet.com.au/projects", frequency: "weekly" },
    { name: "EnergyCo NSW", org: "EnergyCo", url: "https://www.energyco.nsw.gov.au/", frequency: "weekly" },
    { name: "DCCEEW Energy", org: "DCCEEW", url: "https://www.energy.gov.au/", frequency: "weekly" },
  ];

  for (const src of scrapingSources) {
    await prisma.scrapingSource.create({
      data: {
        organisationId: orgMap[src.org],
        name: src.name,
        url: src.url,
        scrapeFrequency: src.frequency,
        isActive: true,
      },
    });
  }

  const itemCount = await prisma.regulatoryItem.count();
  console.log(`\nSeed complete! Created ${itemCount} regulatory items across 2 scan periods.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
