import { NextRequest } from 'next/server';
import { randomBytes, createHash } from 'crypto';

// CSRF token configuration
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf-token';

export function generateCSRFToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

export function hashCSRFToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function verifyCSRFToken(request: NextRequest): boolean {
  // Skip CSRF validation for GET, HEAD, OPTIONS
  const method = request.method;
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  // Get token from header
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER);
  
  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  if (!headerToken || !cookieToken) {
    return false;
  }

  // Verify tokens match
  const hashedHeaderToken = hashCSRFToken(headerToken);
  const hashedCookieToken = hashCSRFToken(cookieToken);

  return hashedHeaderToken === hashedCookieToken;
}

export function createCSRFResponse(): Response {
  return new Response(
    JSON.stringify({
      error: 'CSRF token validation failed',
      message: 'Invalid or missing CSRF token. Please refresh the page and try again.',
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Helper to get CSRF token for API endpoints
export function getCSRFToken(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || null;
}

// Helper to set CSRF token in response
export function setCSRFToken(response: Response, token?: string): Response {
  const csrfToken = token || generateCSRFToken();
  
  // Set token in cookie
  const headers = new Headers(response.headers);
  headers.set('Set-Cookie', `${CSRF_COOKIE_NAME}=${csrfToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600`);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
