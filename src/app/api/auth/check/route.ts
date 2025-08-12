import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Debug cookie information
    const cookies = request.cookies.getAll();
    const authToken = request.cookies.get('auth-token')?.value;
    
    console.log('🍪 All cookies:', cookies);
    console.log('🔑 Auth token:', authToken ? 'Present' : 'Missing');
    
    if (!authToken) {
      return NextResponse.json({
        authenticated: false,
        error: 'No auth token found',
        cookies: cookies.map(c => ({ name: c.name, hasValue: !!c.value }))
      });
    }

    // Verify JWT
    const payload = await verifyJWT(authToken);
    
    if (!payload) {
      return NextResponse.json({
        authenticated: false,
        error: 'Invalid token',
        tokenExists: true
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      tokenInfo: {
        exp: payload.exp,
        iat: payload.iat,
      }
    });
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      authenticated: false,
      error: 'Authentication verification failed',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
