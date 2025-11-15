"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Settings } from "lucide-react";
import type { SystemStats } from "@/types/settings";

interface SystemPanelProps {
  stats: SystemStats | null;
}

export function SystemPanel({ stats }: SystemPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Database className="w-4 h-4 mr-2" />
            Backup Data
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            API Settings
          </Button>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">System Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Version:</span>
                <span>{stats?.system.version || "1.0.0"}</span>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <span>{stats?.system.database || "MySQL"}</span>
              </div>
              <div className="flex justify-between">
                <span>Storage:</span>
                <span>{stats?.system.storage || "Local"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              <Badge variant={stats?.system.health.database ? "default" : "destructive"}>{stats?.system.health.database ? "Online" : "Offline"}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">API Services</span>
              <Badge variant={stats?.system.health.apiServices ? "default" : "destructive"}>{stats?.system.health.apiServices ? "Running" : "Down"}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">File Storage</span>
              <Badge variant={stats?.system.health.fileStorage ? "default" : "destructive"}>{stats?.system.health.fileStorage ? "Available" : "Unavailable"}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Cache System</span>
              <Badge variant={stats?.system.health.cacheSystem ? "default" : "secondary"}>{stats?.system.health.cacheSystem ? "Enabled" : "Disabled"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
