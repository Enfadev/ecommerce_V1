import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function updateProductSlugs() {
  try {
    console.log("Updating product slugs...");

    const products = await prisma.product.findMany();

    console.log(`Found ${products.length} products to check`);

    for (const product of products) {
      // If product already has a non-empty slug, skip it
      if (product.slug && product.slug.trim() !== "") {
        console.log(`Product ${product.id} already has slug: ${product.slug}`);
        continue;
      }

      let slug = slugify(product.name);
      let counter = 1;

      // Check if slug already exists
      while (true) {
        const testSlug = counter === 1 ? slug : `${slug}-${counter}`;
        const existing = await prisma.product.findFirst({
          where: {
            slug: testSlug,
            NOT: { id: product.id },
          },
        });

        if (!existing) {
          slug = testSlug;
          break;
        }
        counter++;
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { slug },
      });

      console.log(`Updated product ${product.id}: ${product.name} -> ${slug}`);
    }

    console.log("All product slugs updated successfully!");
  } catch (error) {
    console.error("Error updating product slugs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductSlugs();
