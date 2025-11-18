"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "./components/HeroSection";
import { ContactMethodCard } from "./components/ContactMethodCard";
import { ContactForm } from "./components/ContactForm";
import { OfficeLocationsCard } from "./components/OfficeLocationsCard";
import { BusinessHoursCard } from "./components/BusinessHoursCard";
import { SocialMediaSection } from "./components/SocialMediaSection";
import { ContactPageData } from "./types";
import { fetchContactData } from "./utils";

export default function Contact() {
  const [contactData, setContactData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchContactData();
      setContactData(data);
      setLoading(false);
    };

    loadData();
  }, []);

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
    <div>
      {/* Hero Section */}
      <HeroSection title={contactData.heroTitle} subtitle={contactData.heroSubtitle} description={contactData.heroDescription} />

      {/* Contact Methods */}
      <section className="py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactData.contactMethods.map((method, index) => (
            <ContactMethodCard key={index} method={method} />
          ))}
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm />

          {/* Office Locations & Business Hours */}
          <div className="space-y-8">
            <OfficeLocationsCard locations={contactData.officeLocations} />
            <BusinessHoursCard hours={contactData.businessHours} />
          </div>
        </div>
      </section>

      {/* Social Media */}
      <SocialMediaSection socialMedia={contactData.socialMedia} />
    </div>
  );
}
