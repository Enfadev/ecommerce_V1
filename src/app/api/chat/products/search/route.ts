import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    if (!query.trim()) {
      return NextResponse.json({ products: [], hasMore: false });
    }

    const products = await (prisma as any).product.findMany({
      where: {
        AND: [
          { status: "active" },
          {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
              { brand: { contains: query } },
              { sku: { contains: query } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discountPrice: true,
        imageUrl: true,
        stock: true,
        brand: true,
        sku: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const hasMore = products.length === limit;

    return NextResponse.json({
      products,
      hasMore,
      currentPage: page,
      query,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
