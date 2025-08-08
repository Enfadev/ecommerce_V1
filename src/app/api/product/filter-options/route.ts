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

  // Buat rentang harga (bisa disesuaikan)
  const priceRanges = [
    { label: 'All', min: null, max: null },
    { label: '< $200', min: null, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: '> $500', min: 500, max: null },
  ];

  return NextResponse.json({
    categories: categories.map(c => c.name),
    priceRanges,
    minPrice,
    maxPrice,
  });
}
