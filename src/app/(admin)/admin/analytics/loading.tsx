import { Loader2 } from "lucide-react";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="h-9 w-64 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-80 bg-muted animate-pulse rounded-md mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-40 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>

      <div className="h-96 bg-muted animate-pulse rounded-lg" />

      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-lg">Loading analytics data...</p>
        </div>
      </div>
    </div>
  );
}
