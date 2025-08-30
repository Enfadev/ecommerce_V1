import { NextRequest, NextResponse } from "next/server";

let reviews: Record<string, Array<{ rating: number; comment: string; user?: string; date: string }>> = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  return NextResponse.json(reviews[productId] || []);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const { rating, comment, user } = await request.json();

  if (!rating || !comment) {
    return NextResponse.json({ error: "Rating & comment required" }, { status: 400 });
  }

  const review = {
    rating: Number(rating),
    comment: String(comment),
    user: user || "Anonim",
    date: new Date().toISOString(),
  };

  if (!reviews[productId]) reviews[productId] = [];
  reviews[productId].unshift(review);

  return NextResponse.json(review, { status: 201 });
}
