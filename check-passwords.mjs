import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

async function checkCurrentPasswords() {
  try {
    console.log('🔍 Checking current passwords in database...');
    
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
    
    for (const user of users) {
      console.log(`\n📧 ${user.email} (${user.role}):`);
      console.log(`- Password hash: ${user.password.substring(0, 15)}...`);
      
      // Test berbagai kemungkinan password
      const testPasswords = [
        'Admin1234',  // dari seed.js
        'User1234',   // dari seed.js
        'admin123',   // yang saya gunakan di script
        'user123',    // yang saya gunakan di script
        'Admin123',
        'admin1234',
        'user1234'
      ];
      
      console.log('  Testing passwords:');
      for (const pwd of testPasswords) {
        const isValid = await compare(pwd, user.password);
        if (isValid) {
          console.log(`  ✅ MATCH: "${pwd}"`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentPasswords();
