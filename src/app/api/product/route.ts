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

    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: Number(id) },
    });

    if (orderItemsCount > 0) {
      return NextResponse.json({ error: "Cannot delete product that has been ordered. Consider changing the status to inactive instead." }, { status: 400 });
    }

    await prisma.product.delete({ where: { id: Number(id) } });

    if (product.imageUrl && product.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", product.imageUrl);
      try {
        await unlink(filePath);
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
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
        include: { category: true, images: true },
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
        gallery: p.images.map((img) => img.url),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
      return NextResponse.json(result);
    } else {
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
        include: { category: true, images: true },
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
        gallery: p.images.map((img) => img.url),
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
    const { id, name, description, price, imageUrl, category, stock, status, sku, brand, slug, metaTitle, metaDescription, discountPrice, promoExpired, gallery } = await req.json();

    if (!id || !name || !price) {
      return NextResponse.json({ error: "ID, name, and price are required" }, { status: 400 });
    }

    let categoryData = {};
    if (category) {
      const categoryRecord = await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: { name: category },
      });
      categoryData = { categoryId: categoryRecord.id };
    }

    await prisma.product.update({
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
      include: { category: true, images: true },
    });

    if (gallery && Array.isArray(gallery)) {
      await prisma.productImage.deleteMany({
        where: { productId: Number(id) },
      });

      if (gallery.length > 0) {
        await prisma.productImage.createMany({
          data: gallery.map((url: string) => ({
            url,
            productId: Number(id),
          })),
        });
      }
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true, images: true },
    });

    const result = {
      id: updatedProduct!.id,
      name: updatedProduct!.name,
      description: updatedProduct!.description,
      price: updatedProduct!.price,
      imageUrl: updatedProduct!.imageUrl,
      brand: updatedProduct!.brand,
      category: updatedProduct!.category?.name || null,
      categoryId: updatedProduct!.categoryId,
      discountPrice: updatedProduct!.discountPrice,
      metaDescription: updatedProduct!.metaDescription,
      metaTitle: updatedProduct!.metaTitle,
      promoExpired: updatedProduct!.promoExpired,
      sku: updatedProduct!.sku,
      slug: updatedProduct!.slug,
      stock: updatedProduct!.stock,
      status: updatedProduct!.status,
      gallery: updatedProduct!.images.map((img) => img.url),
      createdAt: updatedProduct!.createdAt,
      updatedAt: updatedProduct!.updatedAt,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, price, imageUrl, discountPrice, category, stock, status, sku, brand, slug, metaTitle, metaDescription, promoExpired, gallery } = await req.json();

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    let categoryData = {};
    if (category) {
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
      include: { category: true, images: true },
    });

    if (gallery && Array.isArray(gallery) && gallery.length > 0) {
      await prisma.productImage.createMany({
        data: gallery.map((url: string) => ({
          url,
          productId: product.id,
        })),
      });
    }

    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: { category: true, images: true },
    });

    const result = {
      id: productWithImages!.id,
      name: productWithImages!.name,
      description: productWithImages!.description,
      price: productWithImages!.price,
      imageUrl: productWithImages!.imageUrl,
      brand: productWithImages!.brand,
      category: productWithImages!.category?.name || null,
      categoryId: productWithImages!.categoryId,
      discountPrice: productWithImages!.discountPrice,
      metaDescription: productWithImages!.metaDescription,
      metaTitle: productWithImages!.metaTitle,
      promoExpired: productWithImages!.promoExpired,
      sku: productWithImages!.sku,
      slug: productWithImages!.slug,
      stock: productWithImages!.stock,
      status: productWithImages!.status,
      gallery: productWithImages!.images.map((img) => img.url),
      createdAt: productWithImages!.createdAt,
      updatedAt: productWithImages!.updatedAt,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (!status || !["active", "inactive"].includes(status)) {
      return NextResponse.json({ error: "Valid status is required (active/inactive)" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Update product status error:", error);
    return NextResponse.json({ error: "Failed to update product status" }, { status: 500 });
  }
}
