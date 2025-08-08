import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  
  const adminEmail = 'admin@demo.com';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      password: await hash('Admin1234', 10),
      role: 'ADMIN',
    },
  });

  
  const userEmail = 'user@demo.com';
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      name: 'User',
      email: userEmail,
      password: await hash('User1234', 10),
      role: 'USER',
    },
  });


  // Seed categories
  const categoryNames = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'];
  const categories = [];
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  // Seed products with all fields
  const products = [];
  for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];
    products.push({
      name: `Product ${i}`,
      description: `Description for product ${i}`,
      price: 100 + i * 10,
      imageUrl: `/uploads/product${i}.jpg`,
      brand: `Brand ${((i % 5) + 1)}`,
      categoryId: category.id,
      discountPrice: i % 2 === 0 ? (80 + i * 8) : null,
      metaDescription: `Meta description for product ${i}`,
      metaTitle: `Meta title for product ${i}`,
      promoExpired: i % 3 === 0 ? new Date(Date.now() + 86400000 * i) : null,
      sku: `SKU${1000 + i}`,
      slug: `product-${i}`,
      stock: 10 + i,
      status: 'active',
    });
  }

  for (const data of products) {
    await prisma.product.create({ data });
  }

  console.log('Seeding completed:', { admin, user, productsCount: products.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
