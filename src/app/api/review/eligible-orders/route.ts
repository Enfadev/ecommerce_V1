import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyJWT } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId || isNaN(Number(productId))) {
      return NextResponse.json({ error: "Valid productId required" }, { status: 400 });
    }

    const reviews = await prisma.productReview.findMany({
      where: {
        productId: Number(productId),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      user: review.isAnonymous ? "Anonymous" : review.user.name || "Anonymous",
      date: review.createdAt.toISOString(),
      isVerified: review.isVerified,
      isAnonymous: review.isAnonymous,
      orderNumber: review.order.orderNumber,
      helpfulCount: review.helpfulCount,
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try NextAuth first
    const session = await getServerSession(authOptions);
    let user = null;
    let userEmail = null;

    if (session?.user?.email) {
      userEmail = session.user.email;
    } else {
      // Try custom JWT auth
      const token = request.cookies.get("auth-token")?.value;
      if (token) {
        try {
          const payload = await verifyJWT(token);
          userEmail = payload.email;
        } catch (error) {
          console.log(`JWT verification failed:`, error);
        }
      }
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId || isNaN(Number(productId))) {
      return NextResponse.json({ error: "Valid productId required" }, { status: 400 });
    }

    const { rating, comment, isAnonymous = false, orderId } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    if (!comment || comment.trim().length < 5) {
      return NextResponse.json({ error: "Comment must be at least 5 characters" }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Get user
    user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only allow regular users (not admins) to write reviews
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Administrators cannot write product reviews. Only customers who have purchased the product can write reviews." },
        { status: 403 }
      );
    }

    // Only allow regular users (not admins) to write reviews
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Administrators cannot write product reviews. Only customers who have purchased the product can write reviews." },
        { status: 403 }
      );
    }

    // Verify that the user has purchased this product in the specified order
    const order = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
        userId: user.id,
        status: "DELIVERED", // Only allow reviews for delivered orders
      },
      include: {
        items: {
          where: {
            productId: Number(productId),
          },
        },
      },
    });

    if (!order || order.items.length === 0) {
      return NextResponse.json(
        { error: "You can only review products from your delivered orders" },
        { status: 403 }
      );
    }

    // Check if user has already reviewed this product for this order
    const existingReview = await prisma.productReview.findFirst({
      where: {
        userId: user.id,
        productId: Number(productId),
        orderId: Number(orderId),
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product for this order" },
        { status: 409 }
      );
    }

    // Create the review
    const review = await prisma.productReview.create({
      data: {
        productId: Number(productId),
        userId: user.id,
        orderId: Number(orderId),
        rating: Number(rating),
        comment: String(comment).trim(),
        isAnonymous: Boolean(isAnonymous),
        isVerified: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
          },
        },
      },
    });

    const formattedReview = {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      user: review.isAnonymous ? "Anonymous" : review.user.name || "Anonymous",
      date: review.createdAt.toISOString(),
      isVerified: review.isVerified,
      isAnonymous: review.isAnonymous,
      orderNumber: review.order.orderNumber,
      helpfulCount: review.helpfulCount,
    };

    return NextResponse.json(formattedReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
