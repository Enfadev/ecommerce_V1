import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface SessionUserWithRole {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "ADMIN" | "USER";
}

export async function getUserIdFromRequest(_request: NextRequest): Promise<string | null> {
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

  return null;
}

export async function getUserFromRequest(_request: NextRequest): Promise<{ id: string; role: string } | null> {
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

  return null;
}
