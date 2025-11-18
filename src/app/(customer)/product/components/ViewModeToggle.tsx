"use client";

import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useState } from "react";
import type { ViewMode } from "../constants";

interface ViewModeToggleProps {
  onViewModeChange?: (mode: ViewMode) => void;
}

export default function ViewModeToggle({ onViewModeChange }: ViewModeToggleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  return (
    <div className="flex bg-background/50 backdrop-blur-sm rounded-2xl shadow-sm p-1">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewModeChange("grid")}
        className={`h-12 w-12 rounded-xl transition-all duration-200 ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}
        aria-label="Grid view"
      >
        <Grid className="w-5 h-5" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewModeChange("list")}
        className={`h-12 w-12 rounded-xl transition-all duration-200 ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}
        aria-label="List view"
      >
        <List className="w-5 h-5" />
      </Button>
    </div>
  );
}
