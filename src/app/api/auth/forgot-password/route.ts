import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: true,
          message: "If an account exists with this email, you will receive a password reset link."
        },
        { status: 200 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "This account uses OAuth authentication. Please sign in with your social account." },
        { status: 400 }
      );
    }

    await prisma.passwordResetToken.deleteMany({
      where: {
        email,
        used: false,
      },
    });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expires,
      },
    });

    const emailResult = await sendPasswordResetEmail({
      email,
      resetToken,
      userName: user.name || undefined,
    });

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send password reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Password reset email sent successfully. Please check your inbox.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
