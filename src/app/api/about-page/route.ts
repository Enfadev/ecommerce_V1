import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const aboutPage = await prisma.aboutPage.findFirst();
    return NextResponse.json(aboutPage);
  } catch (error) {
    console.error("Error fetching about page:", error);
    return NextResponse.json({ error: "Failed to fetch about page" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const aboutPage = await prisma.aboutPage.create({
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        companyStory: body.companyStory,
        mission: body.mission,
        vision: body.vision,
        values: body.values || [],
        statistics: body.statistics || [],
        features: body.features || [],
        teamMembers: body.teamMembers || [],
        timeline: body.timeline || [],
        // SEO fields
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

    return NextResponse.json(aboutPage);
  } catch (error) {
    console.error("Error creating about page:", error);
    return NextResponse.json({ error: "Failed to create about page" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updated = await prisma.aboutPage.update({
      where: { id: body.id },
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        companyStory: body.companyStory,
        mission: body.mission,
        vision: body.vision,
        values: body.values || [],
        statistics: body.statistics || [],
        features: body.features || [],
        teamMembers: body.teamMembers || [],
        timeline: body.timeline || [],
        // SEO fields
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
    console.error("Error updating about page:", error);
    return NextResponse.json({ error: "Failed to update about page" }, { status: 500 });
  }
}
