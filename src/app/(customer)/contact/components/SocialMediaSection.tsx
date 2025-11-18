"use client";

import { Facebook, Twitter, Instagram, Youtube, Globe } from "lucide-react";
import { SocialMedia } from "../types";

const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
};

interface SocialMediaSectionProps {
  socialMedia: SocialMedia[];
}

export function SocialMediaSection({ socialMedia }: SocialMediaSectionProps) {
  return (
    <section className="py-16 bg-muted/30 rounded-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Follow Our Social Media</h2>
        <p className="text-muted-foreground mb-8">Get the latest updates, exclusive promos, and shopping tips</p>
        <div className="flex justify-center gap-6">
          {socialMedia.map((social, index) => {
            const IconComponent = iconMap[social.icon] || Globe;
            return (
              <a key={index} href={social.link} className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:shadow-lg transition-all hover:-translate-y-1" aria-label={social.name || social.icon}>
                <IconComponent className={`w-7 h-7 ${social.color}`} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
