import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-fallback-secret-key-min-32-characters-long'
);

export interface CustomJWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Sign JWT token
export async function signJWT(payload: Omit<CustomJWTPayload, 'iat' | 'exp'>) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
    .sign(secret);
  
  return token;
}

// Verify JWT token
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
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Get token from request cookies
export function getTokenFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get('auth-token')?.value;
}

// Get user from token in request
export async function getUserFromRequest(request: NextRequest): Promise<CustomJWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  return await verifyJWT(token);
}

// Check if user is authenticated from request
export async function isAuthenticatedRequest(request: NextRequest): Promise<boolean> {
  const user = await getUserFromRequest(request);
  return !!user;
}

// Check if user is admin from request
export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const user = await getUserFromRequest(request);
  return user?.role === 'ADMIN';
}

// Set auth cookie in response
export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}

// Clear auth cookie in response
export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  return response;
}
