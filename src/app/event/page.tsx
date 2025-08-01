import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Trophy, Users, Star, Clock, MapPin, ExternalLink, Camera, MessageSquare, Zap, Crown, Sparkles } from "lucide-react";

export default function Event() {
  const activeEvents = [
    {
      id: 1,
      title: "Mega Sale Ramadan",
      description: "Diskon hingga 70% untuk semua kategori produk. Promo terbatas hanya sampai akhir bulan!",
      period: "1 - 30 April 2025",
      status: "Aktif",
      type: "Sale",
      icon: Crown,
      prize: "Diskon hingga 70%",
      participants: "15.2K",
      bgGradient: "from-yellow-500 to-orange-500",
    },
    {
      id: 2,
      title: "Photo Contest Creative",
      description: "Upload foto produk paling kreatif dan menangkan hadiah menarik! Show your creativity!",
      period: "20 - 27 Juli 2025",
      status: "Berlangsung",
      type: "Contest",
      icon: Camera,
      prize: "Voucher Rp 500K",
      participants: "892",
      bgGradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Flash Quiz Berhadiah",
      description: "Kuis kilat setiap hari Minggu dengan hadiah langsung tanpa diundi!",
      period: "Setiap Minggu",
      status: "Rutin",
      type: "Quiz",
      icon: Zap,
      prize: "Berbagai Hadiah",
      participants: "2.1K",
      bgGradient: "from-blue-500 to-cyan-500",
    },
  ];

  const upcomingEvents = [
    {
      id: 4,
      title: "Review Competition",
      description: "Tulis review terbaik dan dapatkan hadiah menarik setiap minggunya",
      period: "1 - 10 Agustus 2025",
      type: "Competition",
      icon: MessageSquare,
      prize: "Voucher & Produk Gratis",
    },
    {
      id: 5,
      title: "Brand Ambassador Hunt",
      description: "Menjadi brand ambassador ShopZone dan dapatkan benefit eksklusif",
      period: "15 Agustus 2025",
      type: "Recruitment",
      icon: Star,
      prize: "Kontrak 6 Bulan",
    },
  ];

  const pastEvents = [
    {
      title: "Giveaway Laptop Gaming",
      period: "Juni 2025",
      winner: "Ahmad Rizki dari Jakarta",
      prize: "Laptop Gaming RTX 4060",
    },
    {
      title: "Fashion Week Sale",
      period: "Mei 2025",
      winner: "1000+ Pemenang",
      prize: "Total Hadiah Rp 50 Juta",
    },
    {
      title: "Mother's Day Special",
      period: "Mei 2025",
      winner: "Sari Indah dari Bandung",
      prize: "Hampers Premium",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 gap-2">
              <Sparkles className="w-4 h-4" />
              Event & Giveaway
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">Event Seru & Hadiah Menarik!</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Ikuti berbagai event menarik dan menangkan hadiah spektakuler setiap bulannya. Dari kontes foto hingga quiz berhadiah, ada banyak kesempatan untuk menang!
            </p>
          </div>
        </div>
      </section>

      {/* Active Events */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Event Aktif</h2>
            <Badge variant="destructive" className="animate-pulse">
              Live
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEvents.map((event, index) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className={`h-24 bg-gradient-to-r ${event.bgGradient} flex items-center justify-center relative`}>
                    <event.icon className="w-12 h-12 text-white" />
                    <Badge variant={event.status === "Aktif" ? "destructive" : "secondary"} className="absolute top-3 right-3">
                      {event.status}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{event.type}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {event.participants}
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.period}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="w-4 h-4 text-primary" />
                        <span className="font-medium">{event.prize}</span>
                      </div>
                    </div>

                    <Button className="w-full gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Ikuti Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Event Mendatang</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <event.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{event.type}</Badge>
                        <span className="text-sm text-muted-foreground">{event.period}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="w-4 h-4 text-primary" />
                        <span className="font-medium">{event.prize}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events Winners */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Pemenang Sebelumnya</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {event.period}
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-2">Pemenang:</p>
                  <p className="font-medium text-primary mb-3">{event.winner}</p>
                  <div className="text-sm">
                    <Gift className="w-4 h-4 inline mr-2 text-primary" />
                    {event.prize}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Jangan Lewatkan Event Berikutnya!</h2>
          <p className="text-xl opacity-90 mb-8">Follow media sosial kami untuk mendapatkan update event terbaru dan tips memenangkan hadiah</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2">
              <Users className="w-5 h-5" />
              Follow Instagram
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-white border-white hover:bg-white hover:text-primary">
              <Gift className="w-5 h-5" />
              Lihat Semua Event
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
