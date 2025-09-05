const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedDiscountProducts() {
  try {
    console.log("🛍️  Seeding discount products...");

    // First, let's make sure we have some categories
    const fashionCategory = await prisma.category.upsert({
      where: { name: "Fashion" },
      update: {},
      create: { name: "Fashion" },
    });

    const electronicsCategory = await prisma.category.upsert({
      where: { name: "Electronics" },
      update: {},
      create: { name: "Electronics" },
    });

    const homeCategory = await prisma.category.upsert({
      where: { name: "Home & Living" },
      update: {},
      create: { name: "Home & Living" },
    });

    // Get tomorrow's date for promo expiration
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    // Get next week for longer promos
    const nextWeekDate = new Date();
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);

    const discountProducts = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality noise-canceling wireless headphones with 30-hour battery life",
        price: 199.99,
        discountPrice: 149.99, // 25% off
        imageUrl: "/placeholder-product.svg",
        stock: 50,
        categoryId: electronicsCategory.id,
        brand: "SoundMax",
        sku: "WH-1000XM5",
        promoExpired: nextWeekDate,
      },
      {
        name: "Smart Watch Series X",
        description: "Advanced fitness tracking smartwatch with heart rate monitor and GPS",
        price: 299.99,
        discountPrice: 199.99, // 33% off
        imageUrl: "/placeholder-product.svg",
        stock: 30,
        categoryId: electronicsCategory.id,
        brand: "TechWear",
        sku: "SW-SERIESX",
        promoExpired: nextWeekDate,
      },
      {
        name: "Designer Cotton T-Shirt",
        description: "Premium 100% organic cotton t-shirt with modern fit",
        price: 59.99,
        discountPrice: 39.99, // 33% off
        imageUrl: "/placeholder-product.svg",
        stock: 100,
        categoryId: fashionCategory.id,
        brand: "EcoFashion",
        sku: "ECO-TSHIRT-001",
        promoExpired: tomorrowDate,
      },
      {
        name: "Bluetooth Gaming Controller",
        description: "Professional wireless gaming controller compatible with PC, mobile, and console",
        price: 79.99,
        discountPrice: 59.99, // 25% off
        imageUrl: "/placeholder-product.svg",
        stock: 75,
        categoryId: electronicsCategory.id,
        brand: "GamePro",
        sku: "GP-CONTROLLER-2024",
        promoExpired: nextWeekDate,
      },
      {
        name: "Cozy Throw Blanket",
        description: "Ultra-soft microfiber throw blanket perfect for living room or bedroom",
        price: 49.99,
        discountPrice: 29.99, // 40% off
        imageUrl: "/placeholder-product.svg",
        stock: 60,
        categoryId: homeCategory.id,
        brand: "ComfortHome",
        sku: "CH-BLANKET-COZY",
        promoExpired: nextWeekDate,
      },
      {
        name: "LED Desk Lamp",
        description: "Adjustable LED desk lamp with USB charging port and touch controls",
        price: 89.99,
        discountPrice: 69.99, // 22% off
        imageUrl: "/placeholder-product.svg",
        stock: 40,
        categoryId: homeCategory.id,
        brand: "BrightDesk",
        sku: "BD-LAMP-LED-001",
        promoExpired: nextWeekDate,
      },
      {
        name: "Vintage Denim Jacket",
        description: "Classic denim jacket with vintage wash and comfortable fit",
        price: 129.99,
        discountPrice: 99.99, // 23% off
        imageUrl: "/placeholder-product.svg",
        stock: 25,
        categoryId: fashionCategory.id,
        brand: "VintageWear",
        sku: "VW-DENIM-CLASSIC",
        promoExpired: nextWeekDate,
      },
      {
        name: "Portable Phone Charger",
        description: "20000mAh power bank with fast charging and dual USB ports",
        price: 39.99,
        discountPrice: 24.99, // 38% off  
        imageUrl: "/placeholder-product.svg",
        stock: 80,
        categoryId: electronicsCategory.id,
        brand: "PowerMax",
        sku: "PM-POWERBANK-20K",
        promoExpired: tomorrowDate,
      },
    ];

    for (const product of discountProducts) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: product,
        create: product,
      });
    }

    console.log(`✅ Successfully seeded ${discountProducts.length} discount products!`);
  } catch (error) {
    console.error("❌ Error seeding discount products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDiscountProducts();
