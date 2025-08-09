import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  
  const adminEmail = 'admin@demo.com';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      password: await hash('Admin1234', 10),
      role: 'ADMIN',
    },
  });

  
  const userEmail = 'user@demo.com';
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      name: 'User',
      email: userEmail,
      password: await hash('User1234', 10),
      role: 'USER',
    },
  });


  // Seed categories
  const categoryNames = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'];
  const categories = [];
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  // Seed products with all fields
  const products = [];
  for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];
    products.push({
      name: `Product ${i}`,
      description: `Description for product ${i}`,
      price: 100 + i * 10,
      imageUrl: `/uploads/product${i}.jpg`,
      brand: `Brand ${((i % 5) + 1)}`,
      categoryId: category.id,
      discountPrice: i % 2 === 0 ? (80 + i * 8) : null,
      metaDescription: `Meta description for product ${i}`,
      metaTitle: `Meta title for product ${i}`,
      promoExpired: i % 3 === 0 ? new Date(Date.now() + 86400000 * i) : null,
      sku: `SKU${1000 + i}`,
      slug: `product-${i}`,
      stock: 10 + i,
      status: 'active',
    });
  }

  for (const data of products) {
    await prisma.product.create({ data });
  }

  // Seed ContactPage
  await prisma.contactPage.upsert({
    where: { id: 1 },
    update: {},
    create: {
      heroTitle: "We Are Ready to Help You",
      heroSubtitle: "Contact Us",
      heroDescription: "Have a question or need assistance? Our customer service team is ready to help you with the best service and quick response.",
      contactMethods: [
        {
          icon: "Phone",
          title: "Phone",
          subtitle: "Monday - Friday, 08:00 - 17:00",
          value: "+62 21 1234 5678",
          link: "tel:+622112345678",
          bgColor: "bg-blue-500",
        },
        {
          icon: "MessageSquare",
          title: "WhatsApp",
          subtitle: "24/7 Fast Response",
          value: "+62 812 3456 7890",
          link: "https://wa.me/6281234567890",
          bgColor: "bg-green-500",
        },
        {
          icon: "Mail",
          title: "Email",
          subtitle: "Response within 24 hours",
          value: "support@shopzone.com",
          link: "mailto:support@shopzone.com",
          bgColor: "bg-purple-500",
        },
        {
          icon: "Headphones",
          title: "Live Chat",
          subtitle: "Monday - Saturday, 08:00 - 22:00",
          value: "Live Chat",
          link: "#",
          bgColor: "bg-orange-500",
        },
      ],
      officeLocations: [
        {
          city: "Jakarta",
          address: "Jl. Sudirman No. 123, Jakarta Pusat",
          phone: "+62 21 1234 5678",
          isMain: true,
        },
        {
          city: "Surabaya",
          address: "Jl. Ahmad Yani No. 456, Surabaya",
          phone: "+62 31 8765 4321",
          isMain: false,
        },
        {
          city: "Bandung",
          address: "Jl. Asia Afrika No. 789, Bandung",
          phone: "+62 22 9876 5432",
          isMain: false,
        },
      ],
      businessHours: [
        { day: "Monday - Friday", hours: "08:00 - 17:00", closed: false },
        { day: "Saturday", hours: "09:00 - 15:00", closed: false },
        { day: "Sunday", hours: "", closed: true },
      ],
      socialMedia: [
        { icon: "Facebook", name: "Facebook", link: "#", color: "text-blue-600" },
        { icon: "Instagram", name: "Instagram", link: "#", color: "text-pink-600" },
        { icon: "Twitter", name: "Twitter", link: "#", color: "text-blue-400" },
        { icon: "Youtube", name: "YouTube", link: "#", color: "text-red-600" },
      ],
    },
  });

  console.log('Seeding completed:', { admin, user, productsCount: products.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
