import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID produk wajib diisi' }, { status: 400 });
    }
    
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }
    
    await prisma.product.delete({ where: { id: Number(id) } });
    
    if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', product.imageUrl);
      try {
        await unlink(filePath);
      } catch {}
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const p = await prisma.product.findUnique({ where: { id: Number(id) } });
      if (!p) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      const result = {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.imageUrl,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
      return NextResponse.json(result);
    } else {
      const products = await prisma.product.findMany();
      const result = products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      return NextResponse.json(result);
    }
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
