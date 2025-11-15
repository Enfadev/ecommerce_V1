import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { adminLogger } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const failedOnly = url.searchParams.get("failed") === "true";
    const timeRange = parseInt(url.searchParams.get("timeRange") || "60");

    let logs;
    if (failedOnly) {
      logs = adminLogger.getFailedAttempts(timeRange);
    } else {
      logs = adminLogger.getRecentLogs(limit);
    }

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
      filters: {
        limit,
        failedOnly,
        timeRange: failedOnly ? timeRange : null,
      },
    });
  } catch (error) {
    console.error("Error fetching security logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
