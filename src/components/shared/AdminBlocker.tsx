"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminBlockerProps {
  title?: string;
  message?: string;
}

export function AdminBlocker({ 
  title = "Access Restricted", 
  message = "This feature is only available for regular customers. As an admin, you can manage products and settings through the admin panel." 
}: AdminBlockerProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {message}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/admin">
                Go to Admin Panel
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
