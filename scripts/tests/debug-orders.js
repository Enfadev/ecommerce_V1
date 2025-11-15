const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  console.log('=== User Data ===');
  const user = await prisma.user.findUnique({
    where: { email: 'user@demo.com' }
  });
  console.log('User:', user);
  
  if (user) {
    console.log('\n=== Orders for user@demo.com ===');
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, id: true }
            }
          }
        }
      }
    });
    
    console.log('Total orders:', orders.length);
    orders.forEach(order => {
      console.log(`Order ${order.orderNumber}: Status=${order.status}, Items=${order.items.length}`);
      order.items.forEach(item => {
        console.log(`  - Product ${item.product.id}: ${item.product.name} (qty: ${item.quantity})`);
      });
    });
    
    console.log('\n=== Orders containing Product 30 ===');
    const ordersWithProduct30 = await prisma.order.findMany({
      where: {
        userId: user.id,
        items: {
          some: {
            productId: 30
          }
        }
      },
      include: {
        items: {
          where: {
            productId: 30
          },
          include: {
            product: true
          }
        }
      }
    });
    
    console.log('Orders with Product 30:', ordersWithProduct30.length);
    ordersWithProduct30.forEach(order => {
      console.log(`Order ${order.orderNumber}: Status=${order.status}`);
    });
    
    console.log('\n=== Delivered Orders with Product 30 ===');
    const deliveredOrdersWithProduct30 = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: 'DELIVERED',
        items: {
          some: {
            productId: 30
          }
        }
      },
      include: {
        items: {
          where: {
            productId: 30
          },
          include: {
            product: true
          }
        }
      }
    });
    
    console.log('Delivered orders with Product 30:', deliveredOrdersWithProduct30.length);
    deliveredOrdersWithProduct30.forEach(order => {
      console.log(`Order ${order.orderNumber}: Status=${order.status}, Created: ${order.createdAt}`);
    });
  }
  
  await prisma.$disconnect();
}

checkData().catch(console.error);
