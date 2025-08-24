import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    
    console.log("🗑️ Delete avatar request received");
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

    // Get user's current avatar from database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.id) },
      select: { id: true, image: true, name: true }
    });

    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("👤 User found:", user.name);
    console.log("🖼️ Current avatar:", user.image);

    // If user has an uploaded image (not generated avatar), delete the file
    if (user.image && user.image.startsWith('/uploads/')) {
      const filename = user.image.replace('/uploads/', '');
      const filepath = join(process.cwd(), "public", "uploads", filename);
      
      console.log("📁 Attempting to delete file:", filepath);
      
      if (existsSync(filepath)) {
        try {
          await unlink(filepath);
          console.log("✅ File deleted successfully");
        } catch (fileError) {
          console.error("⚠️ Failed to delete file:", fileError);
          // Continue anyway - we'll still update the database
        }
      } else {
        console.log("⚠️ File doesn't exist, skipping file deletion");
      }
    }

    // Generate new default avatar URL based on user's name
    const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366f1&color=fff&size=200`;

    // Update user's image field in database to default avatar
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        image: defaultAvatarUrl,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        address: true,
        dateOfBirth: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    console.log("✅ Avatar reset to default successfully");

    return NextResponse.json({ 
      success: true,
      message: "Avatar deleted successfully",
      user: {
        ...updatedUser,
        id: updatedUser.id.toString(),
      }
    });

  } catch (error) {
    console.error("❌ Delete avatar error:", error);
    return NextResponse.json({ 
      error: "Failed to delete avatar",
      details: process.env.NODE_ENV === "development" ? String(error) : undefined
    }, { status: 500 });
  }
}
