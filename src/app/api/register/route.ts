import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signJWT, setAuthCookie } from "@/lib/jwt";
import { validateInput, registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
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

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);

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
        createdAt: true,
      },
    });

    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        ...user,
        id: user.id,
      },
      message: "Registration successful",
    });

    // Set httpOnly cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Registration error:", error);
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
