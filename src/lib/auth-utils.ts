import { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface SessionUserWithRole {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "ADMIN" | "USER";
}

export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch (error) {
    console.log("Better Auth session check failed:", error);
  }

  try {
    const token = request.cookies.get("auth-token")?.value;
    if (token) {
      const payload = await verifyJWT(token);
      if (payload?.id) {
        return String(payload.id);
      }
    }
  } catch (error) {
    console.log("JWT verification failed:", error);
  }

  return null;
}

export async function getUserFromRequest(request: NextRequest): Promise<{ id: string; role: string } | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user?.id) {
      return {
        id: session.user.id,
        role: (session.user as SessionUserWithRole).role || "USER"
      };
    }
  } catch (error) {
    console.log("Better Auth session check failed:", error);
  }

  try {
    const token = request.cookies.get("auth-token")?.value;
    if (token) {
      const payload = await verifyJWT(token);
      if (payload?.id) {
        return {
          id: String(payload.id),
          role: payload.role || "USER"
        };
      }
    }
  } catch (error) {
    console.log("JWT verification failed:", error);
  }

  return null;
}
