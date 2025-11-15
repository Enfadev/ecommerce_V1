"use client";

import { useState, useEffect } from "react";
import { SystemPanel } from "@/components/admin/settings/SystemPanel";
import type { SystemStats } from "@/types/settings";

export default function SystemPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">System</h2>
        <p className="text-muted-foreground mt-1">System information and status</p>
      </div>
      <SystemPanel stats={stats} />
    </div>
  );
}
