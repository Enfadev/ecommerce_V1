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
      } catch {
        // Ignore file deletion errors
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function generateUniqueSlug(name: string, excludeId?: number): Promise<string> {
  const slug = slugify(name);
  let counter = 1;

  while (true) {
    const testSlug = counter === 1 ? slug : `${slug}-${counter}`;
    const existing = await prisma.product.findFirst({
      where: {
        slug: testSlug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (!existing) {
      return testSlug;
    }
    counter++;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (id || slug) {
      const where = id ? { id: Number(id) } : { slug: slug as string };
      const p = await prisma.product.findUnique({
        where,
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
        metaKeywords: p.metaKeywords,
        ogTitle: p.ogTitle,
        ogDescription: p.ogDescription,
        ogImageUrl: p.ogImageUrl,
        canonicalUrl: p.canonicalUrl,
        noindex: p.noindex,
        structuredData: p.structuredData,
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
        metaKeywords: p.metaKeywords,
        ogTitle: p.ogTitle,
        ogDescription: p.ogDescription,
        ogImageUrl: p.ogImageUrl,
        canonicalUrl: p.canonicalUrl,
        noindex: p.noindex,
        structuredData: p.structuredData,
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
      slug: providedSlug,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogTitle,
      ogDescription,
      ogImageUrl,
      canonicalUrl,
      noindex,
      structuredData,
      discountPrice,
      promoExpired,
      gallery,
    } = await req.json();

    if (!id || !name || !price) {
      return NextResponse.json({ error: "ID, name, and price are required" }, { status: 400 });
    }

    // Generate slug from name if not provided or if name changed
    const currentProduct = await prisma.product.findUnique({ where: { id: Number(id) } });
    let slug = providedSlug;

    if (!slug || (currentProduct && currentProduct.name !== name)) {
      slug = await generateUniqueSlug(name, Number(id));
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

    const updateData: { [key: string]: unknown } = {
      name,
      description,
      price: parseFloat(price),
      ...categoryData,
      stock: stock ? Number(stock) : 0,
      status: status || "active",
      sku,
      brand,
      slug,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogTitle,
      ogDescription,
      ogImageUrl,
      canonicalUrl,
      noindex: typeof noindex === "boolean" ? noindex : undefined,
      structuredData,
      discountPrice: discountPrice === undefined || discountPrice === null || discountPrice === "" ? null : parseFloat(discountPrice),
      promoExpired: promoExpired ? new Date(promoExpired) : null,
    };

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
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

    const u = updatedProduct as unknown as { [key: string]: unknown };
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
      metaKeywords: u.metaKeywords,
      ogTitle: u.ogTitle,
      ogDescription: u.ogDescription,
      ogImageUrl: u.ogImageUrl,
      canonicalUrl: u.canonicalUrl,
      noindex: u.noindex,
      structuredData: u.structuredData,
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
    const {
      name,
      description,
      price,
      imageUrl,
      discountPrice,
      category,
      stock,
      status,
      sku,
      brand,
      slug: providedSlug,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogTitle,
      ogDescription,
      ogImageUrl,
      canonicalUrl,
      noindex,
      structuredData,
      promoExpired,
      gallery,
    } = await req.json();

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    // Generate slug from name if not provided
    const slug = providedSlug || (await generateUniqueSlug(name));

    let categoryIdVal: number | undefined;
    if (category) {
      const categoryRecord = await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: { name: category },
      });
      categoryIdVal = categoryRecord.id;
    }

    const data: Record<string, unknown> = {
      name,
      price: parseFloat(price),
      stock: stock ? Number(stock) : 0,
      status: status || "active",
      slug,
    };

    if (description !== undefined) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (categoryIdVal !== undefined) data.categoryId = categoryIdVal;
    if (sku !== undefined) data.sku = sku;
    if (brand !== undefined) data.brand = brand;
    if (metaTitle !== undefined) data.metaTitle = metaTitle;
    if (metaDescription !== undefined) data.metaDescription = metaDescription;
    if (metaKeywords !== undefined) data.metaKeywords = metaKeywords;
    if (ogTitle !== undefined) data.ogTitle = ogTitle;
    if (ogDescription !== undefined) data.ogDescription = ogDescription;
    if (ogImageUrl !== undefined) data.ogImageUrl = ogImageUrl;
    if (canonicalUrl !== undefined) data.canonicalUrl = canonicalUrl;
    if (typeof noindex === "boolean") data.noindex = noindex;
    if (discountPrice !== undefined && discountPrice !== null && discountPrice !== "") {
      data.discountPrice = parseFloat(discountPrice);
    } else if (discountPrice === null) {
      data.discountPrice = null;
    }
    if (promoExpired) data.promoExpired = new Date(promoExpired);
    if (structuredData !== undefined && structuredData !== null) {
      try {
        data.structuredData = typeof structuredData === "string" ? JSON.parse(structuredData) : structuredData;
      } catch {
        data.structuredData = structuredData as unknown;
      }
    }

    const product = await prisma.product.create({
      data: data as unknown as Prisma.ProductCreateArgs["data"],
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

    const p = productWithImages as unknown as { [key: string]: unknown };
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
      metaKeywords: p.metaKeywords,
      ogTitle: p.ogTitle,
      ogDescription: p.ogDescription,
      ogImageUrl: p.ogImageUrl,
      canonicalUrl: p.canonicalUrl,
      noindex: p.noindex,
      structuredData: p.structuredData,
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
