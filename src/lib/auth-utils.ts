import { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

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
