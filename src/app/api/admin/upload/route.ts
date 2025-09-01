import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB for logos
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg"];

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

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No auth token provided" },
        { status: 401 }
      );
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'logo' or other types

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    if (!validateFileType(file)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size must be less than 2MB" },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "admin");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = sanitizeFilename(file.name);
    const extension = path.extname(sanitizedName);
    const baseName = path.basename(sanitizedName, extension);
    const fileName = `${type}-${timestamp}-${baseName}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image (except SVG)
    if (file.type !== "image/svg+xml") {
      try {
        // Process with Sharp for optimization
        const processedBuffer = await sharp(buffer)
          .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 90 })
          .png({ quality: 90 })
          .webp({ quality: 90 })
          .toBuffer();

        await writeFile(filePath, processedBuffer);
      } catch (sharpError) {
        console.warn("Sharp processing failed, saving original file:", sharpError);
        await writeFile(filePath, buffer);
      }
    } else {
      // For SVG files, save as-is
      await writeFile(filePath, buffer);
    }

    // Return the public URL
    const publicUrl = `/uploads/admin/${fileName}`;

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      url: publicUrl,
      filename: fileName,
      type: file.type,
      size: file.size
    });

  } catch (error) {
    console.error("Admin upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
