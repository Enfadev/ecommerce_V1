import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testProductOperations() {
  console.log('🧪 Testing Product Database Operations...\n');
  
  try {
    // Test 1: Create a category first
    console.log('1️⃣ Creating/Finding Test Category');
    const category = await prisma.category.upsert({
      where: { name: 'Test Category' },
      update: {},
      create: { name: 'Test Category' }
    });
    console.log('✅ Category ready:', category.name, '(ID:', category.id + ')');
    
    // Test 2: Create a new product
    console.log('\n2️⃣ Testing Product Creation');
    const newProduct = await prisma.product.create({
      data: {
        name: 'Test Product Database',
        description: 'Test product from database operations',
        price: 99.99,
        categoryId: category.id,
        stock: 10,
        status: 'active',
        sku: 'TEST-DB-001',
        brand: 'Test Brand',
        slug: 'test-product-database',
        metaTitle: 'Test Product Meta Title',
        metaDescription: 'Test product meta description',
        discountPrice: 79.99,
        promoExpired: new Date('2025-12-31'),
        imageUrl: '/placeholder-image.svg'
      },
      include: {
        category: true
      }
    });
    
    console.log('✅ Product created successfully:');
    console.log('   ID:', newProduct.id);
    console.log('   Name:', newProduct.name);
    console.log('   Price:', newProduct.price);
    console.log('   Category:', newProduct.category?.name);
    console.log('   Stock:', newProduct.stock);
    console.log('   SKU:', newProduct.sku);
    
    // Test 3: Update the product
    console.log('\n3️⃣ Testing Product Update');
    const updatedProduct = await prisma.product.update({
      where: { id: newProduct.id },
      data: {
        name: 'Updated Test Product Database',
        price: 129.99,
        stock: 15,
        description: 'Updated description'
      },
      include: {
        category: true
      }
    });
    
    console.log('✅ Product updated successfully:');
    console.log('   Name:', updatedProduct.name);
    console.log('   New Price:', updatedProduct.price);
    console.log('   New Stock:', updatedProduct.stock);
    
    // Test 4: Retrieve the product
    console.log('\n4️⃣ Testing Product Retrieval');
    const retrievedProduct = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        category: true
      }
    });
    
    if (retrievedProduct) {
      console.log('✅ Product retrieved successfully:');
      console.log('   ID:', retrievedProduct.id);
      console.log('   Name:', retrievedProduct.name);
      console.log('   Category:', retrievedProduct.category?.name);
      console.log('   Stock:', retrievedProduct.stock);
      console.log('   Created At:', retrievedProduct.createdAt);
      console.log('   Updated At:', retrievedProduct.updatedAt);
    }
    
    // Test 5: List all products with category
    console.log('\n5️⃣ Testing Product List');
    const allProducts = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { id: 'desc' },
      take: 5 // Limit to 5 most recent
    });
    
    console.log('✅ Product list (5 most recent):');
    allProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price} (${product.category?.name || 'No Category'})`);
    });
    
    // Test 6: Delete the test product (cleanup)
    console.log('\n6️⃣ Testing Product Deletion');
    await prisma.product.delete({
      where: { id: newProduct.id }
    });
    console.log('✅ Test product deleted successfully');
    
    console.log('\n🎉 All database operations completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testProductOperations();
