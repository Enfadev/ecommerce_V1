import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Trophy, Users, Star, Clock, ExternalLink, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getEventPageData() {
  try {
    const eventPage = await prisma.eventPage.findFirst();
    return eventPage;
  } catch (error) {
    console.error("Error fetching event page data:", error);
    return null;
  }
}

interface Event {
  id?: string;
  title: string;
  description: string;
  status?: string;
  category?: string;
  featured?: boolean;
  participants?: string;
  period?: string;
  date?: string;
  prize?: string;
  type?: string;
}

export default async function Event() {
  const eventPageData = await getEventPageData();

  // Default fallback data
  const defaultData = {
    heroTitle: "Exciting Events & Promotions",
    heroSubtitle: "Don't Miss Out!",
    heroDescription: "Join our amazing events and take advantage of exclusive promotions, special discounts, and limited-time offers.",
    activeEvents: [
      {
        title: "Mega Sale",
        description: "Up to 70% off on all product categories. Limited time promo!",
        status: "Active",
        category: "sale",
        featured: true,
      },
    ],
    upcomingEvents: [
      {
        title: "Tech Week 2024",
        date: "2024-10-15",
        description: "Latest gadgets and electronics at special prices",
      },
    ],
    pastEvents: [],
    eventCategories: [],
  };

  const pageData = eventPageData || defaultData;

  // Ensure activeEvents and upcomingEvents are arrays
  const activeEvents: Event[] = Array.isArray(pageData.activeEvents) ? (pageData.activeEvents as Event[]) : defaultData.activeEvents;

  const upcomingEvents: Event[] = Array.isArray(pageData.upcomingEvents) ? (pageData.upcomingEvents as Event[]) : defaultData.upcomingEvents;

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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">{pageData.heroTitle || "Exciting Events & Promotions"}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              {pageData.heroDescription || "Join our amazing events and take advantage of exclusive promotions, special discounts, and limited-time offers."}
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
              <Card key={event.id || index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className={`h-24 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center relative`}>
                    <Trophy className="w-12 h-12 text-white" />
                    <Badge variant={event.status === "Active" ? "destructive" : "secondary"} className="absolute top-3 right-3">
                      {event.status || "Active"}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{event.category || "Event"}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {event.participants || "Many"}
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.period || event.date || "Ongoing"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="w-4 h-4 text-primary" />
                        <span className="font-medium">{event.prize || "Amazing Prizes!"}</span>
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
              <Card key={event.id || index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{event.category || event.type || "Event"}</Badge>
                        <span className="text-sm text-muted-foreground">{event.date || event.period || "Soon"}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="w-4 h-4 text-primary" />
                        <span className="font-medium">{event.prize || "Exciting Prizes!"}</span>
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
          <h2 className="text-3xl font-bold mb-4">Don&apos;t Miss the Next Event!</h2>
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
