import { ProductCard } from "@/components/product/ProductCard";
import { DiscountedProducts } from "@/components/product/DiscountedProducts";
import { prisma } from "../../lib/prisma";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import NextLink from "next/link";
import { ArrowRight, Truck, Shield, Headphones, Gift } from "lucide-react";

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  buttonText: string;
  buttonLink: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

async function getHomePageData() {
  try {
    const homePage = await prisma.homePage.findFirst();
    return homePage;
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return null;
  }
}

async function getPopularCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        products: {
          _count: "desc",
        },
      },
      take: 4,
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Home() {
  let dbProducts = [];
  let homePageData = null;
  let categories: Array<{ id: number; name: string; _count: { products: number } }> = [];

  try {
    dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    homePageData = await getHomePageData();
    categories = await getPopularCategories();
  } catch (error) {
    console.error("Database connection error, using mock data:", error);
    dbProducts = [
      {
        id: 1,
        name: "Sample Product 1",
        description: "This is a sample product for testing",
        price: 99.99,
        imageUrl: "/placeholder-image.svg",
        brand: "Test Brand",
        category: "Electronics",
        categoryId: 1,
        discountPrice: 79.99,
        metaDescription: "Sample product description",
        metaTitle: "Sample Product",
        promoExpired: null,
        sku: "SAMPLE001",
        slug: "sample-product-1",
        stock: 10,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Sample Product 2",
        description: "Another sample product for testing",
        price: 149.99,
        imageUrl: "/placeholder-image.svg",
        brand: "Test Brand",
        category: "Fashion",
        categoryId: 2,
        discountPrice: null,
        metaDescription: "Another sample product description",
        metaTitle: "Sample Product 2",
        promoExpired: null,
        sku: "SAMPLE002",
        slug: "sample-product-2",
        stock: 5,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    homePageData = {
      heroTitle: "Welcome to Our Store",
      heroSubtitle: "Testing JWT Implementation",
      heroDescription: "This is a test environment for JWT authentication",
      heroSlides: [],
      features: [],
      statsData: [],
      aboutPreview: {},
      testimonialsData: [],
    };
  }

  const products = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.imageUrl || "/placeholder-image.svg",
    category: "General",
    stock: 50,
  }));

  const defaultData = {
    heroTitle: "Welcome to Our Store",
    heroSubtitle: "Quality Products",
    heroDescription: "Discover amazing products at great prices",
    heroSlides: [
      {
        title: "Flash Sale",
        subtitle: "Up to 70% Off",
        description: "Get the best products at the best prices. Limited time offer!",
        image: "/hero1.jpg",
        buttonText: "Shop Now",
        buttonLink: "/products",
      },
    ],
    features: [
      { icon: "Truck", title: "Free Shipping", description: "Free shipping on orders over $50" },
      { icon: "Shield", title: "Secure Payment", description: "100% secure payment processing" },
      { icon: "Headphones", title: "24/7 Support", description: "Dedicated customer support" },
      { icon: "Gift", title: "Special Offers", description: "Regular discounts and promotions" },
    ],
    statsData: [
      { label: "Happy Customers", value: "10,000+", icon: "Users" },
      { label: "Products", value: "5,000+", icon: "Package" },
      { label: "Countries", value: "25+", icon: "Globe" },
      { label: "Years", value: "5+", icon: "Calendar" },
    ],
  };

  const pageData = homePageData || defaultData;

  const heroSlides = Array.isArray(pageData.heroSlides) ? pageData.heroSlides : defaultData.heroSlides;

  const features = Array.isArray(pageData.features) ? pageData.features : defaultData.features;

  return (
    <div className="space-y-12">
      {/* Hero Carousel */}
      <section className="relative overflow-hidden rounded-2xl">
        <Carousel className="w-full">
          <CarouselContent>
            {(heroSlides as HeroSlide[]).map((slide: HeroSlide, index: number) => (
              <CarouselItem key={index}>
                <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                  </div>

                  {/* Content Container */}
                  <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-center min-h-[400px]">
                      {/* Center Content */}
                      <div className="text-center space-y-6 max-w-4xl">
                        <div className="space-y-2">
                          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">{slide.subtitle}</Badge>
                          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">{slide.title}</h1>
                        </div>

                        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">{slide.description}</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg" asChild>
                            <NextLink href={slide.buttonLink}>
                              {slide.buttonText}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </NextLink>
                          </Button>
                          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-full transition-all duration-300" asChild>
                            <NextLink href="/about">Learn More</NextLink>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300" />
          <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300" />

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {(heroSlides as HeroSlide[]).map((_, index) => (
              <button key={index} className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300" aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        </Carousel>
      </section>
      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(features as Feature[]).map((feature: Feature, index: number) => {
          const IconComponent = feature.icon === "Truck" ? Truck : feature.icon === "Shield" ? Shield : feature.icon === "Headphones" ? Headphones : feature.icon === "Gift" ? Gift : Truck;

          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold">{feature.title}</h2>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </section>{" "}
      {/* Popular Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Popular Categories</h2>
          <Button variant="outline" asChild>
            <NextLink href="/product">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </NextLink>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((category, index) => {
              const getCategoryEmoji = (categoryName: string) => {
                const name = categoryName.toLowerCase();
                if (name.includes("fashion") || name.includes("clothes") || name.includes("apparel")) return "👕";
                if (name.includes("electronics") || name.includes("tech") || name.includes("gadget")) return "📱";
                if (name.includes("home") || name.includes("living") || name.includes("furniture")) return "🏠";
                if (name.includes("book") || name.includes("literature")) return "📚";
                if (name.includes("game") || name.includes("hobby") || name.includes("toy")) return "🎮";
                if (name.includes("health") || name.includes("beauty") || name.includes("cosmetic")) return "💄";
                if (name.includes("sport") || name.includes("fitness")) return "⚽";
                if (name.includes("food") || name.includes("kitchen")) return "🍔";
                return "📦";
              };

              const getCategoryColor = (index: number) => {
                const colors = ["bg-blue-500/20 text-blue-400", "bg-green-500/20 text-green-400", "bg-yellow-500/20 text-yellow-400", "bg-pink-500/20 text-pink-400"];
                return colors[index % colors.length];
              };

              return (
                <NextLink key={category.id} href={`/product?category=${encodeURIComponent(category.name)}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 ${getCategoryColor(index)} rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>{getCategoryEmoji(category.name)}</div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category._count.products} product{category._count.products !== 1 ? "s" : ""}
                      </p>
                    </CardContent>
                  </Card>
                </NextLink>
              );
            })
          ) : (
            <>
              <NextLink href="/product?category=Fashion">
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">👕</div>
                    <h3 className="font-semibold">Fashion</h3>
                    <p className="text-sm text-muted-foreground mt-1">0 products</p>
                  </CardContent>
                </Card>
              </NextLink>
              <NextLink href="/product?category=Electronics">
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📱</div>
                    <h3 className="font-semibold">Electronics</h3>
                    <p className="text-sm text-muted-foreground mt-1">0 products</p>
                  </CardContent>
                </Card>
              </NextLink>
              <NextLink href="/product?category=Home">
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🏠</div>
                    <h3 className="font-semibold">Home & Living</h3>
                    <p className="text-sm text-muted-foreground mt-1">0 products</p>
                  </CardContent>
                </Card>
              </NextLink>
              <NextLink href="/product?category=Games">
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-pink-500/20 text-pink-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🎮</div>
                    <h3 className="font-semibold">Hobbies & Games</h3>
                    <p className="text-sm text-muted-foreground mt-1">0 products</p>
                  </CardContent>
                </Card>
              </NextLink>
            </>
          )}
        </div>
      </section>{" "}
      {/* Special Offers with Real Discounted Products */}
      <DiscountedProducts maxItems={6} title="🔥 This Week's Special Offers" />
      
      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <NextLink href="/product">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </NextLink>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
