import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
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
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
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
    return NextResponse.json({ error: 'Failed to fetch product data' }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const {
      id,
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
      status,
      sku,
      brand,
      slug,
      metaTitle,
      metaDescription,
      hargaDiskon,
      promoExpired,
      gallery
    } = await req.json();
    if (!id || !name || !price) {
      return NextResponse.json({ error: 'ID, name, and price are required' }, { status: 400 });
    }
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
        stock,
        status,
        sku,
        brand,
        slug,
        metaTitle,
        metaDescription,
        hargaDiskon: hargaDiskon === undefined || hargaDiskon === null || hargaDiskon === '' ? null : parseFloat(hargaDiskon),
        promoExpired,
        gallery,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, price, imageUrl } = await req.json();
    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        hargaDiskon: hargaDiskon === undefined || hargaDiskon === null || hargaDiskon === '' ? null : parseFloat(hargaDiskon),
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
