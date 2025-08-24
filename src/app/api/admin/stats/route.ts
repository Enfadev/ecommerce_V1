import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt";

interface SecurityLog {
  id: number;
  action: string;
  description: string;
  user?: { name: string | null; email: string; } | null;
  ipAddress?: string | null;
  status: string;
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    // Get user statistics
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({
      where: { role: "ADMIN" }
    });
    const totalCustomers = await prisma.user.count({
      where: { role: "USER" }
    });

    // Get order statistics
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true }
    });

    // Get order status distribution
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true
      }
    });

    // Get real security logs from database
    const securityLogsData = await prisma.securityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Format security logs for frontend
    const recentSecurityLogs: SecurityLog[] = securityLogsData.map(log => ({
      id: log.id,
      action: log.action,
      description: log.description,
      user: log.user ? { name: log.user.name || 'Unknown', email: log.user.email } : null,
      ipAddress: log.ipAddress || 'Unknown',
      status: log.status,
      createdAt: log.createdAt
    }));

    // Get product statistics
    const totalProducts = await prisma.product.count();
    const lowStockProducts = await prisma.product.count({
      where: { stock: { lt: 10 } }
    });

    // System health checks
    const systemHealth = {
      database: true, // If we reach here, database is working
      apiServices: true, // API is running
      fileStorage: true, // Basic storage available
      cacheSystem: false // Not implemented yet
    };

    // Get recent user registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          admins: totalAdmins,
          customers: totalCustomers,
          newThisMonth: newUsersThisMonth
        },
        orders: {
          total: totalOrders,
          revenue: totalRevenue._sum.totalAmount || 0,
          byStatus: ordersByStatus.reduce((acc: Record<string, number>, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
          }, {})
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts
        },
        security: {
          recentLogs: recentSecurityLogs.map(log => ({
            id: log.id,
            action: log.action,
            description: log.description,
            user: log.user?.name || "System",
            ipAddress: log.ipAddress,
            status: log.status,
            createdAt: log.createdAt
          }))
        },
        system: {
          health: systemHealth,
          version: "1.0.0",
          database: "MySQL",
          storage: "Local"
        }
      }
    });
  } catch (error) {
    console.error("Get system stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get system statistics" },
      { status: 500 }
    );
  }
}
