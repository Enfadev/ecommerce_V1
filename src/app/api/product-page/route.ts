import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const productPage = await prisma.productPage.findFirst();
    return NextResponse.json(productPage);
  } catch (error) {
    console.error("Error fetching product page:", error);
    return NextResponse.json({ error: "Failed to fetch product page" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const productPage = await prisma.productPage.create({
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        featuredCategories: body.featuredCategories || [],
        promotionalBanner: body.promotionalBanner || {},
        filterOptions: body.filterOptions || [],
        sortOptions: body.sortOptions || [],
        seoContent: body.seoContent || [],
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        metaKeywords: body.metaKeywords || null,
        ogTitle: body.ogTitle || null,
        ogDescription: body.ogDescription || null,
        ogImageUrl: body.ogImageUrl || null,
        canonicalUrl: body.canonicalUrl || null,
        noindex: body.noindex || false,
      },
    });

    return NextResponse.json(productPage);
  } catch (error) {
    console.error("Error creating product page:", error);
    return NextResponse.json({ error: "Failed to create product page" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updated = await prisma.productPage.update({
      where: { id: body.id },
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        featuredCategories: body.featuredCategories || [],
        promotionalBanner: body.promotionalBanner || {},
        filterOptions: body.filterOptions || [],
        sortOptions: body.sortOptions || [],
        seoContent: body.seoContent || [],
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        metaKeywords: body.metaKeywords || null,
        ogTitle: body.ogTitle || null,
        ogDescription: body.ogDescription || null,
        ogImageUrl: body.ogImageUrl || null,
        canonicalUrl: body.canonicalUrl || null,
        noindex: body.noindex || false,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product page:", error);
    return NextResponse.json({ error: "Failed to update product page" }, { status: 500 });
  }
}
