"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, RefreshCw, AlertTriangle, CheckCircle, Clock, User, Globe } from "lucide-react";

interface AdminAccessLog {
  timestamp: string;
  userId: string;
  userEmail: string;
  userRole: string;
  path: string;
  userAgent: string;
  ip: string;
  success: boolean;
  reason?: string;
}

interface SecurityLogsResponse {
  success: boolean;
  logs: AdminAccessLog[];
  total: number;
  filters: {
    limit: number;
    failedOnly: boolean;
    timeRange: number | null;
  };
}

export default function AdminSecurityLogs() {
  const [logs, setLogs] = useState<AdminAccessLog[]>([]);
  const [failedLogs, setFailedLogs] = useState<AdminAccessLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (failedOnly = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: "100",
        failed: failedOnly.toString(),
        ...(failedOnly && { timeRange: "1440" }), // 24 hours for failed attempts
      });

      const response = await fetch(`/api/admin/security-logs?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch security logs");
      }

      const data: SecurityLogsResponse = await response.json();

      if (failedOnly) {
        setFailedLogs(data.logs);
      } else {
        setLogs(data.logs);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(false); // Fetch all logs
    fetchLogs(true); // Fetch failed logs
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatUserAgent = (userAgent: string) => {
    // Simple extraction of browser info
    const match = userAgent.match(/(?:Chrome|Firefox|Safari|Edge)\/[\d.]+/);
    return match ? match[0] : "Unknown Browser";
  };

  const LogEntry = ({ log }: { log: AdminAccessLog }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${log.success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{log.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}</div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{log.userEmail}</span>
            <Badge variant="outline" className="text-xs">
              {log.userRole}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {log.path}
            </span>
          </div>
          {log.reason && <div className="text-xs text-red-600 mt-1">{log.reason}</div>}
        </div>
      </div>
      <div className="text-right text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTime(log.timestamp)}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <User className="h-3 w-3" />
          {formatUserAgent(log.userAgent)}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Security Logs</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchLogs(false);
            fetchLogs(true);
          }}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            All Access ({logs.length})
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Failed Attempts ({failedLogs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No access logs found</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <LogEntry key={index} log={log} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="failed" className="space-y-3 mt-4">
          {failedLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              No failed attempts in the last 24 hours
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {failedLogs.map((log, index) => (
                <LogEntry key={index} log={log} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
