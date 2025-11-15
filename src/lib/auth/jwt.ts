import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest as getUserFromRequestUtil } from "./auth-utils";

const getJWTSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (process.env.NODE_ENV === "production" && !jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required in production");
  }

  if (!jwtSecret) {
    console.warn("⚠️  Using default JWT secret for development. Set JWT_SECRET in .env.local for production!");
    return "your-fallback-secret-key-min-32-characters-long-dev-only";
  }

  if (jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }

  return jwtSecret;
};

const secret = new TextEncoder().encode(getJWTSecret());

export interface CustomJWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function signJWT(payload: Omit<CustomJWTPayload, "iat" | "exp">) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(secret);

  return token;
}

export async function verifyJWT(token: string): Promise<CustomJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.error("❌ JWT verification failed:", error);
    console.error("❌ Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      tokenLength: token?.length || 0,
    });
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get("auth-token")?.value;
}

// Note: getUserFromRequest is defined in auth-utils.ts to avoid conflicts
// export async function getUserFromRequest(request: NextRequest): Promise<CustomJWTPayload | null> {
//   const token = getTokenFromRequest(request);
//   if (!token) return null;
//
//   return await verifyJWT(token);
// }

export async function isAuthenticatedRequest(request: NextRequest): Promise<boolean> {
  const user = await getUserFromRequestUtil(request);
  return !!user;
}

export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const user = await getUserFromRequestUtil(request);
  return user?.role === "ADMIN";
}

export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    domain: isProduction ? undefined : undefined,
  });
  return response;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 0,
    path: "/",
    domain: isProduction ? undefined : undefined,
  });
  return response;
}
