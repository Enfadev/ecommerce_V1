import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });

  const prices = await prisma.product.findMany({
    select: { price: true },
  });
  const priceValues = prices.map((p) => p.price);
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;

  let priceRanges: Array<{ label: string; min: number | null; max: number | null }> = [{ label: "All", min: null, max: null }];

  if (minPrice !== maxPrice && priceValues.length > 0) {
    const step = Math.ceil((maxPrice - minPrice) / 3);
    const lowMax = minPrice + step;
    const midMax = minPrice + step * 2;
    const round50 = (num: number) => Math.round(num / 50) * 50;
    const lowMax50 = round50(lowMax);
    const midMax50 = round50(midMax);
    priceRanges = [
      { label: `< $${lowMax50}`, min: null, max: lowMax50 },
      { label: `$${lowMax50} - $${midMax50}`, min: lowMax50, max: midMax50 },
      { label: `> $${midMax50}`, min: midMax50, max: null },
    ];
    priceRanges.unshift({ label: "All", min: null, max: null });
  }

  return NextResponse.json({
    categories: categories.map((c) => c.name),
    priceRanges,
    minPrice,
    maxPrice,
  });
}
