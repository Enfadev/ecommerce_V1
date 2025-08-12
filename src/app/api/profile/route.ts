import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('📍 Profile API called');
    
    // Try to get user info from middleware headers first
    let userId = request.headers.get('x-user-id');
    let userEmail = request.headers.get('x-user-email');
    
    console.log('🔍 Middleware headers - User ID:', userId, 'Email:', userEmail);
    
    // If no user ID from middleware, try to get from JWT cookie directly
    if (!userId) {
      console.log('⚠️ No user ID from middleware, checking JWT directly...');
      
      const token = request.cookies.get('auth-token')?.value;
      console.log('🍪 Cookie token exists:', !!token);
      
      if (!token) {
        console.log('❌ No auth token found in cookies');
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      console.log('🔑 Verifying JWT token...');
      const payload = await verifyJWT(token);
      
      if (!payload) {
        console.log('❌ JWT verification failed');
        return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
      }
      
      console.log('✅ JWT verified successfully for user:', payload.email);
      userId = payload.id;
      userEmail = payload.email;
    }

    console.log('👤 Getting profile for user ID:', userId);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      console.log('❌ User not found in database:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ Profile retrieved successfully for:', user.email);

    return NextResponse.json({
      user: {
        ...user,
        id: user.id.toString(),
      },
      debug: {
        fromMiddleware: !!request.headers.get('x-user-id'),
        userId: userId,
        userEmail: userEmail
      }
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    return NextResponse.json({ 
      error: 'Failed to get profile',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}
