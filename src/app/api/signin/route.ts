import { NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { compare } from "bcryptjs";
import { signJWT, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signJWT({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userData } = user;

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
    if (process.env.NODE_ENV !== "production") {
      console.error("Sign in error:", error);
    }
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
