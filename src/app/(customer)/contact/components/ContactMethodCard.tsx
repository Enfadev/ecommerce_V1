"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MessageSquare, Headphones, Globe } from "lucide-react";
import { ContactMethod } from "../types";

const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
  Phone,
  Mail,
  MessageSquare,
  Headphones,
  Globe,
};

interface ContactMethodCardProps {
  method: ContactMethod;
}

export function ContactMethodCard({ method }: ContactMethodCardProps) {
  const IconComponent = iconMap[method.icon] || Phone;

  return (
    <Card className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1">
      <CardContent className="p-0">
        <div className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-semibold text-lg mb-2">{method.title}</h2>
        <p className="text-sm text-muted-foreground mb-3">{method.subtitle}</p>
        <a href={method.link} className="text-primary font-medium hover:underline">
          {method.value}
        </a>
      </CardContent>
    </Card>
  );
}
