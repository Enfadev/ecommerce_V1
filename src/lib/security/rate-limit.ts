import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  requests: number;
  windowMs: number;
}

export const rateLimitConfigs = {
  auth: { requests: 5, windowMs: 15 * 60 * 1000 },
  api: { requests: 100, windowMs: 15 * 60 * 1000 },
  upload: { requests: 10, windowMs: 60 * 60 * 1000 },
  admin: { requests: 50, windowMs: 15 * 60 * 1000 },
};

export function getRateLimitKey(request: NextRequest, identifier?: string): string {
  const id = identifier || getClientIP(request) || 'unknown';
  return `rate-limit:${id}`;
}

export function getClientIP(request: NextRequest): string | null {
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
  
  return null;
}

export function checkRateLimit(
  key: string, 
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  if (store[key] && store[key].resetTime < windowStart) {
    delete store[key];
  }
  
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
  
  if (store[key].count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    };
  }
  
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
    
    const response = await handler(request);
    
    if (response.headers) {
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());
    }
    
    return response;
  };
}
