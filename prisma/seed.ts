import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Buat user admin
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

  // Buat user biasa
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

  console.log('Seeder selesai:', { admin, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
