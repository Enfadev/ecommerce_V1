import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testConnection() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test simple query
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}`);
    
    // Test some basic queries
    const productCount = await prisma.product.count();
    console.log(`📦 Total products in database: ${productCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.message.includes('sha256_password')) {
      console.log('\n💡 Solution suggestions:');
      console.log('1. Check if MySQL in Laragon is using mysql_native_password');
      console.log('2. Try connecting to MySQL and run: ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'\';');
      console.log('3. Restart MySQL service in Laragon');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
