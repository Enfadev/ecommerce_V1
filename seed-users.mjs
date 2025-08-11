import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log('🌱 Seeding users...');

    // Check if users already exist
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log(`✅ Database already has ${existingUsers} users. Skipping seed.`);
      return;
    }

    // Create admin user
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    // Create regular user  
    const userPassword = await hash('user123', 12);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'user@example.com', 
        password: userPassword,
        role: 'USER',
      },
    });

    console.log('✅ Users created successfully:');
    console.log(`- Admin: ${admin.email} / admin123`);
    console.log(`- User: ${user.email} / user123`);

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
