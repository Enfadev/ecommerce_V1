const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkReviews() {
  console.log('=== Checking Reviews for Product 30 ===');
  
  const user = await prisma.user.findUnique({
    where: { email: 'user@demo.com' }
  });
  
  if (user) {
    // Check if ProductReview table exists and has data
    try {
      const reviews = await prisma.productReview.findMany({
        where: {
          productId: 30,
          userId: user.id
        }
      });
      
      console.log(`Existing reviews by user ${user.email} for Product 30:`, reviews.length);
      reviews.forEach(review => {
        console.log(`Review ID: ${review.id}, Order ID: ${review.orderId}, Rating: ${review.rating}`);
      });
      
    } catch (error) {
      console.log('Error accessing ProductReview table:', error.message);
    }
  }
  
  await prisma.$disconnect();
}

checkReviews().catch(console.error);
