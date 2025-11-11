import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { existsSync } from "fs";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .replace(/\.+/g, ".")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function validateFileType(file: File): boolean {
  const extension = path.extname(file.name).toLowerCase();
  const isExtensionAllowed = ALLOWED_EXTENSIONS.includes(extension);
  const isTypeAllowed = ALLOWED_FILE_TYPES.includes(file.type);

  return isTypeAllowed || isExtensionAllowed;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!validateFileType(file)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", "carousel");
    await mkdir(uploadDir, { recursive: true });

    // Optimize for carousel (wider aspect ratio)
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85 })
      .resize(1920, 1080, {
        fit: "cover",
        position: "center",
      })
      .toBuffer();

    const sanitizedName = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ""));
    const filename = `carousel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${sanitizedName}.webp`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, webpBuffer);
    const url = `/uploads/carousel/${filename}`;

    return NextResponse.json({
      url,
      message: "Carousel image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload carousel error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Upload failed", details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl || !imageUrl.startsWith("/uploads/carousel/")) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    const filename = imageUrl.replace("/uploads/carousel/", "");
    const filepath = path.join(process.cwd(), "public", "uploads", "carousel", filename);

    if (existsSync(filepath)) {
      await unlink(filepath);
      return NextResponse.json({ message: "Image deleted successfully" });
    }

    return NextResponse.json({ error: "File not found" }, { status: 404 });
  } catch (error) {
    console.error("Delete carousel error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
