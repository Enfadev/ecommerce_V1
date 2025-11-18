"use client";

import { useState, useCallback } from "react";
import { subDays } from "date-fns";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewCards } from "@/components/admin/analytics/OverviewCards";
import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader";
import { AnalyticsTabs } from "@/components/admin/analytics/AnalyticsTabs";
import type { AnalyticsData, DatePeriod } from "@/types/analytics";

interface AnalyticsWrapperProps {
  initialData: AnalyticsData;
}

export function AnalyticsWrapper({ initialData }: AnalyticsWrapperProps) {
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<DatePeriod>("30d");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        period: selectedPeriod,
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      });

      const response = await fetch(`/api/admin/analytics?${params}`);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Unauthorized. Admin access required.");
        }
        throw new Error("Failed to fetch analytics data");
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError(error instanceof Error ? error.message : "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, dateRange]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error || "Failed to load analytics data"}</p>
          <Button onClick={fetchAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-lg">Updating analytics data...</p>
          </div>
        </div>
      )}

      <AnalyticsHeader
        selectedPeriod={selectedPeriod}
        dateRange={dateRange}
        timeSeriesData={data.timeSeriesData}
        onPeriodChange={(period) => {
          setSelectedPeriod(period);
          // Auto-update date range based on period
          if (period !== "custom") {
            const to = new Date();
            let from: Date;
            switch (period) {
              case "7d":
                from = subDays(to, 7);
                break;
              case "30d":
                from = subDays(to, 30);
                break;
              case "90d":
                from = subDays(to, 90);
                break;
              case "1y":
                from = subDays(to, 365);
                break;
              default:
                from = subDays(to, 30);
            }
            setDateRange({ from, to });
            // Fetch new data automatically
            setTimeout(() => fetchAnalyticsData(), 100);
          }
        }}
        onDateRangeChange={(range) => {
          setDateRange(range);
          setSelectedPeriod("custom");
          // Fetch new data after 500ms debounce
          const timer = setTimeout(() => fetchAnalyticsData(), 500);
          return () => clearTimeout(timer);
        }}
      />

      <OverviewCards overview={data.overview} />

      <AnalyticsTabs data={data} />
    </div>
  );
}
