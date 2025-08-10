import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, Heart, Shield, Truck, Clock, Star, MapPin, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getAboutPageData() {
  try {
    const aboutPage = await prisma.aboutPage.findFirst();
    return aboutPage;
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return null;
  }
}

export default async function About() {
  const aboutPageData = await getAboutPageData();

  // Default fallback data
  const defaultData = {
    heroTitle: "About Our Company",
    heroSubtitle: "Your Trusted Shopping Partner",
    heroDescription: "We are committed to providing the best shopping experience with quality products, competitive prices, and exceptional customer service.",
    companyStory: "Founded with a vision to make quality products accessible to everyone. We have grown into a trusted brand serving thousands of customers worldwide.",
    mission: "To provide customers with the highest quality products at competitive prices while delivering exceptional customer service.",
    vision: "To become the leading e-commerce platform that connects people with the products they love.",
    statistics: [
      { label: "Loyal Customers", value: "50K+", icon: "Users" },
      { label: "Quality Products", value: "10K+", icon: "Award" },
      { label: "Satisfaction Rating", value: "4.8", icon: "Star" },
      { label: "Cities Reached", value: "100+", icon: "MapPin" },
    ],
    features: [
      {
        icon: "Shield",
        title: "Secure Shopping",
        description: "Multi-layered security system and customer data protection",
      },
      {
        icon: "Truck",
        title: "Fast Delivery",
        description: "Free shipping across Indonesia with express delivery",
      },
      {
        icon: "Clock",
        title: "24/7 Support",
        description: "Customer service ready to help you anytime",
      },
      {
        icon: "Heart",
        title: "Quality Products",
        description: "Only selling original products with official warranty",
      },
    ]
  };

  const pageData = aboutPageData || defaultData;
  const stats = pageData.statistics || defaultData.statistics;
  const features = pageData.features || defaultData.features;
  const team = pageData.teamMembers || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            {pageData.heroSubtitle}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
            {pageData.heroTitle}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
            {pageData.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Heart className="w-5 h-5" />
              Start Shopping
            </Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To become the #1 e-commerce platform in Indonesia, prioritizing customer satisfaction, technological innovation, and digital economic empowerment to create a sustainable and inclusive online shopping ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Provide high-quality products at competitive prices
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Deliver a shopping experience that is easy, safe, and enjoyable
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Support the growth of MSMEs and local Indonesian brands
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Bring technological innovation for shopping convenience
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose ShopZone?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We are committed to providing the best service with various advantages that make your shopping experience even more special.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Best Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Meet the experienced professionals dedicated to making ShopZone the leading platform in Indonesia.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <Users className="w-20 h-20 text-muted-foreground" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <Badge variant="secondary" className="mb-3">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Collaborate!</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Are you a supplier, brand partner, or have a business idea? We are open to building mutually beneficial partnerships.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Mail className="w-5 h-5" />
              Email Us
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Phone className="w-5 h-5" />
              Contact WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
