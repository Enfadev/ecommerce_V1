import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🧹 Clearing all existing data...');
  
  try {
    // Clear in correct order due to foreign key constraints
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.productReview.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chatRoom.deleteMany();
    await prisma.securityLog.deleteMany();
    await prisma.systemSettings.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    
    // Page content
    await prisma.homePage.deleteMany();
    await prisma.aboutPage.deleteMany();
    await prisma.productPage.deleteMany();
    await prisma.contactPage.deleteMany();
    
    // Users last (due to foreign key constraints)
    await prisma.user.deleteMany();
    
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function main() {
  try {
    await clearDatabase();
  } catch (error) {
    console.error('Database clearing failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { clearDatabase };
