import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const store: RateLimitStore = {};

export interface RateLimitConfig {
  requests: number;
  windowMs: number;
}

// Default configurations for different endpoints
export const rateLimitConfigs = {
  // Authentication endpoints - stricter limits
  auth: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  
  // API endpoints - moderate limits
  api: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  
  // Upload endpoints - very strict
  upload: { requests: 10, windowMs: 60 * 60 * 1000 }, // 10 requests per hour
  
  // Admin endpoints - moderate but monitored
  admin: { requests: 50, windowMs: 15 * 60 * 1000 }, // 50 requests per 15 minutes
};

export function getRateLimitKey(request: NextRequest, identifier?: string): string {
  // Use custom identifier or fall back to IP
  const id = identifier || getClientIP(request) || 'unknown';
  return `rate-limit:${id}`;
}

export function getClientIP(request: NextRequest): string | null {
  // Get IP from various headers (for different deployment scenarios)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback - in serverless environments, IP might not be available
  return null;
}

export function checkRateLimit(
  key: string, 
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Clean up old entries
  if (store[key] && store[key].resetTime < windowStart) {
    delete store[key];
  }
  
  // Initialize or get current count
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    return {
      allowed: true,
      remaining: config.requests - 1,
      resetTime: store[key].resetTime,
    };
  }
  
  // Check if limit exceeded
  if (store[key].count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    };
  }
  
  // Increment count
  store[key].count++;
  
  return {
    allowed: true,
    remaining: config.requests - store[key].count,
    resetTime: store[key].resetTime,
  };
}

export function createRateLimitResponse(
  resetTime: number,
  remaining: number = 0
): Response {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      retryAfter: retryAfter,
      message: `Too many requests. Please try again in ${retryAfter} seconds.`,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
      },
    }
  );
}

// Helper function to apply rate limiting to API routes
export function withRateLimit(
  handler: (request: NextRequest) => Promise<Response>,
  config: RateLimitConfig,
  identifier?: string
) {
  return async (request: NextRequest): Promise<Response> => {
    const key = getRateLimitKey(request, identifier);
    const { allowed, remaining, resetTime } = checkRateLimit(key, config);
    
    if (!allowed) {
      return createRateLimitResponse(resetTime, remaining);
    }
    
    // Add rate limit headers to successful responses
    const response = await handler(request);
    
    if (response.headers) {
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());
    }
    
    return response;
  };
}
