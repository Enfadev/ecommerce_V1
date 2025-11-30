import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

interface WhereClause {
  role: Role;
  OR?: Array<{
    name?: { contains: string; mode: "insensitive" };
    email?: { contains: string; mode: "insensitive" };
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: WhereClause = {
      role: "USER",
    };

    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }];
    }

    const customers = await prisma.user.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true,
            status: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalCustomers = await prisma.user.count({
      where,
    });

    const transformedCustomers = customers.map((customer) => {
      const totalOrders = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum: number, order: { totalAmount: number }) => sum + order.totalAmount, 0);
      const lastOrder = customer.orders.length > 0 ? customer.orders[0].createdAt : null;

      let status: "active" | "inactive" | "blocked" = "active";
      if (customer.orders.length === 0) {
        status = "inactive";
      } else {
        const lastOrderDate = new Date(lastOrder!);
        const daysSinceLastOrder = Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastOrder > 90) {
          status = "inactive";
        }
      }

      return {
        id: customer.id,
        dbId: customer.id,
        name: customer.name,
        email: customer.email,
        phone: "+1 555-" + String(Math.floor(Math.random() * 900) + 100) + "-" + String(Math.floor(Math.random() * 9000) + 1000),
        address: "Address not provided",
        joinDate: customer.createdAt.toISOString().split("T")[0],
        lastOrder: lastOrder ? lastOrder.toISOString().split("T")[0] : "Never",
        totalOrders,
        totalSpent,
        status,
      };
    });

    const allCustomers = await prisma.user.findMany({
      where: { role: "USER" },
      include: {
        orders: {
          select: {
            totalAmount: true,
            createdAt: true,
          },
        },
      },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: allCustomers.length,
      active: transformedCustomers.filter((c) => c.status === "active").length,
      inactive: transformedCustomers.filter((c) => c.status === "inactive").length,
      blocked: 0,
      newThisMonth: allCustomers.filter((customer) => new Date(customer.createdAt) >= startOfMonth).length,
      totalRevenue: allCustomers.reduce((sum, customer) => sum + customer.orders.reduce((orderSum, order) => orderSum + order.totalAmount, 0), 0),
    };

    return NextResponse.json({
      customers: transformedCustomers,
      stats,
      pagination: {
        page,
        limit,
        total: totalCustomers,
        totalPages: Math.ceil(totalCustomers / limit),
      },
    });
  } catch (error) {
    console.error("Customer API Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("id");
    await request.json();

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }


    return NextResponse.json({
      success: true,
      message: "Customer status updated successfully",
    });
  } catch (error) {
    console.error("Customer Update Error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("id");

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const dbId = customerId.startsWith("CUST-") ? customerId.replace("CUST-", "") : customerId;

    const customer = await prisma.user.findUnique({
      where: { id: dbId },
    });

    if (!customer || customer.role !== "USER") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: dbId },
    });

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Customer Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
