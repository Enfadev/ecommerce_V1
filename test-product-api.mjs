import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function testProductAPI() {
  console.log('🧪 Testing Product API...\n');
  
  try {
    // Test 1: Create a new product
    console.log('1️⃣ Testing POST /api/product (Create Product)');
    const newProductData = {
      name: 'Test Product API',
      description: 'Test product description',
      price: 99.99,
      category: 'Test Category',
      stock: 10,
      status: 'active',
      sku: 'TEST-API-001',
      brand: 'Test Brand',
      slug: 'test-product-api',
      metaTitle: 'Test Product Meta Title',
      metaDescription: 'Test product meta description',
      discountPrice: 79.99,
      promoExpired: '2025-12-31',
      imageUrl: '/placeholder-image.svg'
    };
    
    const createResponse = await fetch(`${BASE_URL}/api/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProductData),
    });
    
    if (createResponse.ok) {
      const createdProduct = await createResponse.json();
      console.log('✅ Product created successfully:', createdProduct.name);
      console.log('   ID:', createdProduct.id);
      
      // Test 2: Update the product
      console.log('\n2️⃣ Testing PUT /api/product (Update Product)');
      const updateData = {
        ...newProductData,
        id: createdProduct.id,
        name: 'Updated Test Product API',
        price: 129.99,
        stock: 15,
      };
      
      const updateResponse = await fetch(`${BASE_URL}/api/product`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (updateResponse.ok) {
        const updatedProduct = await updateResponse.json();
        console.log('✅ Product updated successfully:', updatedProduct.name);
        console.log('   New Price:', updatedProduct.price);
        
        // Test 3: Get the product
        console.log('\n3️⃣ Testing GET /api/product (Get Product)');
        const getResponse = await fetch(`${BASE_URL}/api/product?id=${createdProduct.id}`);
        
        if (getResponse.ok) {
          const product = await getResponse.json();
          console.log('✅ Product retrieved successfully:', product.name);
          console.log('   Category:', product.category);
          console.log('   Stock:', product.stock);
        } else {
          console.log('❌ Failed to get product:', getResponse.status);
        }
        
        // Test 4: Delete the product (cleanup)
        console.log('\n4️⃣ Testing DELETE /api/product (Delete Product)');
        const deleteResponse = await fetch(`${BASE_URL}/api/product`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: createdProduct.id }),
        });
        
        if (deleteResponse.ok) {
          console.log('✅ Product deleted successfully');
        } else {
          console.log('❌ Failed to delete product:', deleteResponse.status);
        }
        
      } else {
        const updateError = await updateResponse.text();
        console.log('❌ Failed to update product:', updateResponse.status);
        console.log('   Error:', updateError);
      }
      
    } else {
      const createError = await createResponse.text();
      console.log('❌ Failed to create product:', createResponse.status);
      console.log('   Error:', createError);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testProductAPI();
