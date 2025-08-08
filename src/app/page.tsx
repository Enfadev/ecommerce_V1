import { ProductCard } from "../components/ProductCard";
import { prisma } from "../lib/prisma";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import NextLink from "next/link";
import { ArrowRight, Star, Truck, Shield, Headphones, Gift } from "lucide-react";
export default async function Home() {
  
  const dbProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  
  const products = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.imageUrl || "/placeholder-image.svg",
    category: "General",
    stock: 50,
  }));

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Carousel */}
        <section className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <Card className="border-0 overflow-hidden">
                  <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-between px-8 md:px-16">
                    <div className="text-white space-y-4 z-10">
                      <Badge className="bg-yellow-500 text-black font-semibold">🔥 FLASH SALE</Badge>
                      <h1 className="text-2xl md:text-4xl font-bold">Up to 70% Off</h1>
                      <p className="text-blue-100 max-w-md">Get the best products at the best prices. Limited time offer!</p>
                      <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="hidden md:block absolute right-8 top-1/2 transform -translate-y-1/2">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                        <Gift className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card className="border-0 overflow-hidden">
                  <div className="relative h-64 md:h-80 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 flex items-center justify-between px-8 md:px-16">
                    <div className="text-white space-y-4 z-10">
                      <Badge className="bg-emerald-400 text-emerald-900 font-semibold">📦 FREE SHIPPING</Badge>
                      <h1 className="text-2xl md:text-4xl font-bold">Free Shipping Across Indonesia</h1>
                      <p className="text-emerald-100 max-w-md">Minimum purchase of Rp 250,000. Applies to all products.</p>
                      <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                        View Terms & Conditions <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="hidden md:block absolute right-8 top-1/2 transform -translate-y-1/2">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                        <Truck className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card className="border-0 overflow-hidden">
                  <div className="relative h-64 md:h-80 bg-gradient-to-br from-pink-600 via-rose-600 to-pink-800 flex items-center justify-between px-8 md:px-16">
                    <div className="text-white space-y-4 z-10">
                      <Badge className="bg-pink-400 text-pink-900 font-semibold">⭐ NEW MEMBER</Badge>
                      <h1 className="text-2xl md:text-4xl font-bold">20% Cashback for New Members</h1>
                      <p className="text-pink-100 max-w-md">Register now and enjoy cashback on your first purchase.</p>
                      <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50">
                        Register Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="hidden md:block absolute right-8 top-1/2 transform -translate-y-1/2">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                        <Star className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>{" "}
        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Free shipping across Indonesia</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% secure payment</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Headphones className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Customer Support 24/7</h3>
                <p className="text-sm text-muted-foreground">Ready to help anytime</p>
              </div>
            </div>
          </Card>
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
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">👕</div>
                <h3 className="font-semibold">Fashion</h3>
                <p className="text-sm text-muted-foreground mt-1">1,234 products</p>
              </CardContent>
            </Card>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📱</div>
                <h3 className="font-semibold">Electronics</h3>
                <p className="text-sm text-muted-foreground mt-1">856 products</p>
              </CardContent>
            </Card>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🏠</div>
                <h3 className="font-semibold">Home & Living</h3>
                <p className="text-sm text-muted-foreground mt-1">672 products</p>
              </CardContent>
            </Card>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-500/20 text-pink-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🎮</div>
                <h3 className="font-semibold">Hobbies & Games</h3>
                <p className="text-sm text-muted-foreground mt-1">543 products</p>
              </CardContent>
            </Card>
          </div>
        </section>{" "}
        {/* This Week's Promo */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">This Week&apos;s Promo</h2>
            <Button variant="outline" asChild>
              <NextLink href="/product">
                View All Promos <ArrowRight className="ml-2 h-4 w-4" />
              </NextLink>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <div className="text-6xl">🎧</div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-pink-600 text-white">FLASH SALE</Badge>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-semibold text-lg">Wireless Headphone</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm line-through">Rp 600.000</span>
                    <span className="text-2xl font-bold text-primary">Rp 450.000</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Today only!</p>
                  <Button className="w-full mt-4 group-hover:bg-primary/90">Buy Now</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <div className="text-6xl">👕</div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white">DISKON 30%</Badge>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-semibold text-lg">T-shirt Unisex</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm line-through">Rp 170.000</span>
                    <span className="text-2xl font-bold text-primary">Rp 120.000</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Limited stock!</p>
                  <Button className="w-full mt-4 group-hover:bg-primary/90">Buy Now</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <div className="text-6xl">⌚</div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white">GRATIS ONGKIR</Badge>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-semibold text-lg">Smart Watch</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm line-through">Rp 1.000.000</span>
                    <span className="text-2xl font-bold text-primary">Rp 800.000</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Java & Bali area only</p>
                  <Button className="w-full mt-4 group-hover:bg-primary/90">Buy Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>{" "}
        {/* Event & Giveaway */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Events & Giveaways</h2>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <Gift className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-semibold text-primary">Special Events & Exclusive Rewards!</h3>
                  </div>
                  <p className="text-muted-foreground text-lg">Write your best review and win attractive prizes every week, including vouchers & free products. Become a ShopZone brand ambassador and enjoy exclusive benefits with a 6-month contract!</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Creative Product Photo Event (July 20-27, 2025)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Best Review Giveaway (August 1-10, 2025)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Weekly Flash Quiz with Prizes</span>
                    </div>
                  </div>
                  <Button size="lg" className="mt-6" asChild>
                    <NextLink href="/event">
                      View Details & Join Event <ArrowRight className="ml-2 h-4 w-4" />
                    </NextLink>
                  </Button>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center">
                    <Gift className="w-24 h-24 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>{" "}
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
      </main>
    </div>
  );
}
