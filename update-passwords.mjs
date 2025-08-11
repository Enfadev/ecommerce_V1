import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function updatePasswords() {
  try {
    console.log('🔐 Updating user passwords...');

    // Update admin password
    const adminPassword = await hash('admin123', 12);
    await prisma.user.update({
      where: { email: 'admin@demo.com' },
      data: { password: adminPassword }
    });

    // Update user password  
    const userPassword = await hash('user123', 12);
    await prisma.user.update({
      where: { email: 'user@demo.com' },
      data: { password: userPassword }
    });

    console.log('✅ Passwords updated successfully:');
    console.log('- admin@demo.com / admin123');
    console.log('- user@demo.com / user123');

  } catch (error) {
    console.error('❌ Error updating passwords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePasswords();
