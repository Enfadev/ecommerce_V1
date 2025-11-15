"use client";

import { useState, useEffect } from "react";
import { SecurityPanel } from "@/components/admin/settings/SecurityPanel";
import type { SystemStats } from "@/types/settings";

export default function SecurityPage() {
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
        <h2 className="text-2xl font-bold">Security</h2>
        <p className="text-muted-foreground mt-1">Security settings and activity logs</p>
      </div>
      <SecurityPanel stats={stats} />
    </div>
  );
}
