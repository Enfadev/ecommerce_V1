import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Contoh API route untuk mengambil semua produk
type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    // pastikan hasil sesuai tipe Product
    const result: Product[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data produk' }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const { name, description, price, imageUrl } = await req.json();
    if (!name || !price) {
      return NextResponse.json({ error: 'Nama dan harga produk wajib diisi' }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah produk' }, { status: 500 });
  }
}
