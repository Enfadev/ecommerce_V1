import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from '@/lib/database';

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "No auth token provided" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("fileUrl");

    if (!fileUrl) {
      return NextResponse.json({ success: false, message: "File URL is required" }, { status: 400 });
    }

    const urlPath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
    const filePath = path.join(process.cwd(), "public", urlPath);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "admin");
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(uploadsDir);

    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return NextResponse.json({ success: false, message: "Invalid file path" }, { status: 403 });
    }

    try {
      await unlink(resolvedPath);

      if (fileUrl.includes("/uploads/admin/")) {
        try {
          await prisma.$executeRaw`
            UPDATE system_settings 
            SET logoUrl = NULL,
                updatedAt = NOW()
            WHERE logoUrl = ${fileUrl}
          `;
        } catch (dbError) {
          console.warn("Failed to clear logo from database:", dbError);
        }
      }

      return NextResponse.json({
        success: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        return NextResponse.json({
          success: true,
          message: "File not found (already deleted)",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete file" }, { status: 500 });
  }
}
