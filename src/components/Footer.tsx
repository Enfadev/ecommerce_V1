import NextLink from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">ShopZone</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">A trusted online shopping platform with a wide selection of quality products, attractive promos, and the best customer service for your satisfaction.</p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors">
                <Facebook className="h-4 w-4 text-primary" />
              </a>
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors">
                <Instagram className="h-4 w-4 text-primary" />
              </a>
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors">
                <Twitter className="h-4 w-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <NextLink href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </NextLink>
              </li>
              <li>
                <NextLink href="/product" className="text-muted-foreground hover:text-primary transition-colors">
                  Products
                </NextLink>
              </li>
              <li>
                <NextLink href="/event" className="text-muted-foreground hover:text-primary transition-colors">
                  Events & Promos
                </NextLink>
              </li>
              <li>
                <NextLink href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Help</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <NextLink href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </NextLink>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <NextLink href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  123 Technology St.
                  <br />
                  South Jakarta, 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">hello@shopzone.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} ShopZone. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
