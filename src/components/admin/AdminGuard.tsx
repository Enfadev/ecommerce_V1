"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/components/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/signin?redirect=/admin");
    }
  }, [user, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Card className="p-8 max-w-md mx-auto">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Verifying Admin Access</h3>
                <p className="text-sm text-muted-foreground">Please wait while we verify your admin privileges...</p>
              </div>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </Card>
        </div>
      )
    );
  }

  // Show unauthorized if user is not admin
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8 max-w-md mx-auto">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Access Denied</h3>
              <p className="text-sm text-muted-foreground">You don&apos;t have admin privileges to access this area.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/")}>
                Go Home
              </Button>
              <Button onClick={() => router.push("/signin")}>Sign In</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Render admin content only if user is authenticated and is admin
  return <>{children}</>;
}
