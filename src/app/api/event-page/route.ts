import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const eventPage = await prisma.eventPage.findFirst();
    return NextResponse.json(eventPage);
  } catch (error) {
    console.error("Error fetching event page:", error);
    return NextResponse.json({ error: "Failed to fetch event page" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const eventPage = await prisma.eventPage.create({
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        activeEvents: body.activeEvents || [],
        upcomingEvents: body.upcomingEvents || [],
        pastEvents: body.pastEvents || [],
        eventCategories: body.eventCategories || [],
      },
    });
    
    return NextResponse.json(eventPage);
  } catch (error) {
    console.error("Error creating event page:", error);
    return NextResponse.json({ error: "Failed to create event page" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    const updated = await prisma.eventPage.update({
      where: { id: body.id },
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroDescription: body.heroDescription,
        activeEvents: body.activeEvents || [],
        upcomingEvents: body.upcomingEvents || [],
        pastEvents: body.pastEvents || [],
        eventCategories: body.eventCategories || [],
      },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating event page:", error);
    return NextResponse.json({ error: "Failed to update event page" }, { status: 500 });
  }
}
