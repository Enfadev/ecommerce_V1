"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { OfficeLocation } from "../types";

interface OfficeLocationsCardProps {
  locations: OfficeLocation[];
}

export function OfficeLocationsCard({ locations }: OfficeLocationsCardProps) {
  return (
    <Card className="p-6">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl flex items-center gap-3">
          <MapPin className="w-6 h-6 text-primary" />
          Our Offices
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        {locations.map((office, index) => (
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
  );
}
