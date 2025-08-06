import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Contoh API route untuk mengambil semua produk
type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET() {
  try {
    const products: Product[] = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data produk' }, { status: 500 });
  }
}
