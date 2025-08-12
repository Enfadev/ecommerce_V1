const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedOrders() {
  try {
    console.log('Starting order seed...');

    // First, let's ensure we have users and products
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedpassword', // In real app, this should be properly hashed
          role: 'USER',
        },
      });
    }

    let product = await prisma.product.findFirst();
    if (!product) {
      product = await prisma.product.create({
        data: {
          name: 'Sample Product',
          description: 'A sample product for testing',
          price: 100.00,
          discountPrice: 90.00,
          category: 'Electronics',
          brand: 'SampleBrand',
          stock: 50,
          imageUrl: '/placeholder-image.svg',
          specifications: {},
          tags: [],
          rating: 4.5,
          reviewCount: 10,
          isActive: true,
        },
      });
    }

    // Create sample orders
    const sampleOrders = [
      {
        orderNumber: 'ORD-001',
        userId: user.id,
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        customerPhone: '08123456789',
        shippingAddress: '123 Main St, New York, NY 10001',
        postalCode: '10001',
        paymentMethod: 'Bank Transfer',
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        subtotal: 185.00,
        shippingFee: 15.00,
        tax: 0.00,
        discount: 0.00,
        totalAmount: 200.00,
        trackingNumber: 'TRK001',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18'),
      },
      {
        orderNumber: 'ORD-002',
        userId: user.id,
        customerName: 'Sarah Lee',
        customerEmail: 'sarah.lee@email.com',
        customerPhone: '08234567890',
        shippingAddress: '456 Market Ave, Los Angeles, CA 90210',
        postalCode: '90210',
        paymentMethod: 'Credit Card',
        status: 'SHIPPED',
        paymentStatus: 'PAID',
        subtotal: 120.00,
        shippingFee: 10.00,
        tax: 0.00,
        discount: 0.00,
        totalAmount: 130.00,
        trackingNumber: 'TRK002',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-22'),
      },
      {
        orderNumber: 'ORD-003',
        userId: user.id,
        customerName: 'Michael Brown',
        customerEmail: 'michael.brown@email.com',
        customerPhone: '08345678901',
        shippingAddress: '789 Broadway, Chicago, IL 60601',
        postalCode: '60601',
        paymentMethod: 'Bank Transfer',
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        subtotal: 180.00,
        shippingFee: 20.00,
        tax: 0.00,
        discount: 0.00,
        totalAmount: 200.00,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
      },
      {
        orderNumber: 'ORD-004',
        userId: user.id,
        customerName: 'Emily Davis',
        customerEmail: 'emily.davis@email.com',
        customerPhone: '08456789012',
        shippingAddress: '321 Oak Lane, Houston, TX 77001',
        postalCode: '77001',
        paymentMethod: 'Bank Transfer',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal: 170.00,
        shippingFee: 15.00,
        tax: 0.00,
        discount: 0.00,
        totalAmount: 185.00,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
      },
      {
        orderNumber: 'ORD-005',
        userId: user.id,
        customerName: 'David Wilson',
        customerEmail: 'david.wilson@email.com',
        customerPhone: '08567890123',
        shippingAddress: '654 Pine St, Seattle, WA 98101',
        postalCode: '98101',
        paymentMethod: 'Credit Card',
        status: 'CANCELLED',
        paymentStatus: 'FAILED',
        subtotal: 100.00,
        shippingFee: 10.00,
        tax: 0.00,
        discount: 0.00,
        totalAmount: 110.00,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-21'),
      },
    ];

    // Create orders with order items
    for (const orderData of sampleOrders) {
      const order = await prisma.order.create({
        data: orderData,
      });

      // Create different products for order items to avoid unique constraint
      const products = await prisma.product.findMany({ take: 3 });
      
      if (products.length === 0) {
        // Create additional products if needed
        const additionalProducts = await Promise.all([
          prisma.product.create({
            data: {
              name: 'iPhone 14 Pro',
              description: 'Latest iPhone model',
              price: 1500.00,
              discountPrice: 1400.00,
              category: 'Electronics',
              brand: 'Apple',
              stock: 20,
              imageUrl: '/placeholder-image.svg',
              specifications: {},
              tags: [],
              rating: 4.8,
              reviewCount: 50,
              isActive: true,
            },
          }),
          prisma.product.create({
            data: {
              name: 'Samsung Galaxy S23',
              description: 'Android flagship phone',
              price: 1200.00,
              discountPrice: 1100.00,
              category: 'Electronics',
              brand: 'Samsung',
              stock: 30,
              imageUrl: '/placeholder-image.svg',
              specifications: {},
              tags: [],
              rating: 4.6,
              reviewCount: 35,
              isActive: true,
            },
          }),
          prisma.product.create({
            data: {
              name: 'MacBook Air M2',
              description: 'Apple laptop with M2 chip',
              price: 1800.00,
              discountPrice: 1700.00,
              category: 'Electronics',
              brand: 'Apple',
              stock: 15,
              imageUrl: '/placeholder-image.svg',
              specifications: {},
              tags: [],
              rating: 4.9,
              reviewCount: 25,
              isActive: true,
            },
          }),
        ]);
        products.push(...additionalProducts);
      }

      // Create 1-2 order items for each order using different products
      const numberOfItems = Math.floor(Math.random() * 2) + 1; // 1-2 items per order
      const usedProductIds = new Set();
      
      for (let i = 0; i < numberOfItems && i < products.length; i++) {
        let productToUse = products[i];
        
        // Make sure we don't use the same product twice in one order
        while (usedProductIds.has(productToUse.id) && i < products.length - 1) {
          i++;
          productToUse = products[i];
        }
        
        if (!usedProductIds.has(productToUse.id)) {
          usedProductIds.add(productToUse.id);
          
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: productToUse.id,
              productName: productToUse.name,
              productPrice: productToUse.price,
              productImage: productToUse.imageUrl,
              quantity: Math.floor(Math.random() * 2) + 1, // 1-2 quantity
            },
          });
        }
      }
    }

    console.log('Order seed completed successfully!');
    console.log(`Created ${sampleOrders.length} orders with order items`);

  } catch (error) {
    console.error('Error seeding orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedOrders();
