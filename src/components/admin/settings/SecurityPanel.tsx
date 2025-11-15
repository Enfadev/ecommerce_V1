"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Bell, Eye } from "lucide-react";
import type { SystemStats } from "@/types/settings";

interface SecurityPanelProps {
  stats: SystemStats | null;
}

export function SecurityPanel({ stats }: SecurityPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <Bell className="w-4 h-4 mr-2" />
            Notification Settings
          </Button>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
            <p className="text-sm text-muted-foreground mb-4">Enhance your account security with 2FA</p>
            <Button variant="default" size="sm">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Security Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.security.recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <div>
                  <p className="text-sm font-medium">{log.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
                <Badge variant={log.status === "SUCCESS" ? "default" : log.status === "FAILED" ? "destructive" : "secondary"}>{log.status}</Badge>
              </div>
            )) || <div className="text-center text-muted-foreground py-4">Loading security logs...</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
