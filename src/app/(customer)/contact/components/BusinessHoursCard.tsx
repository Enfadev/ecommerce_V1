"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe } from "lucide-react";
import { BusinessHour } from "../types";

interface BusinessHoursCardProps {
  hours: BusinessHour[];
}

export function BusinessHoursCard({ hours }: BusinessHoursCardProps) {
  return (
    <Card className="p-6">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl flex items-center gap-3">
          <Clock className="w-6 h-6 text-primary" />
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        {hours.map((hour, index) => (
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
  );
}
