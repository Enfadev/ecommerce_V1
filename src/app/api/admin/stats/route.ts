import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { verifyJWT } from "@/lib/auth";

interface SecurityLog {
  id: number;
  action: string;
  description: string;
  user?: { name: string | null; email: string } | null;
  ipAddress?: string | null;
  status: string;
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({
      where: { role: "ADMIN" },
    });
    const totalCustomers = await prisma.user.count({
      where: { role: "USER" },
    });

    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    });

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const securityLogsData = await prisma.securityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    const recentSecurityLogs: SecurityLog[] = securityLogsData.map((log) => ({
      id: log.id,
      action: log.action,
      description: log.description,
      user: log.user ? { name: log.user.name || "Unknown", email: log.user.email } : null,
      ipAddress: log.ipAddress || "Unknown",
      status: log.status,
      createdAt: log.createdAt,
    }));

    const totalProducts = await prisma.product.count();
    const lowStockProducts = await prisma.product.count({
      where: { stock: { lt: 10 } },
    });

    const systemHealth = {
      database: true,
      apiServices: true,
      fileStorage: true,
      cacheSystem: false,
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          admins: totalAdmins,
          customers: totalCustomers,
          newThisMonth: newUsersThisMonth,
        },
        orders: {
          total: totalOrders,
          revenue: totalRevenue._sum.totalAmount || 0,
          byStatus: ordersByStatus.reduce((acc: Record<string, number>, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
          }, {}),
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
        },
        security: {
          recentLogs: recentSecurityLogs.map((log) => ({
            id: log.id,
            action: log.action,
            description: log.description,
            user: log.user?.name || "System",
            ipAddress: log.ipAddress,
            status: log.status,
            createdAt: log.createdAt,
          })),
        },
        system: {
          health: systemHealth,
          version: "1.0.0",
          database: "MySQL",
          storage: "Local",
        },
      },
    });
  } catch (error) {
    console.error("Get system stats error:", error);
    return NextResponse.json({ success: false, message: "Failed to get system statistics" }, { status: 500 });
  }
}
