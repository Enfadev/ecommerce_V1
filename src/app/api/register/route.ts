import { NextResponse, NextRequest } from "next/server";
import { validateInput, registerSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();

    const validation = validateInput(registerSchema, requestData);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.errors?.[0] || "Validation failed",
          allErrors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data!;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    return NextResponse.json({
      user,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
