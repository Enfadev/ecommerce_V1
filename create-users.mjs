/**
 * Manual User Creation Script
 * Untuk membuat user admin dan test user
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createUsers() {
  try {
    console.log('🔧 Creating test users...');
    
    // Create admin user
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@test.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    });
    
    // Create regular user
    const userPassword = await hash('user123', 12);
    const user = await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        name: 'Test User',
        email: 'user@test.com',
        password: userPassword,
        role: 'USER'
      }
    });
    
    console.log('✅ Users created successfully:');
    console.log(`- Admin: ${admin.email} / password: admin123`);
    console.log(`- User: ${user.email} / password: user123`);
    
    // Test password verification
    console.log('\n🧪 Testing password verification:');
    const { compare } = await import('bcryptjs');
    
    const adminTest = await compare('admin123', admin.password);
    const userTest = await compare('user123', user.password);
    
    console.log(`Admin password test: ${adminTest ? '✅ Valid' : '❌ Invalid'}`);
    console.log(`User password test: ${userTest ? '✅ Valid' : '❌ Invalid'}`);
    
  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
