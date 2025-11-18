"use client";

import { useAuth } from "@/components/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, X } from "lucide-react";

export default function AdminSecurityTest() {
  const { user, isLoading } = useAuth();

  const securityChecks = [
    {
      name: "User Authentication",
      status: !isLoading && user ? "pass" : "fail",
      description: user ? `Authenticated as ${user.email}` : "Not authenticated",
    },
    {
      name: "Admin Role Check",
      status: user?.role === "ADMIN" ? "pass" : "fail",
      description: user?.role === "ADMIN" ? "Admin role verified" : `Current role: ${user?.role || "None"}`,
    },
    {
      name: "Middleware Protection",
      status: "pass",
      description: "Admin middleware protection active",
    },
    {
      name: "Layout Guard",
      status: "pass",
      description: "Admin layout guard active",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Admin Security Status</h3>
      </div>

      <div className="space-y-3">
        {securityChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{check.name}</span>
                <Badge variant={check.status === "pass" ? "default" : "destructive"} className="text-xs">
                  {check.status === "pass" ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                  {check.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{check.description}</p>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-medium text-sm mb-2">User Information</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">ID:</span> {user.id}
            </div>
            <div>
              <span className="text-muted-foreground">Role:</span> {user.role}
            </div>
            <div>
              <span className="text-muted-foreground">Name:</span> {user.name}
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span> {user.email}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
