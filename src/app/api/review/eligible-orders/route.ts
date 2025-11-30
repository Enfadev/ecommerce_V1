import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { verifyJWT } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId || isNaN(Number(productId))) {
      return NextResponse.json({ error: "Valid productId required" }, { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    let user = null;
    let userEmail = null;

    if (session?.user?.email) {
      userEmail = session.user.email;
    } else {
      const token = request.cookies.get("auth-token")?.value;
      if (token) {
        try {
          const payload = await verifyJWT(token);
          if (payload?.email) {
            userEmail = payload.email;
          }
        } catch (error) {
          console.log(`JWT verification failed:`, error);
        }
      }
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Administrators cannot write product reviews. Only customers who have purchased the product can write reviews." },
        { status: 403 }
      );
    }

    const eligibleOrders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: "DELIVERED",
        items: {
          some: {
            productId: Number(productId),
          },
        },
      },
      include: {
        items: {
          where: {
            productId: Number(productId),
          },
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingReviews = await (prisma as any).productReview.findMany({
      where: {
        productId: Number(productId),
        userId: user.id,
      },
      select: {
        orderId: true,
      },
    });

    const reviewedOrderIds = existingReviews.map((review: { orderId: number }) => review.orderId);

    const ordersWithoutReview = eligibleOrders.filter(order => !reviewedOrderIds.includes(order.id));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedOrders = ordersWithoutReview.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      totalAmount: order.totalAmount,
      productInfo: order.items[0],
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching eligible orders:", error);
    return NextResponse.json({ error: "Failed to fetch eligible orders" }, { status: 500 });
  }
}
