"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Image as ImageIcon, FileText, TrendingDown } from "lucide-react";

interface OptimizationStatsProps {
  className?: string;
}

export function OptimizationStats({ className }: OptimizationStatsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Image Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Raster Images</span>
            <Badge variant="secondary" className="ml-auto">
              WebP
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-green-500" />
            <span className="text-sm">Vector Images</span>
            <Badge variant="secondary" className="ml-auto">
              SVG
            </Badge>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            <span>WebP reduces file size by 25-50%</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            <span>SVG optimization removes unnecessary data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
