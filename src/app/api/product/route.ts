import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: Number(id) } });

    if (product.imageUrl && product.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", product.imageUrl);
      try {
        await unlink(filePath);
      } catch {}
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const p = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { category: true },
      });
      if (!p) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      const result = {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        brand: p.brand,
        category: p.category?.name || null,
        categoryId: p.categoryId,
        discountPrice: p.discountPrice,
        metaDescription: p.metaDescription,
        metaTitle: p.metaTitle,
        promoExpired: p.promoExpired,
        sku: p.sku,
        slug: p.slug,
        stock: p.stock,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
      return NextResponse.json(result);
    } else {
      // Filtering
      const category = searchParams.get("category");
      const price = searchParams.get("price");
      const q = searchParams.get("q");

      interface WhereClause {
        categoryId?: number;
        name?: { contains: string; mode: "insensitive" };
        price?: { lt?: number; gte?: number; lte?: number };
      }

      const where: WhereClause = {};

      if (category && category !== "All") {
        // Assuming category is passed as ID or we need to look it up
        const categoryRecord = await prisma.category.findFirst({
          where: { name: category },
        });
        if (categoryRecord) {
          where.categoryId = categoryRecord.id;
        }
      }
      if (q) {
        where.name = { contains: q, mode: "insensitive" };
      }
      if (price && price !== "all") {
        // price value format: lt{max}, {min}-{max}, gt{min}
        if (price.startsWith("lt")) {
          const max = Number(price.replace("lt", ""));
          if (!isNaN(max)) where.price = { lt: max };
        } else if (price.includes("-")) {
          const [min, max] = price.split("-").map(Number);
          if (!isNaN(min) && !isNaN(max)) where.price = { gte: min, lte: max };
        } else if (price.startsWith("gt")) {
          const min = Number(price.replace("gt", ""));
          if (!isNaN(min)) where.price = { gte: min };
        }
      }
      const products = await prisma.product.findMany({
        where,
        orderBy: { id: "desc" },
        include: { category: true },
      });
      const result = products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        brand: p.brand,
        category: p.category?.name || null,
        categoryId: p.categoryId,
        discountPrice: p.discountPrice,
        metaDescription: p.metaDescription,
        metaTitle: p.metaTitle,
        promoExpired: p.promoExpired,
        sku: p.sku,
        slug: p.slug,
        stock: p.stock,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      return NextResponse.json(result);
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const { id, name, description, price, imageUrl, category, stock, status, sku, brand, slug, metaTitle, metaDescription, discountPrice, promoExpired } = await req.json();

    if (!id || !name || !price) {
      return NextResponse.json({ error: "ID, name, and price are required" }, { status: 400 });
    }

    // Handle category relationship
    let categoryData = {};
    if (category) {
      // First, find or create the category
      const categoryRecord = await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: { name: category },
      });
      categoryData = { categoryId: categoryRecord.id };
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        ...categoryData,
        stock: stock ? Number(stock) : 0,
        status: status || "active",
        sku,
        brand,
        slug,
        metaTitle,
        metaDescription,
        discountPrice: discountPrice === undefined || discountPrice === null || discountPrice === "" ? null : parseFloat(discountPrice),
        promoExpired: promoExpired ? new Date(promoExpired) : null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, price, imageUrl, discountPrice, category, stock, status, sku, brand, slug, metaTitle, metaDescription, promoExpired } = await req.json();

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    // Handle category relationship
    let categoryData = {};
    if (category) {
      // First, find or create the category
      const categoryRecord = await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: { name: category },
      });
      categoryData = { categoryId: categoryRecord.id };
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        discountPrice: discountPrice === undefined || discountPrice === null || discountPrice === "" ? null : parseFloat(discountPrice),
        ...categoryData,
        stock: stock ? Number(stock) : 0,
        status: status || "active",
        sku,
        brand,
        slug,
        metaTitle,
        metaDescription,
        promoExpired: promoExpired ? new Date(promoExpired) : null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
