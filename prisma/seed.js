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

  const products = [];
  for (let i = 1; i <= 30; i++) {
    products.push({
      name: `Product ${i}`,
      description: `Description for product ${i}`,
      price: 100 + i * 10,
      imageUrl: `/uploads/product${i}.jpg`,
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
