"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AnalyticsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Analytics Error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <Card className="p-8 max-w-md">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground">{error.message || "Failed to load analytics data. Please try again."}</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/admin")}>
              Go to Dashboard
            </Button>
          </div>

          {error.digest && <p className="text-xs text-muted-foreground pt-4">Error ID: {error.digest}</p>}
        </div>
      </Card>
    </div>
  );
}
