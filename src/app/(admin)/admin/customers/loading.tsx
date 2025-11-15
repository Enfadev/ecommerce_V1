import { Loader2 } from "lucide-react";

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-80 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded-md mt-2" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-36 bg-muted animate-pulse rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>

      <div className="h-24 bg-muted animate-pulse rounded-lg" />

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-lg">Loading customer data...</p>
        </div>
      </div>
    </div>
  );
}
