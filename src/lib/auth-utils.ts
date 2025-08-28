import { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

interface SessionUserWithRole {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "ADMIN" | "USER";
}

export async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return Number(session.user.id);
    }
  } catch (error) {
    console.log("NextAuth session check failed:", error);
  }

  try {
    const token = request.cookies.get("auth-token")?.value;
    if (token) {
      const payload = await verifyJWT(token);
      if (payload?.id) {
        return Number(payload.id);
      }
    }
  } catch (error) {
    console.log("JWT verification failed:", error);
  }

  return null;
}

export async function getUserFromRequest(request: NextRequest): Promise<{ id: number; role: string } | null> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return {
        id: Number(session.user.id),
        role: (session.user as SessionUserWithRole).role || "USER"
      };
    }
  } catch (error) {
    console.log("NextAuth session check failed:", error);
  }

  try {
    const token = request.cookies.get("auth-token")?.value;
    if (token) {
      const payload = await verifyJWT(token);
      if (payload?.id) {
        return {
          id: Number(payload.id),
          role: payload.role || "USER"
        };
      }
    }
  } catch (error) {
    console.log("JWT verification failed:", error);
  }

  return null;
}
