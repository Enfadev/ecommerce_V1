/**
 * Debug Script untuk Test Password & Database Connection
 * Jalankan dengan: node debug-auth.mjs
 */

import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function debugAuth() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Get users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });
    
    console.log(`\n👥 Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Password hash starts with: ${user.password.substring(0, 10)}...`);
    });
    
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n🔐 Testing password for ${testUser.email}:`);
      
      // Test common passwords
      const testPasswords = ['admin123', 'user123', 'password', '123456', 'admin'];
      
      for (const pwd of testPasswords) {
        const isValid = await compare(pwd, testUser.password);
        console.log(`- Password "${pwd}": ${isValid ? '✅ MATCH' : '❌ No match'}`);
      }
      
      // Test creating new password hash
      console.log('\n🔨 Creating new password hash for "admin123":');
      const newHash = await hash('admin123', 12);
      console.log(`New hash: ${newHash}`);
      
      // Test if new hash works
      const newHashValid = await compare('admin123', newHash);
      console.log(`New hash test: ${newHashValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuth();
