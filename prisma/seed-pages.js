const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPageData() {
  console.log('Seeding page data...');

  // Home Page Data
  const homePageData = {
    heroTitle: "Welcome to Our Store",
    heroSubtitle: "Best Quality Products at Great Prices",
    heroDescription: "Discover amazing products with the best deals and fast shipping across Indonesia",
    heroSlides: [
      {
        title: "Up to 70% Off",
        subtitle: "FLASH SALE",
        description: "Get the best products at the best prices. Limited time offer!",
        buttonText: "Shop Now",
        buttonLink: "/products",
        badgeText: "🔥 FLASH SALE",
        badgeIcon: "🔥",
        bgGradient: "from-blue-600 via-purple-600 to-blue-800",
        rightIcon: "Gift"
      },
      {
        title: "Free Shipping Across Indonesia",
        subtitle: "FREE SHIPPING",
        description: "Minimum purchase of Rp 250,000. Applies to all products.",
        buttonText: "View Terms & Conditions",
        buttonLink: "/shipping-info",
        badgeText: "📦 FREE SHIPPING",
        badgeIcon: "📦",
        bgGradient: "from-emerald-600 via-teal-600 to-emerald-800",
        rightIcon: "Truck"
      },
      {
        title: "20% Cashback for New Members",
        subtitle: "NEW MEMBER",
        description: "Register now and enjoy cashback on your first purchase.",
        buttonText: "Register Now",
        buttonLink: "/register",
        badgeText: "⭐ NEW MEMBER",
        badgeIcon: "⭐",
        bgGradient: "from-pink-600 via-rose-600 to-pink-800",
        rightIcon: "Star"
      }
    ],
    features: [
      {
        icon: "Truck",
        title: "Free Shipping",
        description: "Free shipping for orders above Rp 250,000",
        bgColor: "bg-blue-100"
      },
      {
        icon: "Shield",
        title: "Secure Payment",
        description: "100% secure payment system",
        bgColor: "bg-green-100"
      },
      {
        icon: "Headphones",
        title: "24/7 Support",
        description: "Customer service available 24/7",
        bgColor: "bg-purple-100"
      }
    ],
    statsData: [
      {
        label: "Happy Customers",
        value: "50K+",
        icon: "Users"
      },
      {
        label: "Products Available",
        value: "10K+",
        icon: "Package"
      },
      {
        label: "Cities Reached",
        value: "100+",
        icon: "MapPin"
      },
      {
        label: "Satisfaction Rate",
        value: "4.8/5",
        icon: "Star"
      }
    ],
    aboutPreview: {
      title: "About Our Company",
      description: "We are committed to providing the best shopping experience"
    },
    testimonialsData: [
      {
        name: "Sarah Johnson",
        role: "Verified Buyer",
        content: "Great service and fast delivery. Highly recommended!",
        rating: 5,
        avatar: "/testimonial1.jpg"
      },
      {
        name: "Mike Chen",
        role: "Regular Customer",
        content: "Quality products at affordable prices. Love shopping here!",
        rating: 5,
        avatar: "/testimonial2.jpg"
      }
    ]
  };

  // About Page Data
  const aboutPageData = {
    heroTitle: "About ShopZone",
    heroSubtitle: "Your Trusted E-Commerce Partner",
    heroDescription: "Learn more about our journey, mission, and the dedicated team behind ShopZone",
    companyStory: "ShopZone was founded in 2020 with a simple mission: to make quality products accessible to everyone across Indonesia. What started as a small online store has grown into one of the most trusted e-commerce platforms in the country.",
    mission: "To provide the best shopping experience by offering quality products, competitive prices, and excellent customer service to customers throughout Indonesia.",
    vision: "To become the leading e-commerce platform in Southeast Asia, connecting millions of customers with their favorite brands and products.",
    values: [
      {
        icon: "Heart",
        title: "Customer First",
        description: "We always prioritize customer satisfaction in every decision we make"
      },
      {
        icon: "Shield",
        title: "Trust & Security",
        description: "We guarantee the security of every transaction and customer data"
      },
      {
        icon: "Target",
        title: "Innovation",
        description: "We continuously innovate to provide the best shopping experience"
      },
      {
        icon: "Users",
        title: "Teamwork",
        description: "We work together as a solid team to achieve common goals"
      }
    ],
    statistics: [
      {
        label: "Happy Customers",
        value: "50K+",
        icon: "Users"
      },
      {
        label: "Quality Products",
        value: "10K+",
        icon: "Award"
      },
      {
        label: "Satisfaction Rating",
        value: "4.8",
        icon: "Star"
      },
      {
        label: "Cities Reached",
        value: "100+",
        icon: "MapPin"
      }
    ],
    features: [
      {
        icon: "Shield",
        title: "Secure Shopping",
        description: "Multi-layered security system and customer data protection"
      },
      {
        icon: "Truck",
        title: "Fast Delivery",
        description: "Free shipping across Indonesia with express delivery"
      },
      {
        icon: "Clock",
        title: "24/7 Support",
        description: "Customer service ready to help you anytime"
      },
      {
        icon: "Heart",
        title: "Quality Products",
        description: "Only selling original products with official warranty"
      }
    ],
    teamMembers: [
      {
        name: "Ahmad Rizki",
        role: "CEO & Founder",
        image: "/team1.jpg",
        description: "Visioner behind ShopZone with 10+ years experience in e-commerce"
      },
      {
        name: "Sari Indah",
        role: "Head of Operations",
        image: "/team2.jpg",
        description: "Ensures every operation runs smoothly and efficiently"
      },
      {
        name: "Budi Santoso",
        role: "Head of Technology",
        image: "/team3.jpg",
        description: "Technology expert responsible for platform innovation"
      }
    ],
    timeline: [
      {
        year: "2020",
        title: "Company Founded",
        description: "ShopZone was established with a small team of 5 people"
      },
      {
        year: "2021",
        title: "First 1,000 Customers",
        description: "Reached our first milestone of 1,000 satisfied customers"
      },
      {
        year: "2022",
        title: "Nationwide Expansion",
        description: "Expanded shipping services to all provinces in Indonesia"
      },
      {
        year: "2023",
        title: "50,000 Products",
        description: "Reached 50,000 products from 1,000+ trusted brands"
      },
      {
        year: "2024",
        title: "Mobile App Launch",
        description: "Launched mobile app for better shopping experience"
      }
    ]
  };

  // Event Page Data
  const eventPageData = {
    heroTitle: "Events & Promotions",
    heroSubtitle: "Exciting Events and Special Offers",
    heroDescription: "Join our exciting events and get special promotions throughout the year",
    activeEvents: [
      {
        id: 1,
        title: "Mega Ramadan Sale",
        description: "Up to 70% off on all product categories. Limited time promo until the end of the month!",
        period: "April 1 - 30, 2025",
        status: "Active",
        type: "Sale",
        icon: "Crown",
        prize: "Up to 70% Off",
        participants: "15.2K",
        bgGradient: "from-yellow-500 to-orange-500"
      },
      {
        id: 2,
        title: "Creative Photo Contest",
        description: "Upload your most creative product photo and win exciting prizes! Show your creativity!",
        period: "July 20 - 27, 2025",
        status: "Ongoing",
        type: "Contest",
        icon: "Camera",
        prize: "$30 Voucher",
        participants: "892",
        bgGradient: "from-purple-500 to-pink-500"
      }
    ],
    upcomingEvents: [
      {
        id: 3,
        title: "Flash Quiz with Prizes",
        description: "Quick quiz every Sunday with instant prizes, no drawing!",
        period: "Every Sunday",
        status: "Coming Soon",
        type: "Quiz",
        icon: "Zap",
        prize: "Various Prizes",
        participants: "0",
        bgGradient: "from-blue-500 to-cyan-500"
      }
    ],
    pastEvents: [
      {
        id: 4,
        title: "Independence Day Sale",
        description: "Special discount for Indonesian Independence Day celebration",
        period: "August 17, 2024",
        status: "Ended",
        type: "Sale",
        icon: "Flag",
        prize: "50% Off",
        participants: "25K",
        bgGradient: "from-red-500 to-red-600"
      }
    ],
    eventCategories: [
      {
        name: "Flash Sales",
        icon: "Zap",
        color: "yellow",
        description: "Limited time offers with huge discounts"
      },
      {
        name: "Contests",
        icon: "Trophy",
        color: "purple",
        description: "Creative contests with exciting prizes"
      },
      {
        name: "Seasonal Events",
        icon: "Calendar",
        color: "green",
        description: "Special events for holidays and seasons"
      }
    ]
  };

  // Product Page Data
  const productPageData = {
    heroTitle: "Our Products",
    heroSubtitle: "Quality Products at Best Prices",
    heroDescription: "Discover thousands of quality products from trusted brands with competitive prices",
    featuredCategories: [
      {
        name: "Electronics",
        description: "Latest gadgets and electronics",
        image: "/category-electronics.jpg",
        link: "/products/electronics",
        bgColor: "bg-blue-100"
      },
      {
        name: "Fashion",
        description: "Trendy clothing and accessories",
        image: "/category-fashion.jpg",
        link: "/products/fashion",
        bgColor: "bg-pink-100"
      },
      {
        name: "Home & Garden",
        description: "Everything for your home",
        image: "/category-home.jpg",
        link: "/products/home-garden",
        bgColor: "bg-green-100"
      }
    ],
    promotionalBanner: {
      title: "Special Offer",
      description: "Get up to 50% off on selected items",
      buttonText: "Shop Now",
      buttonLink: "/products/sale",
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      isActive: true
    },
    filterOptions: [
      {
        type: "category",
        label: "Category",
        options: ["Electronics", "Fashion", "Home & Garden", "Sports", "Books"]
      },
      {
        type: "price",
        label: "Price Range",
        options: ["Under Rp 100,000", "Rp 100,000 - 500,000", "Rp 500,000 - 1,000,000", "Above Rp 1,000,000"]
      },
      {
        type: "brand",
        label: "Brand",
        options: ["Samsung", "Apple", "Nike", "Adidas", "Uniqlo"]
      }
    ],
    sortOptions: [
      {
        value: "newest",
        label: "Newest"
      },
      {
        value: "price_low",
        label: "Price: Low to High"
      },
      {
        value: "price_high",
        label: "Price: High to Low"
      },
      {
        value: "popular",
        label: "Most Popular"
      },
      {
        value: "rating",
        label: "Highest Rated"
      }
    ],
    seoContent: [
      {
        title: "Why Shop With Us",
        content: "We offer the best selection of products with guaranteed quality and competitive prices. Our customer service team is always ready to help you find the perfect product.",
        type: "text"
      },
      {
        title: "Quality Guarantee",
        content: "All products come with manufacturer warranty and our quality guarantee. Shop with confidence knowing that your purchase is protected.",
        type: "text"
      }
    ]
  };

  try {
    // Create or update home page
    const existingHomePage = await prisma.homePage.findFirst();
    if (existingHomePage) {
      await prisma.homePage.update({
        where: { id: existingHomePage.id },
        data: homePageData
      });
      console.log('✅ Home page data updated');
    } else {
      await prisma.homePage.create({
        data: homePageData
      });
      console.log('✅ Home page data created');
    }

    // Create or update about page
    const existingAboutPage = await prisma.aboutPage.findFirst();
    if (existingAboutPage) {
      await prisma.aboutPage.update({
        where: { id: existingAboutPage.id },
        data: aboutPageData
      });
      console.log('✅ About page data updated');
    } else {
      await prisma.aboutPage.create({
        data: aboutPageData
      });
      console.log('✅ About page data created');
    }

    // Create or update event page
    const existingEventPage = await prisma.eventPage.findFirst();
    if (existingEventPage) {
      await prisma.eventPage.update({
        where: { id: existingEventPage.id },
        data: eventPageData
      });
      console.log('✅ Event page data updated');
    } else {
      await prisma.eventPage.create({
        data: eventPageData
      });
      console.log('✅ Event page data created');
    }

    // Create or update product page
    const existingProductPage = await prisma.productPage.findFirst();
    if (existingProductPage) {
      await prisma.productPage.update({
        where: { id: existingProductPage.id },
        data: productPageData
      });
      console.log('✅ Product page data updated');
    } else {
      await prisma.productPage.create({
        data: productPageData
      });
      console.log('✅ Product page data created');
    }

    console.log('🎉 Page data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding page data:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedPageData();
  } catch (error) {
    console.error('Error in main seeding process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedPageData };
