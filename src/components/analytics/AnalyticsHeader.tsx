"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { AdminExportButton } from "@/components/admin/AdminExportButton";
import type { DatePeriod, TimeSeriesData } from "@/types/analytics";

interface AnalyticsHeaderProps {
  selectedPeriod: DatePeriod;
  dateRange: { from: Date; to: Date };
  timeSeriesData: TimeSeriesData[];
  onPeriodChange: (period: DatePeriod) => void;
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

const PERIOD_OPTIONS: { value: DatePeriod; label: string }[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "1y", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
];

export function AnalyticsHeader({ selectedPeriod, dateRange, timeSeriesData, onPeriodChange, onDateRangeChange }: AnalyticsHeaderProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePeriodChange = (period: DatePeriod) => {
    onPeriodChange(period);

    if (period !== "custom") {
      const now = new Date();
      let from: Date;

      switch (period) {
        case "7d":
          from = subDays(now, 7);
          break;
        case "30d":
          from = subDays(now, 30);
          break;
        case "90d":
          from = subDays(now, 90);
          break;
        case "1y":
          from = subDays(now, 365);
          break;
        default:
          from = subDays(now, 30);
      }

      onDateRangeChange({ from, to: now });
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">Analyze store performance and business insights</p>
      </div>

      <div className="flex items-center gap-3">
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedPeriod === "custom" && (
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onDateRangeChange({ from: range.from, to: range.to });
                    setShowDatePicker(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        )}

        <AdminExportButton data={(timeSeriesData as unknown as Record<string, unknown>[]) || []} filename={`analytics-detailed-${new Date().toISOString().split("T")[0]}`} type="analytics" className="" />
      </div>
    </div>
  );
}
