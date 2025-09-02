import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { optimize } from "svgo";
import { prisma } from "@/lib/prisma";

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
      return NextResponse.json({ success: false, message: "No auth token provided" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'logo' or other types

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Auto-handle logo replacement for logo uploads
    let oldLogoUrl = null;
    if (type === "logo") {
      // Get current logo from database
      const settings = await prisma.$queryRaw`SELECT logoUrl FROM system_settings LIMIT 1`;
      const settingsData = Array.isArray(settings) ? settings[0] : settings;
      oldLogoUrl = settingsData?.logoUrl;
    }

    // Delete old logo file if this is a logo upload and there's an existing logo
    if (type === "logo" && oldLogoUrl && oldLogoUrl !== "null") {
      try {
        const urlPath = oldLogoUrl.startsWith("/") ? oldLogoUrl.substring(1) : oldLogoUrl;
        const oldFilePath = path.join(process.cwd(), "public", urlPath);
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "admin");
        const resolvedOldPath = path.resolve(oldFilePath);
        const resolvedUploadsDir = path.resolve(uploadsDir);

        if (resolvedOldPath.startsWith(resolvedUploadsDir)) {
          await unlink(resolvedOldPath);
          console.log("Old logo file deleted:", oldLogoUrl);
        }
      } catch (deleteError) {
        console.warn("Failed to delete old logo file:", deleteError);
        // Continue with upload even if delete fails
      }
    }

    // Validate file
    if (!validateFileType(file)) {
      return NextResponse.json({ success: false, message: "Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: "File size must be less than 2MB" }, { status: 400 });
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
        // Convert all raster images to WebP for optimal compression
        const webpFileName = `${type}-${timestamp}-${baseName}.webp`;
        const webpFilePath = path.join(uploadDir, webpFileName);

        const processedBuffer = await sharp(buffer)
          .resize(400, 400, {
            fit: "inside",
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255, alpha: 0 }, // Transparent background
          })
          .webp({
            quality: 85, // Good balance between quality and size
            effort: 6, // High compression effort
            lossless: false,
          })
          .toBuffer();

        await writeFile(webpFilePath, processedBuffer);

        // Update filename and public URL to WebP
        const publicUrl = `/uploads/admin/${webpFileName}`;

        // Auto-update database if this is a logo upload
        if (type === "logo") {
          try {
            const settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
            const settingsData = Array.isArray(settings) ? settings[0] : settings;

            if (settingsData?.id) {
              await prisma.$executeRaw`
                UPDATE system_settings 
                SET logoUrl = ${publicUrl},
                    updatedAt = NOW()
                WHERE id = ${settingsData.id}
              `;
            } else {
              await prisma.$executeRaw`
                INSERT INTO system_settings (storeName, storeDescription, contactEmail, timezone, logoUrl, enableTwoFactor, sessionTimeout, version, createdAt, updatedAt)
                VALUES ('E-Commerce Store', 'Trusted online store', 'contact@store.com', 'Asia/Jakarta', ${publicUrl}, false, 24, '1.0.0', NOW(), NOW())
              `;
            }
          } catch (dbError) {
            console.error("Failed to update logo in database:", dbError);
            // Continue with response even if database update fails
          }
        }

        return NextResponse.json({
          success: true,
          message: "File uploaded and optimized to WebP successfully",
          url: publicUrl,
          filename: webpFileName,
          originalType: file.type,
          optimizedType: "image/webp",
          size: processedBuffer.length,
          originalSize: file.size,
        });
      } catch (sharpError) {
        console.warn("Sharp processing failed, saving original file:", sharpError);
        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/admin/${fileName}`;
        return NextResponse.json({
          success: true,
          message: "File uploaded (original format - optimization failed)",
          url: publicUrl,
          filename: fileName,
          type: file.type,
          size: file.size,
        });
      }
    } else {
      // For SVG files, optimize and minify
      try {
        const svgString = buffer.toString("utf-8");
        const optimizedSvg = optimize(svgString, {
          plugins: [
            "preset-default",
            "removeDimensions", // Remove width/height to make responsive
            "removeViewBox", // Keep viewBox for scaling
          ],
        });

        const optimizedBuffer = Buffer.from(optimizedSvg.data, "utf-8");
        await writeFile(filePath, optimizedBuffer);

        const publicUrl = `/uploads/admin/${fileName}`;

        // Auto-update database if this is a logo upload
        if (type === "logo") {
          try {
            const settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
            const settingsData = Array.isArray(settings) ? settings[0] : settings;

            if (settingsData?.id) {
              await prisma.$executeRaw`
                UPDATE system_settings 
                SET logoUrl = ${publicUrl},
                    updatedAt = NOW()
                WHERE id = ${settingsData.id}
              `;
            } else {
              await prisma.$executeRaw`
                INSERT INTO system_settings (storeName, storeDescription, contactEmail, timezone, logoUrl, enableTwoFactor, sessionTimeout, version, createdAt, updatedAt)
                VALUES ('E-Commerce Store', 'Trusted online store', 'contact@store.com', 'Asia/Jakarta', ${publicUrl}, false, 24, '1.0.0', NOW(), NOW())
              `;
            }
          } catch (dbError) {
            console.error("Failed to update logo in database:", dbError);
            // Continue with response even if database update fails
          }
        }

        const savedBytes = buffer.length - optimizedBuffer.length;
        const savedPercent = Math.round((savedBytes / buffer.length) * 100);

        return NextResponse.json({
          success: true,
          message: `SVG optimized successfully (saved ${savedPercent}%)`,
          url: publicUrl,
          filename: fileName,
          type: file.type,
          size: optimizedBuffer.length,
          originalSize: buffer.length,
        });
      } catch (svgError) {
        console.warn("SVG optimization failed, saving original:", svgError);
        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/admin/${fileName}`;

        // Auto-update database if this is a logo upload
        if (type === "logo") {
          try {
            const settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
            const settingsData = Array.isArray(settings) ? settings[0] : settings;

            if (settingsData?.id) {
              await prisma.$executeRaw`
                UPDATE system_settings 
                SET logoUrl = ${publicUrl},
                    updatedAt = NOW()
                WHERE id = ${settingsData.id}
              `;
            } else {
              await prisma.$executeRaw`
                INSERT INTO system_settings (storeName, storeDescription, contactEmail, timezone, logoUrl, enableTwoFactor, sessionTimeout, version, createdAt, updatedAt)
                VALUES ('E-Commerce Store', 'Trusted online store', 'contact@store.com', 'Asia/Jakarta', ${publicUrl}, false, 24, '1.0.0', NOW(), NOW())
              `;
            }
          } catch (dbError) {
            console.error("Failed to update logo in database:", dbError);
            // Continue with response even if database update fails
          }
        }
        return NextResponse.json({
          success: true,
          message: "SVG file uploaded (optimization failed)",
          url: publicUrl,
          filename: fileName,
          type: file.type,
          size: file.size,
        });
      }
    }
  } catch (error) {
    console.error("Admin upload error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
