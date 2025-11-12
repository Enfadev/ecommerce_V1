import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contactPage = await prisma.contactPage.findFirst();
    return NextResponse.json(contactPage);
  } catch (error) {
    console.error("Error fetching contact page:", error);
    return NextResponse.json({ error: "Failed to fetch contact page" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const contactPage = await prisma.contactPage.create({
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        contactMethods: body.contactMethods || [],
        officeLocations: body.officeLocations || [],
        businessHours: body.businessHours || [],
        socialMedia: body.socialMedia || [],
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

    return NextResponse.json(contactPage);
  } catch (error) {
    console.error("Error creating contact page:", error);
    return NextResponse.json({ error: "Failed to create contact page" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updated = await prisma.contactPage.update({
      where: { id: body.id },
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        contactMethods: body.contactMethods || [],
        officeLocations: body.officeLocations || [],
        businessHours: body.businessHours || [],
        socialMedia: body.socialMedia || [],
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
    console.error("Error updating contact page:", error);
    return NextResponse.json({ error: "Failed to update contact page" }, { status: 500 });
  }
}
