import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Ambil kategori unik dari produk
  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  // Ambil rentang harga minimum dan maksimum
  const prices = await prisma.product.findMany({
    select: { price: true },
  });
  const priceValues = prices.map(p => p.price);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);

  // Buat rentang harga (bisa disesuaikan)
  const priceRanges = [
    { label: 'All', min: null, max: null },
    { label: '< Rp200,000', min: null, max: 200000 },
    { label: 'Rp200,000 - Rp500,000', min: 200000, max: 500000 },
    { label: '> Rp500,000', min: 500000, max: null },
  ];

  return NextResponse.json({
    categories: categories.map(c => c.category),
    priceRanges,
    minPrice,
    maxPrice,
  });
}
