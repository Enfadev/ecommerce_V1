const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLogo() {
  try {
    const settings = await prisma.systemSettings.upsert({
      where: { id: 1 },
      update: { logoUrl: '/logo.svg' },
      create: {
        storeName: 'Brandify',
        storeDescription: 'A trusted online shopping platform',
        contactEmail: 'contact@brandify.com',
        currency: 'USD',
        timezone: 'Asia/Jakarta', 
        language: 'en',
        logoUrl: '/logo.svg',
        enableTwoFactor: false,
        sessionTimeout: 24,
        version: '1.0.0'
      }
    });
    console.log('Logo updated successfully:', settings);
  } catch (error) {
    console.error('Error updating logo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLogo();
