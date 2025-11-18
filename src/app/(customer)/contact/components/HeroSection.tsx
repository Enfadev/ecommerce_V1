"use client";

import { Badge } from "@/components/ui/badge";
import { Headphones } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

export function HeroSection({ title, subtitle, description }: HeroSectionProps) {
  return (
    <section className="py-20">
      <div className="text-center">
        <Badge variant="secondary" className="mb-4 gap-2">
          <Headphones className="w-4 h-4" />
          {subtitle}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">{title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">{description}</p>
      </div>
    </section>
  );
}
