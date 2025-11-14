#!/usr/bin/env node

/**
 * Production Seeder Script
 *
 * This script will seed the database only if it's empty.
 * It checks for existing data before seeding to prevent duplicate entries.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkIfDatabaseIsEmpty() {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();

    return userCount === 0 && productCount === 0 && categoryCount === 0;
  } catch (error) {
    console.error("Error checking database:", error);
    return false;
  }
}

async function seedProduction() {
  console.log("🔍 Checking if database needs seeding...");

  const isEmpty = await checkIfDatabaseIsEmpty();

  if (!isEmpty) {
    console.log("✅ Database already contains data. Skipping seed.");
    console.log("💡 If you want to reseed, please clear the database first.");
    return;
  }

  console.log("📦 Database is empty. Starting seed process...");

  try {
    // Run the seed file directly using child_process
    const { execSync } = await import("child_process");
    execSync("node prisma/seed.js", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log("✅ Production seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

// Main execution
seedProduction()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
