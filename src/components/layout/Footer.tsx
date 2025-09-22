"use client";

import NextLink from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Brand } from "@/components/ui/Brand";
import { useEffect, useState } from "react";

interface SystemSettings {
  id: number;
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  currency: string;
  timezone: string;
  language: string;
  enableTwoFactor: boolean;
  sessionTimeout: number;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Footer() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings/public');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            setSettings({
              id: 0,
              storeName: data.settings.storeName,
              storeDescription: data.settings.storeDescription,
              contactEmail: data.settings.contactEmail,
              currency: data.settings.currency,
              timezone: "Asia/Jakarta",
              language: data.settings.language,
              enableTwoFactor: false,
              sessionTimeout: 24,
              version: "1.0.0",
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setSettings({
          id: 0,
          storeName: "Brandify",
          storeDescription: "A trusted online shopping platform",
          contactEmail: "contact@brandify.com",
          currency: "USD",
          timezone: "Asia/Jakarta",
          language: "en",
          enableTwoFactor: false,
          sessionTimeout: 24,
          version: "1.0.0",
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    fetchSettings();
  }, []);

  if (!settings) {
    return (
      <footer className="bg-background mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Brand as="h3" size="lg" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {settings.storeDescription} with a wide selection of quality products, attractive promos, and the best customer service for your satisfaction.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4 text-primary" />
              </a>
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4 text-primary" />
              </a>
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Quick Links</h2>
            <nav className="flex flex-col space-y-2">
              <NextLink href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </NextLink>
              <NextLink href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </NextLink>
              <NextLink href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </NextLink>
              <NextLink href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </NextLink>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Customer Service</h2>
            <nav className="flex flex-col space-y-2">
              <NextLink href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </NextLink>
              <NextLink href="/return-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Return Policy
              </NextLink>
              <NextLink href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Shipping Info
              </NextLink>
              <NextLink href="/track-order" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Track Order
              </NextLink>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Contact</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Business St, City, ST 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
