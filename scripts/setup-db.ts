import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

async function main() {
  console.log("Running database migrations...");
  execSync("pnpm prisma migrate deploy", { stdio: "inherit" });

  console.log("Checking if database needs seeding...");
  const prisma = new PrismaClient();
  try {
    const count = await prisma.organisation.count();
    if (count === 0) {
      console.log("Database is empty — running seed...");
      execSync("pnpm prisma db seed", { stdio: "inherit" });
    } else {
      console.log(`Database already has data (${count} organisations). Skipping seed.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Database setup failed:", e);
  process.exit(1);
});
