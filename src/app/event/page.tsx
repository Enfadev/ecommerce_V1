import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Trophy, Users, Star, Clock, MapPin, ExternalLink, Camera, MessageSquare, Zap, Crown, Sparkles } from "lucide-react";

export default function Event() {
  const activeEvents = [
    {
      id: 1,
      title: "Mega Ramadan Sale",
      description: "Up to 70% off on all product categories. Limited time promo until the end of the month!",
      period: "April 1 - 30, 2025",
      status: "Active",
      type: "Sale",
      icon: Crown,
      prize: "Up to 70% Off",
      participants: "15.2K",
      bgGradient: "from-yellow-500 to-orange-500",
    },
    {
      id: 2,
      title: "Creative Photo Contest",
      description: "Upload your most creative product photo and win exciting prizes! Show your creativity!",
      period: "July 20 - 27, 2025",
      status: "Ongoing",
      type: "Contest",
      icon: Camera,
      prize: "$30 Voucher",
      participants: "892",
      bgGradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Flash Quiz with Prizes",
      description: "Quick quiz every Sunday with instant prizes, no drawing!",
      period: "Every Sunday",
      status: "Regular",
      type: "Quiz",
      icon: Zap,
      prize: "Various Prizes",
      participants: "2.1K",
      bgGradient: "from-blue-500 to-cyan-500",
    },
  ];

  const upcomingEvents = [
    {
      id: 4,
      title: "Review Competition",
      description: "Write your best review and win attractive prizes every week",
      period: "1 - 10 August 2025",
      type: "Competition",
      icon: MessageSquare,
      prize: "Vouchers & Free Products",
    },
    {
      id: 5,
      title: "Brand Ambassador Hunt",
      description: "Become a ShopZone brand ambassador and get exclusive benefits",
      period: "15 August 2025",
      type: "Recruitment",
      icon: Star,
      prize: "6-Month Contract",
    },
  ];

  const pastEvents = [
    {
      title: "Giveaway Gaming Laptop",
      period: "June 2025",
      winner: "Ahmad Rizki from Jakarta",
      prize: "RTX 4060 Gaming Laptop",
    },
    {
      title: "Fashion Week Sale",
      period: "May 2025",
      winner: "1000+ Winners",
      prize: "Total Prizes Worth Rp 50 Million",
    },
    {
      title: "Mother's Day Special",
      period: "May 2025",
      winner: "Sari Indah from Bandung",
      prize: "Premium Hampers",
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
              Events & Giveaways
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">Exciting Events & Amazing Prizes!</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Join various exciting events and win spectacular prizes every month. From photo contests to prize quizzes, there are plenty of chances to win!
            </p>
          </div>
        </div>
      </section>

      {/* Active Events */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Active Events</h2>
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
                    <Badge variant={event.status === "Active" ? "destructive" : "secondary"} className="absolute top-3 right-3">
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
                      Join Event
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
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
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
            <h2 className="text-3xl font-bold">Previous Winners</h2>
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
                  <p className="text-sm text-muted-foreground mb-2">Winner:</p>
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
          <h2 className="text-3xl font-bold mb-4">Don't Miss the Next Event!</h2>
          <p className="text-xl opacity-90 mb-8">Follow our social media to get the latest event updates and tips to win prizes</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2">
              <Users className="w-5 h-5" />
              Follow Instagram
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-white border-white hover:bg-white hover:text-primary">
              <Gift className="w-5 h-5" />
              View All Events
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
