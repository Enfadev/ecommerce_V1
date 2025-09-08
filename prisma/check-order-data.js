import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrderData() {
  console.log('=== CHECKING ORDER AND USER DATA ===\n');

  try {
    // Check users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    console.log('USERS:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Role: ${user.role}`);
    });

    console.log('\n=== ORDERS ===');
    // Check orders
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    orders.forEach(order => {
      console.log(`\nOrder: ${order.orderNumber}`);
      console.log(`- User: ${order.user.email} (${order.user.role})`);
      console.log(`- Status: ${order.status}`);
      console.log(`- Created: ${order.createdAt}`);
      console.log(`- Items: ${order.items.length}`);
      order.items.forEach(item => {
        console.log(`  * Product ${item.product.id}: ${item.product.name} (Qty: ${item.quantity})`);
      });
      console.log(`- Reviews: ${order.reviews.length}`);
      if (order.reviews.length > 0) {
        order.reviews.forEach(review => {
          console.log(`  * Review: ${review.rating} stars - ${review.comment.substring(0, 50)}...`);
        });
      }
    });

    console.log('\n=== DELIVERED ORDERS FOR REGULAR USERS ===');
    const deliveredOrders = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        user: {
          role: 'USER'
        }
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });

    console.log(`Found ${deliveredOrders.length} delivered orders for regular users:`);
    deliveredOrders.forEach(order => {
      console.log(`- Order ${order.orderNumber} by ${order.user.email}`);
      order.items.forEach(item => {
        console.log(`  * Product ${item.product.id}: ${item.product.name}`);
      });
    });

    console.log('\n=== PRODUCT REVIEWS ===');
    const reviews = await prisma.productReview.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        },
        product: {
          select: {
            id: true,
            name: true,
          }
        },
        order: {
          select: {
            orderNumber: true,
            status: true,
          }
        }
      }
    });

    console.log(`Found ${reviews.length} product reviews:`);
    reviews.forEach(review => {
      console.log(`- Review by ${review.user.email} (${review.user.role})`);
      console.log(`  * Product: ${review.product.name}`);
      console.log(`  * Order: ${review.order.orderNumber} (${review.order.status})`);
      console.log(`  * Rating: ${review.rating} stars`);
      console.log(`  * Anonymous: ${review.isAnonymous}`);
      console.log(`  * Comment: ${review.comment.substring(0, 50)}...`);
    });

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrderData();
