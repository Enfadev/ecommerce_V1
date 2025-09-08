import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId || isNaN(Number(productId))) {
      return NextResponse.json({ error: "Valid productId required" }, { status: 400 });
    }

    // Get review statistics
    const reviewStats = await prisma.productReview.aggregate({
      where: {
        productId: Number(productId),
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    // Get rating distribution
    const ratingDistribution = await prisma.productReview.groupBy({
      by: ['rating'],
      where: {
        productId: Number(productId),
      },
      _count: {
        rating: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    // Format rating distribution
    const distributionMap = ratingDistribution.reduce((acc: Record<number, number>, item: { rating: number; _count: { rating: number } }) => {
      acc[item.rating] = item._count.rating;
      return acc;
    }, {} as Record<number, number>);

    // Ensure all ratings 1-5 are represented
    const fullDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: distributionMap[rating] || 0,
      percentage: reviewStats._count.id > 0 
        ? Math.round(((distributionMap[rating] || 0) / reviewStats._count.id) * 100)
        : 0,
    }));

    const result = {
      averageRating: reviewStats._avg.rating ? Math.round(reviewStats._avg.rating * 10) / 10 : 0,
      totalReviews: reviewStats._count.id,
      distribution: fullDistribution,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching review statistics:", error);
    return NextResponse.json({ error: "Failed to fetch review statistics" }, { status: 500 });
  }
}
