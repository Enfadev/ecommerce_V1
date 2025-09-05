import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('Checking categories in database...');
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });
    
    console.log('Categories found:', categories.length);
    console.log('Categories data:', JSON.stringify(categories, null, 2));
    
    if (categories.length === 0) {
      console.log('No categories found. Creating default categories...');
      
      const defaultCategories = [
        'Electronics', 'Clothing', 'Home & Garden', 'Books', 
        'Sports', 'Beauty', 'Toys', 'Food & Beverages', 'Automotive', 'Health'
      ];
      
      for (const name of defaultCategories) {
        await prisma.category.create({
          data: { name }
        });
      }
      
      console.log('Default categories created successfully!');
      
      // Check again
      const newCategories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              products: true
            }
          }
        }
      });
      
      console.log('New categories:', JSON.stringify(newCategories, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
