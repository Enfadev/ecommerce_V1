import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export const maxDuration = 60;

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
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
    const url = new URL(req.url);
    const isGallery = url.searchParams.get("gallery") === "1";

    if (isGallery) {
      const files = formData.getAll("files") as File[];

      if (!files || files.length === 0) {
        return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
      }

      const uploadedUrls: string[] = [];
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        if (!validateFileType(file)) {
          return NextResponse.json(
            {
              error: `Invalid file type for ${file.name}. Only JPEG, PNG, and WebP images are allowed.`,
            },
            { status: 400 }
          );
        }

        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            {
              error: `File ${file.name} too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
            },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const webpBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .resize(1920, 1920, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .toBuffer();

        const sanitizedName = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ""));
        const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${sanitizedName}.webp`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, webpBuffer);
        uploadedUrls.push(`/uploads/${filename}`);
      }

      return NextResponse.json({ urls: uploadedUrls });
    } else {
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
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const webpBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .resize(1920, 1920, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();

      const sanitizedName = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ""));
      const filename = `${Date.now()}-${sanitizedName}.webp`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, webpBuffer);
      const url = `/uploads/${filename}`;

      return NextResponse.json({ url });
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Upload error:", error);
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Upload failed", details: errorMessage }, { status: 500 });
  }
}
