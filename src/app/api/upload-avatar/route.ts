import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { verifyJWT } from "@/lib/jwt";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large" }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), "public", "uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const filename = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}.webp`;
    const filepath = join(uploadDir, filename);

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const processedBuffer = await sharp(buffer)
        .resize(400, 400, {
          fit: "cover",
          position: "center",
          withoutEnlargement: false,
        })
        .webp({
          quality: 85,
          effort: 6,
        })
        .toBuffer();

      await writeFile(filepath, processedBuffer);
    } catch (sharpError) {
      console.error("❌ Sharp processing error:", sharpError);
      return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }

    const url = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: url,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    console.error("❌ Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    return NextResponse.json(
      {
        error: "Upload failed",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
