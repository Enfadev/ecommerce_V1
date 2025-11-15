import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { seedSettings } from "./seeds/seed-settings.js";
import { seedOrders } from "./seeds/seed-orders.js";
import { clearDatabase } from "./clear-database.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear all existing data first
  await clearDatabase();

  // Seed Users
  console.log("Seeding users...");
  const adminEmail = "admin@demo.com";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: await hash("Admin1234", 10),
      role: "ADMIN",
    },
  });

  const userEmail = "user@demo.com";
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      name: "User",
      email: userEmail,
      password: await hash("User1234", 10),
      role: "USER",
    },
  });

  // Seed categories
  console.log("Seeding categories...");
  const categoryNames = ["Electronics", "Fashion", "Home", "Sports", "Books"];
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
  console.log("Seeding products...");
  for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];
    const productData = {
      name: `Product ${i}`,
      description: `Description for product ${i}`,
      price: 100 + i * 10,
      imageUrl: "",
      brand: `Brand ${(i % 5) + 1}`,
      categoryId: category.id,
      discountPrice: i % 2 === 0 ? 80 + i * 8 : null,
      metaDescription: `Meta description for product ${i}`,
      metaTitle: `Meta title for product ${i}`,
      promoExpired: i % 3 === 0 ? new Date(Date.now() + 86400000 * i) : null,
      sku: `SKU${1000 + i}`,
      slug: `product-${i}`,
      stock: 10 + i,
      status: "active",
    };

    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: productData,
      create: productData,
    });
  }

  // Seed HomePage
  console.log("Seeding home page...");
  await prisma.homePage.upsert({
    where: { id: 1 },
    update: {},
    create: {
      heroTitle: "Welcome to Our Amazing Store",
      heroSubtitle: "Discover Quality Products",
      heroDescription: "Find the best products at unbeatable prices with premium quality and excellent service.",
      heroSlides: [
        {
          title: "Premium Quality Products",
          subtitle: "Best Deals of the Season",
          description: "Discover our exclusive collection with up to 50% off",
          image: "/uploads/hero1.jpg",
          buttonText: "Shop Now",
          buttonLink: "/products",
        },
        {
          title: "Fast & Free Delivery",
          subtitle: "Free Shipping Nationwide",
          description: "Get your orders delivered within 24 hours at no extra cost",
          image: "/uploads/hero2.jpg",
          buttonText: "Learn More",
          buttonLink: "/about",
        },
        {
          title: "24/7 Customer Support",
          subtitle: "We're Here to Help",
          description: "Our dedicated support team is available round the clock",
          image: "/uploads/hero3.jpg",
          buttonText: "Contact Us",
          buttonLink: "/contact",
        },
      ],
      features: [
        {
          icon: "Truck",
          title: "Free Shipping",
          description: "Free shipping on orders over $50",
        },
        {
          icon: "Shield",
          title: "Secure Payment",
          description: "100% secure payment processing",
        },
        {
          icon: "HeartHandshake",
          title: "Quality Guarantee",
          description: "30-day money back guarantee",
        },
        {
          icon: "Headphones",
          title: "24/7 Support",
          description: "Dedicated customer support",
        },
      ],
      statsData: [
        { label: "Happy Customers", value: "10,000+", icon: "Users" },
        { label: "Products Sold", value: "50,000+", icon: "Package" },
        { label: "Countries Served", value: "25+", icon: "Globe" },
        { label: "Years Experience", value: "5+", icon: "Calendar" },
      ],
      aboutPreview: {
        title: "About Our Company",
        description: "We are passionate about delivering quality products and exceptional customer service. Our journey began with a simple mission: to make premium products accessible to everyone.",
        image: "/uploads/about-preview.jpg",
        buttonText: "Learn More About Us",
        buttonLink: "/about",
      },
      testimonialsData: [
        {
          name: "Sarah Johnson",
          role: "Regular Customer",
          content: "Amazing quality products and fast delivery. I've been shopping here for over a year and never disappointed!",
          avatar: "/uploads/avatar1.jpg",
          rating: 5,
        },
        {
          name: "Michael Chen",
          role: "Business Owner",
          content: "Excellent customer service and competitive prices. Highly recommended for anyone looking for quality products.",
          avatar: "/uploads/avatar2.jpg",
          rating: 5,
        },
        {
          name: "Emily Davis",
          role: "Loyal Customer",
          content: "The user experience is fantastic and the product quality exceeded my expectations. Will definitely shop again!",
          avatar: "/uploads/avatar3.jpg",
          rating: 5,
        },
      ],
    },
  });

  // Seed AboutPage
  console.log("Seeding about page...");
  await prisma.aboutPage.upsert({
    where: { id: 1 },
    update: {},
    create: {
      heroTitle: "About Our Company",
      heroSubtitle: "Your Trusted Shopping Partner",
      heroDescription: "We are committed to providing the best shopping experience with quality products, competitive prices, and exceptional customer service.",
      companyStory:
        "Founded in 2019, our company started with a simple vision: to make quality products accessible to everyone. What began as a small startup has grown into a trusted brand serving thousands of customers worldwide. We believe in the power of innovation, customer satisfaction, and continuous improvement.",
      mission: "To provide customers with the highest quality products at competitive prices while delivering exceptional customer service and building long-lasting relationships.",
      vision: "To become the leading e-commerce platform that connects people with the products they love, making shopping convenient, enjoyable, and trustworthy.",
      values: [
        {
          title: "Quality First",
          description: "We never compromise on product quality and ensure every item meets our high standards.",
        },
        {
          title: "Customer Focus",
          description: "Our customers are at the heart of everything we do. Their satisfaction is our top priority.",
        },
        {
          title: "Innovation",
          description: "We continuously innovate to improve our products, services, and customer experience.",
        },
        {
          title: "Integrity",
          description: "We conduct business with honesty, transparency, and ethical practices.",
        },
      ],
      statistics: [
        { label: "Years in Business", value: "5+", icon: "Calendar" },
        { label: "Happy Customers", value: "10,000+", icon: "Users" },
        { label: "Products Available", value: "5,000+", icon: "Package" },
        { label: "Team Members", value: "50+", icon: "UserCheck" },
      ],
      features: [
        {
          icon: "Award",
          title: "Award Winning Service",
          description: "Recognized for excellence in customer service and product quality.",
        },
        {
          icon: "Globe",
          title: "Worldwide Shipping",
          description: "We deliver to customers across the globe with reliable shipping partners.",
        },
        {
          icon: "Shield",
          title: "Secure Shopping",
          description: "Your personal and payment information is always protected.",
        },
        {
          icon: "Clock",
          title: "Fast Processing",
          description: "Orders are processed quickly and shipped within 24 hours.",
        },
      ],
      teamMembers: [
        {
          name: "John Smith",
          role: "CEO & Founder",
          bio: "Visionary leader with 10+ years experience in e-commerce and retail.",
          image: "/uploads/team1.jpg",
          social: {
            linkedin: "#",
            twitter: "#",
            email: "john@company.com",
          },
        },
        {
          name: "Jane Williams",
          role: "CTO",
          bio: "Technology expert passionate about creating seamless user experiences.",
          image: "/uploads/team2.jpg",
          social: {
            linkedin: "#",
            github: "#",
            email: "jane@company.com",
          },
        },
        {
          name: "Mike Johnson",
          role: "Head of Operations",
          bio: "Operations specialist ensuring smooth delivery and customer satisfaction.",
          image: "/uploads/team3.jpg",
          social: {
            linkedin: "#",
            email: "mike@company.com",
          },
        },
      ],
      timeline: [
        {
          year: "2019",
          title: "Company Founded",
          description: "Started as a small startup with big dreams and a customer-first approach.",
        },
        {
          year: "2020",
          title: "First 1,000 Customers",
          description: "Reached our first milestone and expanded our product catalog.",
        },
        {
          year: "2021",
          title: "International Expansion",
          description: "Extended our services to international markets and partnered with global suppliers.",
        },
        {
          year: "2022",
          title: "Mobile App Launch",
          description: "Launched our mobile application to provide better shopping experience.",
        },
        {
          year: "2023",
          title: "10,000+ Happy Customers",
          description: "Celebrated serving over 10,000 satisfied customers worldwide.",
        },
        {
          year: "2024",
          title: "Award Recognition",
          description: "Received multiple awards for customer service excellence and innovation.",
        },
      ],
    },
  });

  // Seed ProductPage
  console.log("Seeding product page...");
  await prisma.productPage.upsert({
    where: { id: 1 },
    update: {},
    create: {
      heroTitle: "Discover Our Products",
      heroSubtitle: "Quality You Can Trust",
      heroDescription: "Explore our extensive collection of premium products carefully selected to meet your needs and exceed your expectations.",
      featuredCategories: [
        {
          name: "Electronics",
          description: "Latest gadgets and tech accessories",
          image: "/uploads/category-electronics.jpg",
          productCount: 150,
          featured: true,
        },
        {
          name: "Fashion",
          description: "Trendy clothing and accessories",
          image: "/uploads/category-fashion.jpg",
          productCount: 300,
          featured: true,
        },
        {
          name: "Home & Garden",
          description: "Everything for your home and garden",
          image: "/uploads/category-home.jpg",
          productCount: 200,
          featured: true,
        },
        {
          name: "Sports & Outdoors",
          description: "Gear for active lifestyle",
          image: "/uploads/category-sports.jpg",
          productCount: 120,
          featured: false,
        },
      ],
      filterOptions: [
        {
          type: "price",
          label: "Price Range",
          options: [
            { label: "Under $25", value: "0-25" },
            { label: "$25 - $50", value: "25-50" },
            { label: "$50 - $100", value: "50-100" },
            { label: "$100 - $200", value: "100-200" },
            { label: "Over $200", value: "200+" },
          ],
        },
        {
          type: "brand",
          label: "Brand",
          options: [
            { label: "Brand 1", value: "brand-1" },
            { label: "Brand 2", value: "brand-2" },
            { label: "Brand 3", value: "brand-3" },
            { label: "Brand 4", value: "brand-4" },
            { label: "Brand 5", value: "brand-5" },
          ],
        },
        {
          type: "rating",
          label: "Customer Rating",
          options: [
            { label: "4 Stars & Up", value: "4+" },
            { label: "3 Stars & Up", value: "3+" },
            { label: "2 Stars & Up", value: "2+" },
            { label: "1 Star & Up", value: "1+" },
          ],
        },
      ],
      sortOptions: [
        { label: "Featured", value: "featured" },
        { label: "Best Selling", value: "bestselling" },
        { label: "Price: Low to High", value: "price-asc" },
        { label: "Price: High to Low", value: "price-desc" },
        { label: "Customer Rating", value: "rating" },
        { label: "Newest First", value: "newest" },
      ],
      promotionalBanner: {
        title: "Special Offer!",
        description: "Get 20% off on your first order",
        buttonText: "Shop Now",
        buttonLink: "/products?discount=20",
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
        active: true,
      },
      seoContent: {
        metaTitle: "Premium Products - Quality You Can Trust",
        metaDescription: "Discover our extensive collection of premium products with competitive prices, fast shipping, and excellent customer service.",
        keywords: ["products", "shopping", "quality", "premium", "online store"],
        canonicalUrl: "/products",
      },
    },
  });

  // Seed ContactPage
  console.log("Seeding contact page...");
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
          value: "support@brandify.com",
          link: "mailto:support@brandify.com",
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

  // Seed system settings and security logs
  console.log("Seeding system settings and security logs...");
  await seedSettings();

  // Seed sample orders
  console.log("Seeding sample orders...");
  await seedOrders();

  console.log("✅ Database seeding completed successfully!");
  console.log(`👤 Users created: Admin (${admin.email}), User (${user.email})`);
  console.log(`📦 Products created: 30`);
  console.log(`🏷️ Categories created: ${categories.length}`);
  console.log(`📄 Pages seeded: HomePage, AboutPage, ProductPage, ContactPage`);
  console.log("\n🔐 Login credentials:");
  console.log(`Admin: ${adminEmail} / Admin1234`);
  console.log(`User: ${userEmail} / User1234`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
