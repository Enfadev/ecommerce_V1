const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function seedAnalyticsData() {
  console.log('🌱 Seeding analytics data...');

  try {
    // Create test users
    const users = [];
    for (let i = 0; i < 50; i++) {
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: '$2a$10$example.hash.here', // placeholder hash
          role: 'USER',
          createdAt: faker.date.between({ 
            from: new Date('2024-01-01'), 
            to: new Date() 
          })
        }
      });
      users.push(user);
    }

    // Get existing products
    const products = await prisma.product.findMany();
    
    if (products.length === 0) {
      console.log('No products found. Please run product seeder first.');
      return;
    }

    // Create orders with various statuses and dates
    const orderStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    
    for (let i = 0; i < 100; i++) {
      const user = faker.helpers.arrayElement(users);
      const orderDate = faker.date.between({ 
        from: new Date('2024-01-01'), 
        to: new Date() 
      });
      
      // Select random products for this order
      const orderProducts = faker.helpers.arrayElements(products, { min: 1, max: 4 });
      
      let subtotal = 0;
      const orderItems = orderProducts.map(product => {
        const quantity = faker.number.int({ min: 1, max: 3 });
        const price = product.discountPrice || product.price;
        subtotal += price * quantity;
        
        return {
          productId: product.id,
          productName: product.name,
          productPrice: price,
          productImage: product.imageUrl,
          quantity: quantity
        };
      });

      const shippingFee = faker.number.float({ min: 5, max: 25, fractionDigits: 2 });
      const tax = subtotal * 0.1; // 10% tax
      const totalAmount = subtotal + shippingFee + tax;

      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${i}`,
          userId: user.id,
          status: faker.helpers.arrayElement(orderStatuses),
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: faker.phone.number(),
          shippingAddress: faker.location.streetAddress(),
          postalCode: faker.location.zipCode(),
          notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
          paymentMethod: faker.helpers.arrayElement(['Bank Transfer', 'Credit Card', 'E-Wallet']),
          paymentStatus: faker.helpers.arrayElement(['PENDING', 'PAID', 'FAILED']),
          subtotal: subtotal,
          shippingFee: shippingFee,
          tax: tax,
          totalAmount: totalAmount,
          createdAt: orderDate,
          updatedAt: orderDate
        }
      });

      // Create order items
      for (const item of orderItems) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            ...item
          }
        });
      }
    }

    console.log('✅ Analytics data seeded successfully!');
    console.log(`📊 Created ${users.length} users and 100 orders`);

  } catch (error) {
    console.error('❌ Error seeding analytics data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedAnalyticsData();
}

module.exports = { seedAnalyticsData };
