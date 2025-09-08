import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedReviews() {
  console.log('Seeding product reviews...');

  try {
    // Get only regular users (not admins) and products
    const users = await prisma.user.findMany({ 
      where: {
        role: 'USER' // Only get regular users, not admins
      },
      take: 5 
    });
    const products = await prisma.product.findMany({ take: 3 });
    
    if (users.length === 0 || products.length === 0) {
      console.log('No regular users or products found. Please seed users and products first.');
      return;
    }

    console.log(`Found ${users.length} regular users and ${products.length} products for review seeding`);

    // Create some delivered orders first if they don't exist
    for (const user of users.slice(0, 3)) {
      for (const product of products) {
        const existingOrder = await prisma.order.findFirst({
          where: {
            userId: user.id,
            status: 'DELIVERED',
            items: {
              some: {
                productId: product.id
              }
            }
          }
        });

        if (!existingOrder) {
          const order = await prisma.order.create({
            data: {
              orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              userId: user.id,
              status: 'DELIVERED',
              customerName: user.name || 'Customer',
              customerEmail: user.email,
              customerPhone: '081234567890',
              shippingAddress: 'Sample Address 123',
              subtotal: product.price,
              totalAmount: product.price,
              items: {
                create: {
                  productId: product.id,
                  productName: product.name,
                  productPrice: product.price,
                  productImage: product.imageUrl,
                  quantity: 1
                }
              }
            }
          });

          console.log(`Created delivered order ${order.orderNumber} for user ${user.email}`);
        }
      }
    }

    // Now create some sample reviews
    const sampleReviews = [
      {
        rating: 5,
        comment: "Excellent product! Highly recommended. The quality is outstanding and delivery was fast.",
        isAnonymous: false
      },
      {
        rating: 4,
        comment: "Good product overall. Some minor issues but customer service was helpful.",
        isAnonymous: false
      },
      {
        rating: 5,
        comment: "Perfect! Exactly what I was looking for. Will definitely buy again.",
        isAnonymous: true
      },
      {
        rating: 3,
        comment: "Average product. It works as described but nothing special.",
        isAnonymous: false
      },
      {
        rating: 4,
        comment: "Pretty good value for money. Fast shipping and good packaging.",
        isAnonymous: true
      }
    ];

    let reviewCount = 0;
    for (const product of products) {
      const orders = await prisma.order.findMany({
        where: {
          status: 'DELIVERED',
          items: {
            some: {
              productId: product.id
            }
          }
        },
        include: {
          user: true
        }
      });

      for (let i = 0; i < Math.min(orders.length, sampleReviews.length); i++) {
        const order = orders[i];
        const reviewData = sampleReviews[i];

        const existingReview = await prisma.productReview.findFirst({
          where: {
            userId: order.userId,
            productId: product.id,
            orderId: order.id
          }
        });

        if (!existingReview) {
          await prisma.productReview.create({
            data: {
              productId: product.id,
              userId: order.userId,
              orderId: order.id,
              rating: reviewData.rating,
              comment: reviewData.comment,
              isAnonymous: reviewData.isAnonymous,
              isVerified: true
            }
          });

          reviewCount++;
          console.log(`Created review for product ${product.name} by ${order.user.email}`);
        }
      }
    }

    console.log(`Successfully seeded ${reviewCount} product reviews!`);
  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedReviews();
