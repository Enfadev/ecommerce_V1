import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

async function quickTest() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@demo.com' }
    });
    
    if (admin) {
      const testAdmin1234 = await compare('Admin1234', admin.password);
      const testadmin123 = await compare('admin123', admin.password);
      
      console.log('🔐 Admin password test:');
      console.log(`- Admin1234: ${testAdmin1234 ? '✅ CORRECT' : '❌ Wrong'}`);
      console.log(`- admin123: ${testadmin123 ? '✅ CORRECT' : '❌ Wrong'}`);
    }
    
    const user = await prisma.user.findUnique({
      where: { email: 'user@demo.com' }
    });
    
    if (user) {
      const testUser1234 = await compare('User1234', user.password);
      const testuser123 = await compare('user123', user.password);
      
      console.log('\n🔐 User password test:');
      console.log(`- User1234: ${testUser1234 ? '✅ CORRECT' : '❌ Wrong'}`);
      console.log(`- user123: ${testuser123 ? '✅ CORRECT' : '❌ Wrong'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();
