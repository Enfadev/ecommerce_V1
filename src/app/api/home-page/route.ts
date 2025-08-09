import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const homePage = await prisma.homePage.findFirst();
    return NextResponse.json(homePage);
  } catch (error) {
    console.error("Error fetching home page:", error);
    return NextResponse.json({ error: "Failed to fetch home page" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const homePage = await prisma.homePage.create({
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        heroSlides: body.heroSlides || [],
        features: body.features || [],
        statsData: body.statsData || [],
        aboutPreview: body.aboutPreview || {},
        testimonialsData: body.testimonialsData || [],
      },
    });
    
    return NextResponse.json(homePage);
  } catch (error) {
    console.error("Error creating home page:", error);
    return NextResponse.json({ error: "Failed to create home page" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    const updated = await prisma.homePage.update({
      where: { id: body.id },
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        heroSlides: body.heroSlides || [],
        features: body.features || [],
        statsData: body.statsData || [],
        aboutPreview: body.aboutPreview || {},
        testimonialsData: body.testimonialsData || [],
      },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating home page:", error);
    return NextResponse.json({ error: "Failed to update home page" }, { status: 500 });
  }
}
