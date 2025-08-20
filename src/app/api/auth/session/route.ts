import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "ADMIN" | "USER";
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session && session.user) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.user.id || "",
          name: session.user.name || "",
          email: session.user.email || "",
          role: (session.user as SessionUser).role || "USER",
          image: session.user.image,
        },
      });
    }

    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
