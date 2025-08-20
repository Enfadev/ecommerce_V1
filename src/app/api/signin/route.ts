import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { signJWT, setAuthCookie } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const valid = await compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = await signJWT({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    // Prepare user data (exclude password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userData } = user;

    // Create response and set cookie
    const response = NextResponse.json({
      user: {
        ...userData,
        id: userData.id.toString(),
      },
      message: "Sign in successful",
    });

    // Set httpOnly cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    // Only log detailed errors in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Sign in error:", error);
    }
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
