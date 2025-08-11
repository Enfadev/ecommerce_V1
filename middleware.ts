import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './src/lib/jwt';

// Define protected routes
const protectedRoutes = ['/admin', '/profile', '/order-history'];
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      // Redirect to signin if no token
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }

    try {
      const payload = await verifyJWT(token);
      
      if (!payload) {
        // Invalid token, redirect to signin
        const signInUrl = new URL('/signin', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Check admin access
      if (isAdminRoute && payload.role !== 'ADMIN') {
        // Not admin, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Add user info to headers for API routes
      const response = NextResponse.next();
      response.headers.set('x-user-id', payload.id);
      response.headers.set('x-user-email', payload.email);
      response.headers.set('x-user-role', payload.role);
      
      return response;
    } catch (error) {
      console.error('Middleware JWT verification error:', error);
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // For API routes, check authentication
  if (pathname.startsWith('/api/')) {
    // Public API routes that don't need authentication
    const publicApiRoutes = [
      '/api/signin',
      '/api/register',
      '/api/product',
      '/api/product/filter-options',
      '/api/home-page',
      '/api/about-page',
      '/api/contact-page',
      '/api/event-page',
      '/api/product-page'
    ];

    const isPublicApi = publicApiRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    );

    if (!isPublicApi) {
      const token = request.cookies.get('auth-token')?.value;
      
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      try {
        const payload = await verifyJWT(token);
        
        if (!payload) {
          return NextResponse.json(
            { error: 'Invalid authentication token' },
            { status: 401 }
          );
        }

        // Check admin-only API routes
        const adminApiRoutes = [
          '/api/user',
          '/api/upload'
        ];

        const isAdminApi = adminApiRoutes.some(route => 
          pathname.startsWith(route)
        );

        if (isAdminApi && payload.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          );
        }

        // Add user info to headers
        const response = NextResponse.next();
        response.headers.set('x-user-id', payload.id);
        response.headers.set('x-user-email', payload.email);
        response.headers.set('x-user-role', payload.role);
        
        return response;
      } catch (error) {
        console.error('API middleware JWT verification error:', error);
        return NextResponse.json(
          { error: 'Authentication verification failed' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/signin (signin endpoint)
     * - api/register (register endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
