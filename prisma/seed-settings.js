import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSettings() {
  console.log('🌱 Seeding system settings and security logs...');

  try {
    // Create default system settings
    const defaultSettings = await prisma.systemSettings.create({
      data: {
        storeName: 'Modern E-Commerce',
        storeDescription: 'Your trusted online shopping destination with premium products and exceptional service',
        contactEmail: 'admin@modernecommerce.com',
        currency: 'USD',
        timezone: 'Asia/Jakarta',
        language: 'en',
        phoneNumber: '+1 (555) 123-4567',
        officeAddress: '123 Business Street, Suite 100, New York, NY 10001, United States',
        enableTwoFactor: false,
        sessionTimeout: 24,
        version: '1.0.0'
      }
    });

    console.log('✅ System settings created:', defaultSettings.storeName);

    // Get admin users for security logs
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true }
    });

    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found. Creating sample security logs without user association.');
    }

    // Create sample security logs
    const securityLogs = [
      {
        action: 'LOGIN',
        description: 'Admin login successful',
        userId: adminUsers[0]?.id || null,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        action: 'SETTINGS_UPDATE',
        description: 'System settings updated',
        userId: adminUsers[0]?.id || null,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        action: 'LOGIN_FAILED',
        description: 'Failed login attempt - invalid password',
        userId: null,
        ipAddress: '203.142.75.22',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F)',
        status: 'FAILED',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        action: 'PASSWORD_RESET',
        description: 'Password reset requested',
        userId: adminUsers[1]?.id || adminUsers[0]?.id || null,
        ipAddress: '10.0.0.5',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
      },
      {
        action: 'PRODUCT_CREATE',
        description: 'New product added to catalog',
        userId: adminUsers[0]?.id || null,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        action: 'SUSPICIOUS_ACTIVITY',
        description: 'Multiple failed login attempts detected',
        userId: null,
        ipAddress: '185.220.101.44',
        userAgent: 'curl/7.68.0',
        status: 'WARNING',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000) // 18 hours ago
      },
      {
        action: 'BACKUP_CREATED',
        description: 'Database backup completed successfully',
        userId: adminUsers[0]?.id || null,
        ipAddress: '127.0.0.1',
        userAgent: 'System/Internal',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        action: 'ORDER_CANCELLED',
        description: 'Order #ORD-2024-001 cancelled by admin',
        userId: adminUsers[0]?.id || null,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000) // 30 hours ago
      },
      {
        action: 'API_ACCESS',
        description: 'Third-party API integration accessed',
        userId: adminUsers[1]?.id || adminUsers[0]?.id || null,
        ipAddress: '192.168.1.105',
        userAgent: 'PostmanRuntime/7.32.2',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000) // 36 hours ago
      },
      {
        action: 'MAINTENANCE_MODE',
        description: 'System maintenance mode activated',
        userId: adminUsers[0]?.id || null,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    // Insert security logs
    for (const log of securityLogs) {
      await prisma.securityLog.create({
        data: log
      });
    }

    console.log(`✅ Created ${securityLogs.length} security log entries`);

    // Display summary
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    console.log('\n📊 Current database statistics:');
    console.log(`👥 Total Users: ${totalUsers}`);
    console.log(`📦 Total Products: ${totalProducts}`);
    console.log(`🛍️  Total Orders: ${totalOrders}`);
    console.log(`⚙️  System Settings: 1 record`);
    console.log(`🔒 Security Logs: ${securityLogs.length} records`);

    console.log('\n🎉 Settings seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedSettings();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { seedSettings };
