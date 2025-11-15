export interface AdminAccessLog {
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

class AdminSecurityLogger {
  private logs: AdminAccessLog[] = [];
  private maxLogs = 1000;

  log(logEntry: AdminAccessLog) {
    this.logs.unshift(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    if (process.env.NODE_ENV === "development") {
      console.log("🔐 Admin Access Log:", {
        timestamp: logEntry.timestamp,
        user: `${logEntry.userEmail} (${logEntry.userRole})`,
        path: logEntry.path,
        success: logEntry.success,
        reason: logEntry.reason,
      });
    }

  }

  getRecentLogs(limit = 50): AdminAccessLog[] {
    return this.logs.slice(0, limit);
  }

  getFailedAttempts(timeRangeMinutes = 60): AdminAccessLog[] {
    const cutoff = new Date(Date.now() - timeRangeMinutes * 60 * 1000);
    return this.logs.filter((log) => !log.success && new Date(log.timestamp) > cutoff);
  }

  clearLogs() {
    this.logs = [];
  }
}

const adminLogger = new AdminSecurityLogger();

export default adminLogger;

export function createAdminAccessLog(userId: string, userEmail: string, userRole: string, path: string, request: Request, success: boolean, reason?: string): AdminAccessLog {
  return {
    timestamp: new Date().toISOString(),
    userId,
    userEmail,
    userRole,
    path,
    userAgent: request.headers.get("user-agent") || "Unknown",
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown",
    success,
    reason,
  };
}
