import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, Heart, Shield, Truck, Clock, Star, MapPin, Phone, Mail } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Pelanggan Setia", value: "50K+", icon: Users },
    { label: "Produk Berkualitas", value: "10K+", icon: Award },
    { label: "Rating Kepuasan", value: "4.8", icon: Star },
    { label: "Kota Terjangkau", value: "100+", icon: MapPin },
  ];

  const features = [
    {
      icon: Shield,
      title: "Belanja Aman",
      description: "Sistem keamanan berlapis dan perlindungan data pelanggan",
    },
    {
      icon: Truck,
      title: "Pengiriman Cepat",
      description: "Gratis ongkir ke seluruh Indonesia dengan pengiriman express",
    },
    {
      icon: Clock,
      title: "Support 24/7",
      description: "Customer service yang siap membantu Anda kapan saja",
    },
    {
      icon: Heart,
      title: "Produk Berkualitas",
      description: "Hanya menjual produk original dan bergaransi resmi",
    },
  ];

  const team = [
    {
      name: "Ahmad Rizki",
      role: "CEO & Founder",
      image: "/team1.jpg",
      description: "Visioner di balik ShopZone dengan pengalaman 10+ tahun di e-commerce",
    },
    {
      name: "Sari Indah",
      role: "Head of Operations",
      image: "/team2.jpg",
      description: "Memastikan setiap operasional berjalan lancar dan efisien",
    },
    {
      name: "Budi Santoso",
      role: "Tech Lead",
      image: "/team3.jpg",
      description: "Mengembangkan teknologi terdepan untuk pengalaman belanja terbaik",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Tentang ShopZone
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">Membangun Masa Depan Belanja Online Indonesia</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
            ShopZone hadir sebagai platform e-commerce terpercaya yang menghadirkan pengalaman belanja online terbaik dengan produk berkualitas, harga kompetitif, dan layanan pelanggan yang luar biasa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Heart className="w-5 h-5" />
              Mulai Belanja
            </Button>
            <Button variant="outline" size="lg">
              Hubungi Kami
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
                  <h2 className="text-2xl font-bold">Visi Kami</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi platform e-commerce #1 di Indonesia yang mengutamakan kepuasan pelanggan, inovasi teknologi, dan pemberdayaan ekonomi digital untuk menciptakan ekosistem belanja online yang berkelanjutan dan inklusif.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">Misi Kami</h2>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Menyediakan produk berkualitas tinggi dengan harga yang kompetitif
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Memberikan pengalaman belanja yang mudah, aman, dan menyenangkan
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Mendukung pertumbuhan UMKM dan brand lokal Indonesia
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Menghadirkan inovasi teknologi untuk kemudahan berbelanja
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
            <h2 className="text-3xl font-bold mb-4">Mengapa Memilih ShopZone?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Kami berkomitmen memberikan layanan terbaik dengan berbagai keunggulan yang membuat pengalaman belanja Anda semakin istimewa.</p>
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
            <h2 className="text-3xl font-bold mb-4">Tim Terbaik Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Bertemu dengan para profesional berpengalaman yang berdedikasi membangun ShopZone menjadi platform terdepan di Indonesia.</p>
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
          <h2 className="text-3xl font-bold mb-4">Mari Berkolaborasi!</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Apakah Anda seorang supplier, brand partner, atau memiliki ide bisnis? Kami terbuka untuk membangun kemitraan yang saling menguntungkan.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Mail className="w-5 h-5" />
              Email Kami
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Phone className="w-5 h-5" />
              Hubungi WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
