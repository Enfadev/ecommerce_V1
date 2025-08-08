import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Ambil kategori dari tabel Category
  const categories = await prisma.category.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
  });

  // Ambil rentang harga minimum dan maksimum
  const prices = await prisma.product.findMany({
    select: { price: true },
  });
  const priceValues = prices.map(p => p.price);
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;

  // Buat rentang harga dinamis
  let priceRanges = [{ label: 'All', min: null, max: null }];
  if (minPrice !== maxPrice && priceValues.length > 0) {
    // Bagi menjadi 3 interval
    const step = Math.ceil((maxPrice - minPrice) / 3);
    const lowMax = minPrice + step;
    const midMax = minPrice + step * 2;
    priceRanges = [
      { label: `< $${lowMax}`, min: null, max: lowMax },
      { label: `$${lowMax} - $${midMax}`, min: lowMax, max: midMax },
      { label: `> $${midMax}`, min: midMax, max: null },
    ];
    priceRanges.unshift({ label: 'All', min: null, max: null });
  }

  return NextResponse.json({
    categories: categories.map(c => c.name),
    priceRanges,
    minPrice,
    maxPrice,
  });
}
