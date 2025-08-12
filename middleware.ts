import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

// Protected paths that require authentication
const PROTECTED_PATHS = [
  '/admin',
  '/profile',
  '/order-history',
  '/wishlist',
  '/checkout',
];

// Protected API routes that require authentication
const PROTECTED_API_ROUTES = [
  '/api/admin',
  '/api/profile',
  '/api/orders',
  '/api/wishlist',
  '/api/checkout',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🛡️ Middleware executing for:', pathname);
  
  // Skip middleware for static files and public API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/api/test' ||
    pathname === '/jwt-test'
  ) {
    console.log('⏭️ Skipping middleware for:', pathname);
    return NextResponse.next();
  }

  // Check if current path requires authentication
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isProtectedAPI = PROTECTED_API_ROUTES.some(path => pathname.startsWith(path));
  
  if (isProtectedPath || isProtectedAPI) {
    console.log('🔒 Protected route detected:', pathname);
    
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      console.log('❌ No token found for protected route');
      
      if (isProtectedAPI) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      } else {
        const loginUrl = new URL('/signin', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    console.log('🔍 Verifying token for protected route...');
    console.log('🔍 Token preview:', token.substring(0, 50) + '...');
    
    // Verify JWT token
    const payload = await verifyJWT(token);
    
    if (!payload) {
      console.log('❌ Invalid token for protected route');
      
      if (isProtectedAPI) {
        return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
      } else {
        const loginUrl = new URL('/signin', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    console.log('✅ Token verified for user:', payload.email);
    
    // Admin route protection
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (payload.role !== 'ADMIN') {
        console.log('❌ User not admin, denying access to admin route');
        
        if (isProtectedAPI) {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    }

    // Create response with user context headers
    const response = NextResponse.next();
    
    // Add user context to headers for API routes
    response.headers.set('x-user-id', payload.id);
    response.headers.set('x-user-email', payload.email);
    response.headers.set('x-user-role', payload.role);
    
    console.log('✅ Middleware completed successfully for:', pathname);
    console.log('✅ Headers set - User ID:', payload.id, 'Email:', payload.email);
    
    return response;
  }

  console.log('✅ Public route, no authentication required:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
