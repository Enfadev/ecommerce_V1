import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { verifyJWT } from "@/lib/jwt";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication - check auth-token cookie specifically
    const token = request.cookies.get("auth-token")?.value;
    
    console.log("🍪 Available cookies:", Array.from(request.cookies.getAll()).map(c => c.name));
    console.log("🔑 Auth-token found:", !!token);
    
    if (!token) {
      console.log("❌ No authentication token found");
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      console.log("❌ JWT verification failed");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    console.log("✅ User authenticated:", decoded.email);

    const formData = await request.formData();
    const file = formData.get("image") as File;

    console.log("📁 Form data received, file exists:", !!file);
    console.log("📁 File details:", file ? { name: file.name, type: file.type, size: file.size } : 'No file');

    if (!file) {
      console.log("❌ No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      console.log("❌ Invalid file type:", file.type);
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log("❌ File too large:", file.size, "bytes");
      return NextResponse.json({ error: "File size too large" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    console.log("📂 Upload directory:", uploadDir);
    
    if (!existsSync(uploadDir)) {
      console.log("📂 Creating uploads directory...");
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename with .webp extension
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remove original extension
    const filename = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}.webp`;
    const filepath = join(uploadDir, filename);
    
    console.log("📝 Original filename:", file.name);
    console.log("📝 Generated WebP filename:", filename);
    console.log("📝 Full filepath:", filepath);

    // Convert image to WebP format using Sharp
    console.log("� Converting image to WebP format...");
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Process image with Sharp - convert to WebP with optimization
      const processedBuffer = await sharp(buffer)
        .resize(400, 400, { 
          fit: 'cover', 
          position: 'center',
          withoutEnlargement: false 
        })
        .webp({ 
          quality: 85, 
          effort: 6 
        })
        .toBuffer();
      
      console.log("📊 Original size:", buffer.length, "bytes");
      console.log("📊 Processed size:", processedBuffer.length, "bytes");
      console.log("📊 Size reduction:", Math.round((1 - processedBuffer.length / buffer.length) * 100) + "%");
      
      // Save processed image
      console.log("💾 Writing processed WebP file to disk...");
      await writeFile(filepath, processedBuffer);
      
    } catch (sharpError) {
      console.error("❌ Sharp processing error:", sharpError);
      return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
    
    console.log("✅ File saved successfully");

    // Return the URL path
    const url = `/uploads/${filename}`;
    console.log("🔗 Generated URL:", url);
    
    return NextResponse.json({ 
      success: true,
      url: url,
      message: "Image uploaded successfully" 
    });

  } catch (error) {
    console.error("❌ Upload error:", error);
    console.error("❌ Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json({ 
      error: "Upload failed",
      details: process.env.NODE_ENV === "development" ? String(error) : undefined
    }, { status: 500 });
  }
}
