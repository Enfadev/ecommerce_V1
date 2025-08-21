"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Headphones, Globe, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ContactMethod {
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  link: string;
  bgColor: string;
}

interface OfficeLocation {
  city: string;
  address: string;
  phone: string;
  isMain: boolean;
}

interface BusinessHour {
  day: string;
  hours: string;
  closed: boolean;
}

interface SocialMedia {
  name: string;
  link: string;
  icon: string;
  color: string;
}

interface ContactPageData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  contactMethods: ContactMethod[];
  officeLocations: OfficeLocation[];
  businessHours: BusinessHour[];
  socialMedia: SocialMedia[];
}

const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
  Phone,
  Mail,
  MessageSquare,
  Headphones,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactData, setContactData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/contact-page");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setContactData(data);
          } else {
            // Set default data if no data in database
            setContactData(getDefaultContactData());
          }
        } else {
          setContactData(getDefaultContactData());
        }
      } catch (error) {
        console.error("Error loading contact data:", error);
        setContactData(getDefaultContactData());
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getDefaultContactData = (): ContactPageData => ({
    id: 0,
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
      { name: "Facebook", link: "#", icon: "Facebook", color: "text-blue-600" },
      { name: "Instagram", link: "#", icon: "Instagram", color: "text-pink-600" },
      { name: "Twitter", link: "#", icon: "Twitter", color: "text-blue-400" },
      { name: "YouTube", link: "#", icon: "Youtube", color: "text-red-600" },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Your message has been sent! We will respond within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  if (loading || !contactData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading contact information...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 gap-2">
            <Headphones className="w-4 h-4" />
            {contactData.heroSubtitle}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">{contactData.heroTitle}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">{contactData.heroDescription}</p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactData.contactMethods.map((method, index) => {
              const IconComponent = iconMap[method.icon] || Phone;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{method.subtitle}</p>
                    <a href={method.link} className="text-primary font-medium hover:underline">
                      {method.value}
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Send className="w-6 h-6 text-primary" />
                  Send Message
                </CardTitle>
                <p className="text-muted-foreground">Fill out the form below and we will respond within 24 hours</p>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required className="h-12" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" required className="h-12" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleInputChange} placeholder="Your message subject" required className="h-12" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Write your message or question..." rows={6} required className="resize-none" />
                  </div>

                  <Button type="submit" className="w-full h-12 gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <div className="space-y-8">
              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary" />
                    Our Offices
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  {contactData.officeLocations.map((office, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{office.city}</h3>
                          {office.isMain && (
                            <Badge variant="default" className="text-xs">
                              HQ
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{office.address}</p>
                        <p className="text-sm font-medium">{office.phone}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Clock className="w-6 h-6 text-primary" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  {contactData.businessHours.map((hour, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <span>{hour.day}</span>
                      <span className={hour.closed ? "text-muted-foreground" : "font-medium"}>{hour.closed ? "Closed" : hour.hours}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Badge variant="secondary" className="gap-2">
                      <Globe className="w-4 h-4" />
                      WhatsApp Support 24/7
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-muted/30">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Follow Our Social Media</h2>
          <p className="text-muted-foreground mb-8">Get the latest updates, exclusive promos, and shopping tips</p>
          <div className="flex justify-center gap-6">
            {contactData.socialMedia.map((social, index) => {
              const IconComponent = iconMap[social.icon] || Globe;
              return (
                <a key={index} href={social.link} className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <IconComponent className={`w-7 h-7 ${social.color}`} />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
