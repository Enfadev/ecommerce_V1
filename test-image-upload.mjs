import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testImageUpload() {
  console.log('🖼️ Testing Image Upload...\n');
  
  try {
    // Test 1: Check if placeholder image exists
    console.log('1️⃣ Checking placeholder image availability');
    const placeholderPath = path.join(process.cwd(), 'public', 'placeholder-image.svg');
    const placeholderExists = fs.existsSync(placeholderPath);
    console.log('✅ Placeholder image exists:', placeholderExists);
    
    // Test 2: Check uploads directory
    console.log('\n2️⃣ Checking uploads directory');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory:', uploadsDir);
    } else {
      console.log('✅ Uploads directory exists:', uploadsDir);
    }
    
    // Test 3: List existing uploads
    console.log('\n3️⃣ Listing existing uploads');
    const uploads = fs.readdirSync(uploadsDir);
    console.log(`✅ Found ${uploads.length} uploaded files:`);
    uploads.slice(0, 5).forEach((file, index) => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${index + 1}. ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
    });
    if (uploads.length > 5) {
      console.log(`   ... and ${uploads.length - 5} more files`);
    }
    
    // Test 4: Check products with images
    console.log('\n4️⃣ Checking products with images');
    const productsWithImages = await prisma.product.findMany({
      where: {
        imageUrl: { not: null }
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
      take: 5
    });
    
    console.log(`✅ Found ${productsWithImages.length} products with images:`);
    productsWithImages.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.imageUrl}`);
    });
    
    // Test 5: Validate image URLs
    console.log('\n5️⃣ Validating image URLs');
    for (const product of productsWithImages) {
      if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
        const imagePath = path.join(process.cwd(), 'public', product.imageUrl);
        const exists = fs.existsSync(imagePath);
        console.log(`   ${exists ? '✅' : '❌'} ${product.imageUrl} - ${exists ? 'EXISTS' : 'MISSING'}`);
      }
    }
    
    console.log('\n🎉 Image upload test completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testImageUpload();
